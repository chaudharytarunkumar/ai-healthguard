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
import json

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
    
    # 2. Imputation & Statistics Saving
    # We manually impute here and save the stats for consistent inference
    impute_stats = {}
    for col in SF_2_FEATURES:
        if col in NUMERICAL_FEATURES:
            fill_val = X_train_sf2[col].median()
            X_train_sf2[col] = X_train_sf2[col].fillna(fill_val)
            impute_stats[col] = float(fill_val)
        else:
            fill_val = X_train_sf2[col].mode()[0]
            X_train_sf2[col] = X_train_sf2[col].fillna(fill_val)
            impute_stats[col] = int(fill_val)
            
    # Save the stats for inference
    models_dir = os.path.join(os.path.dirname(__file__), '..', 'models')
    os.makedirs(models_dir, exist_ok=True)
    with open(os.path.join(models_dir, 'impute_stats.json'), 'w') as f:
        json.dump(impute_stats, f)
            
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
    Applies the saved scaler and selects SF_2_FEATURES for inference.
    Includes safety imputation for missing values using training-set statistics.
    """
    # 1. Feature Selection (SF-2)
    # Ensure all required features are present, fill with NaN if missing to allow imputation
    X_sf2 = pd.DataFrame(index=X_raw.index)
    for col in SF_2_FEATURES:
        if col in X_raw.columns:
            X_sf2[col] = X_raw[col]
        else:
            X_sf2[col] = np.nan
    
    # 2. Safety Imputation using training-set statistics
    models_dir = os.path.join(os.path.dirname(__file__), '..', 'models')
    stats_path = os.path.join(models_dir, 'impute_stats.json')
    
    if os.path.exists(stats_path):
        with open(stats_path, 'r') as f:
            impute_stats = json.load(f)
    else:
        print(f"WARNING: {stats_path} not found. Using hardcoded fallbacks.")
        # Fallback values if stats.json not found (Demo Mode)
        impute_stats = {
            'age': 54.0, 'trestbps': 130.0, 'chol': 240.0, 'thalach': 150.0, 'oldpeak': 0.8,
            'ca': 0, 'thal': 3, 'cp': 1, 'exang': 0, 'slope': 1
        }

    for col in SF_2_FEATURES:
        fill_val = impute_stats.get(col, 0)
        X_sf2[col] = X_sf2[col].fillna(fill_val)

    # 3. Scaling
    scaler_path = os.path.join(models_dir, 'scaler.pkl')
    if os.path.exists(scaler_path):
        scaler = joblib.load(scaler_path)
    else:
        print("WARNING: scaler.pkl not found. Using Identity Scaler for Demo Mode.")
        class DummyScaler:
            def transform(self, X): return X
        scaler = DummyScaler()
    
    num_sf2 = [f for f in NUMERICAL_FEATURES if f in SF_2_FEATURES]
    if hasattr(scaler, 'transform'):
        X_sf2[num_sf2] = scaler.transform(X_sf2[num_sf2])
    
    return X_sf2
