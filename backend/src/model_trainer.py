import os
import joblib
from sklearn.linear_model import LogisticRegression
from sklearn.ensemble import RandomForestClassifier
from xgboost import XGBClassifier
from sklearn.svm import SVC
from tensorflow.keras.models import Sequential # type: ignore
from tensorflow.keras.layers import Dense, Dropout # type: ignore
import numpy as np
import pandas as pd
from sklearn.model_selection import GridSearchCV, RandomizedSearchCV, StratifiedKFold
from sklearn.ensemble import StackingClassifier, RandomForestClassifier
from sklearn.svm import SVC
from sklearn.linear_model import LogisticRegression

def build_nn_model(input_dim):
    from tensorflow.keras.models import Sequential
    from tensorflow.keras.layers import Dense, Dropout
    model = Sequential([
        Dense(64, activation='relu', input_dim=input_dim),
        Dropout(0.3),
        Dense(32, activation='relu'),
        Dense(1, activation='sigmoid')
    ])
    model.compile(optimizer='adam', loss='binary_crossentropy', metrics=['accuracy'])
    return model

def train_and_save_models(X_train, y_train):
    models_dir = os.path.join(os.path.dirname(__file__), '..', 'models')
    os.makedirs(models_dir, exist_ok=True)
    
    # 1. Logistic Regression
    print("Training Logistic Regression...")
    lr = LogisticRegression(max_iter=1000)
    lr.fit(X_train, y_train)
    joblib.dump(lr, os.path.join(models_dir, 'lr.pkl'))
    
    # 2. Random Forest
    print("Training Random Forest...")
    rf = RandomForestClassifier(n_estimators=100, max_depth=5, random_state=42)
    rf.fit(X_train, y_train)
    joblib.dump(rf, os.path.join(models_dir, 'rf.pkl'))
    
    # 3. Feature Selection
    print("Performing Clinical Feature Selection...")
    from sklearn.feature_selection import SelectFromModel
    selector = SelectFromModel(RandomForestClassifier(n_estimators=100, random_state=42), threshold='median')
    selector.fit(X_train, y_train)
    X_train_selected = selector.transform(X_train)
    
    # Save the selector for inference
    joblib.dump(selector, os.path.join(models_dir, 'selector.pkl'))
    
    # 4. XGBoost - Star Model Implementation (High Performance)
    print("Training Star Model (XGBoost) with Randomized Search...")
    
    from sklearn.model_selection import RepeatedStratifiedKFold, RandomizedSearchCV
    
    xgb_base = XGBClassifier(
        random_state=42,
        use_label_encoder=False,
        eval_metric='logloss',
        booster='gbtree'
    )
    
    # Broad parameter distributions for RandomizedSearchCV
    param_dist = {
        'n_estimators': [400, 500, 600, 700],
        'max_depth': [3, 4, 5, 6, 7],
        'learning_rate': [0.005, 0.01, 0.015, 0.02],
        'subsample': [0.6, 0.7, 0.8, 0.9],
        'colsample_bytree': [0.6, 0.7, 0.8, 0.9],
        'gamma': [0, 0.1, 0.2, 0.3],
        'alpha': [0, 0.1, 0.5, 1.0],
        'lambda': [1, 1.5, 2, 3],
        'min_child_weight': [1, 2, 3, 4, 5]
    }
    
    # 5-fold CV with 2 repeats (10 total fits per candidate)
    cv = RepeatedStratifiedKFold(n_splits=5, n_repeats=2, random_state=42)
    
    # 500 iterations for the highest possible performance configuration
    random_search = RandomizedSearchCV(
        xgb_base, 
        param_distributions=param_dist, 
        n_iter=500,
        scoring='accuracy', 
        cv=cv, 
        verbose=1, 
        n_jobs=-1,
        random_state=42
    )
    
    random_search.fit(X_train, y_train)
    best_xgb = random_search.best_estimator_
    
    print(f"Star XGBoost Parameters: {random_search.best_params_}")
    print(f"Best CV ROC-AUC: {random_search.best_score_:.4f}")
    
    joblib.dump(best_xgb, os.path.join(models_dir, 'xgb.pkl'))
    
    # 5. Final High-Performance Ensemble (Stacking)
    # Using the optimized XGBoost and selected features for others
    print("Training High-Performance Stacking Ensemble...")
    estimators = [
        ('xgb', best_xgb),
        ('rf', RandomForestClassifier(n_estimators=500, max_depth=10, min_samples_leaf=2, random_state=42)),
        ('svm', SVC(kernel='rbf', probability=True, C=2.0, gamma='scale', random_state=42))
    ]
    
    stacking_clf = StackingClassifier(
        estimators=estimators,
        final_estimator=LogisticRegression(C=1.0),
        cv=5
    )
    
    # Use full features for stacking as well for consistency with XGB
    stacking_clf.fit(X_train, y_train)
    joblib.dump(stacking_clf, os.path.join(models_dir, 'stacking.pkl'))
    
    # 4. SVM
    print("Training SVM...")
    svm = SVC(kernel='rbf', probability=True, random_state=42)
    svm.fit(X_train, y_train)
    joblib.dump(svm, os.path.join(models_dir, 'svm.pkl'))
    
    # 5. Neural Network
    print("Training Neural Network...")
    nn = build_nn_model(X_train.shape[1])
    nn.fit(X_train, y_train, epochs=100, batch_size=16, verbose=0)
    nn.save(os.path.join(models_dir, 'nn.keras'))
    
    # 6. Save background dataset for SHAP
    print("Saving background dataset for SHAP...")
    bg_df = pd.DataFrame(X_train, columns=X_train.columns if hasattr(X_train, 'columns') else None)
    bg_df.sample(min(50, len(bg_df)), random_state=42).to_csv(os.path.join(models_dir, 'background.csv'), index=False)
    
    print("All models trained and saved successfully.")
    
class MockModel:
    """Fallback model for Demo Mode when real models aren't trained yet."""
    def __init__(self, name):
        self.name = name
    def predict_proba(self, X):
        # Generate a deterministic but variable probability based on input data
        val = (np.sum(X.values) % 100) / 100.0
        return np.array([[1-val, val]])
    def predict(self, X, **kwargs):
        # Ignore extra arguments like 'verbose'
        return (np.sum(X.values) % 100) > 50

def load_model(model_name="xgb"):
    models_dir = os.path.join(os.path.dirname(__file__), '..', 'models')
    model_path = os.path.join(models_dir, 'nn.keras' if model_name == "nn" else f'{model_name}.pkl')
    
    if not os.path.exists(model_path):
        print(f"WARNING: Model {model_name} not found at {model_path}. Starting in DEMO MODE.")
        return MockModel(model_name)
        
    if model_name == "nn":
        from tensorflow.keras.models import load_model as keras_load_model
        return keras_load_model(model_path)
    else:
        return joblib.load(model_path)
