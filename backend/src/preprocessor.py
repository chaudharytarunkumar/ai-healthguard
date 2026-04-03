import pandas as pd
import numpy as np
from sklearn.pipeline import Pipeline
from sklearn.compose import ColumnTransformer
from sklearn.impute import SimpleImputer
from sklearn.preprocessing import StandardScaler
from imblearn.over_sampling import SMOTE
from imblearn.pipeline import Pipeline as ImbPipeline
import joblib
import os

NUMERICAL_FEATURES = ['age', 'trestbps', 'chol', 'thalach', 'oldpeak']
CATEGORICAL_FEATURES = ['cp', 'restecg', 'slope', 'thal']
# The rest are binary or ordinal that we can leave as is (except for imputing): 'sex', 'fbs', 'exang', 'ca'
BINARY_ORDINAL_FEATURES = ['sex', 'fbs', 'exang', 'ca']

# As per PRD SF-2 subset
SF_2_FEATURES = ['thalach', 'oldpeak', 'ca', 'thal', 'cp', 'exang', 'age', 'chol', 'trestbps', 'slope']

def get_preprocessor_pipeline():
    """
    Creates a scikit-learn ColumnTransformer that scales numerical features,
    and imputes missing values. Note: The PRD mentions One-Hot Encoding, 
    but since we are selecting specific raw features in SF-2 and the classes 
    are already numerically encoded (e.g. cp=0,1,2,3), we will keep them as 
    numerical and just impute/scale to prevent massive dimension changes 
    which complicate SHAP explanations later. 
    If strictly necessary, OHE could be added, but XGBoost/RF handle 
    categorical encoded as integers well. We will apply scaling to numerical.
    """
    numeric_transformer = Pipeline(steps=[
        ('imputer', SimpleImputer(strategy='median')),
        ('scaler', StandardScaler())
    ])

    categorical_transformer = Pipeline(steps=[
        ('imputer', SimpleImputer(strategy='most_frequent'))
    ])

    preprocessor = ColumnTransformer(
        transformers=[
            ('num', numeric_transformer, NUMERICAL_FEATURES),
            ('cat', categorical_transformer, CATEGORICAL_FEATURES + BINARY_ORDINAL_FEATURES)
        ],
        remainder='passthrough'
    )
    
    # We will build an imblearn pipeline to include SMOTE
    # However we just want to export the fitted preprocessor for inference later.
    return preprocessor

def apply_preprocessing_and_smote(X_train, y_train):
    """
    Applies the SF-2 feature selection (dropping non-SF-2 features),
    imputes missing values, scales numericals, and applies SMOTE.
    """
    # 1. Feature Selection (SF-2)
    X_train_sf2 = X_train[SF_2_FEATURES].copy()
    
    # 2. Imputation
    # We will manually impute here just to keep the dataframe format for model training (useful for SHAP)
    for col in SF_2_FEATURES:
        if col in NUMERICAL_FEATURES:
            X_train_sf2[col] = X_train_sf2[col].fillna(X_train_sf2[col].median())
        else:
            X_train_sf2[col] = X_train_sf2[col].fillna(X_train_sf2[col].mode()[0])
            
    # 3. Scaling
    scaler = StandardScaler()
    num_sf2 = [f for f in NUMERICAL_FEATURES if f in SF_2_FEATURES]
    X_train_sf2[num_sf2] = scaler.fit_transform(X_train_sf2[num_sf2])
    
    # Save the scaler for inference
    os.makedirs(os.path.join(os.path.dirname(__file__), '..', 'models'), exist_ok=True)
    joblib.dump(scaler, os.path.join(os.path.dirname(__file__), '..', 'models', 'scaler.pkl'))
    
    # 4. SMOTE
    smote = SMOTE(random_state=42)
    X_resampled, y_resampled = smote.fit_resample(X_train_sf2, y_train)
    
    return X_resampled, y_resampled

def preprocess_for_inference(X_raw):
    """
    Applies the saved scaler and selects SF-2 features for inference.
    Includes safety imputation for missing values.
    """
    X_sf2 = X_raw[SF_2_FEATURES].copy()
    
    # Safety Imputation (Ensures no NaNs reach the scaler/model)
    for col in SF_2_FEATURES:
        if col in NUMERICAL_FEATURES:
            X_sf2[col] = X_sf2[col].fillna(X_sf2[col].median() if not X_sf2[col].isna().all() else 0)
        else:
            X_sf2[col] = X_sf2[col].fillna(X_sf2[col].mode()[0] if not X_sf2[col].isna().all() else 0)

    scaler = joblib.load(os.path.join(os.path.dirname(__file__), '..', 'models', 'scaler.pkl'))
    
    num_sf2 = [f for f in NUMERICAL_FEATURES if f in SF_2_FEATURES]
    X_sf2[num_sf2] = scaler.transform(X_sf2[num_sf2])
    
    return X_sf2
