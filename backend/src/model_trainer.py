import os
import joblib
from sklearn.linear_model import LogisticRegression
from sklearn.ensemble import RandomForestClassifier
from xgboost import XGBClassifier
from sklearn.svm import SVC
from tensorflow.keras.models import Sequential # type: ignore
from tensorflow.keras.layers import Dense, Dropout # type: ignore
import numpy as np

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
    
    # 3. XGBoost
    print("Training XGBoost...")
    xgb = XGBClassifier(n_estimators=100, learning_rate=0.1, max_depth=3, random_state=42)
    xgb.fit(X_train, y_train)
    joblib.dump(xgb, os.path.join(models_dir, 'xgb.pkl'))
    
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
    
    print("All models trained and saved successfully.")
    
def load_model(model_name="xgb"):
    models_dir = os.path.join(os.path.dirname(__file__), '..', 'models')
    if model_name == "nn":
        from tensorflow.keras.models import load_model as keras_load_model
        return keras_load_model(os.path.join(models_dir, 'nn.keras'))
    else:
        return joblib.load(os.path.join(models_dir, f'{model_name}.pkl'))
