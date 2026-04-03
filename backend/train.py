import sys
import os
import json
sys.path.insert(0, os.path.dirname(__file__))

from src.data_loader import get_train_test_data
from src.preprocessor import apply_preprocessing_and_smote, SF_2_FEATURES
from src.model_trainer import train_and_save_models
from src.evaluator import evaluate_models

def main():
    print("Loading data...")
    X_train, X_test, y_train, y_test = get_train_test_data()
    
    print("Preprocessing and applying SMOTE...")
    X_train_resampled, y_train_resampled = apply_preprocessing_and_smote(X_train, y_train)
    
    # Process test set based on same features and scalers
    # Note: the test set must only use the transformed features, scaled correctly.
    # The preprocessor currently saves the scaler inside apply_preprocessing_and_smote
    # so we must load it. For training scripts it's clean to just run it and then preprocess.
    from src.preprocessor import preprocess_for_inference
    X_test_sf2 = preprocess_for_inference(X_test)
    
    print("Training models...")
    train_and_save_models(X_train_resampled, y_train_resampled)
    
    print("Evaluating models...")
    metrics = evaluate_models(X_test_sf2, y_test)
    
    # Save metrics
    models_dir = os.path.join(os.path.dirname(__file__), 'models')
    os.makedirs(models_dir, exist_ok=True)
    with open(os.path.join(models_dir, 'metrics.json'), 'w') as f:
        json.dump(metrics, f, indent=4)
        
    print("Metrics saved. Pipeline complete.")
    for m in metrics:
        if m['model'] == 'XGB':
            print(f"XGBoost Test Accuracy: {m['accuracy']*100:.2f}% (Target: >=90%)")

if __name__ == "__main__":
    main()
