from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score, roc_auc_score, confusion_matrix
import numpy as np
from .model_trainer import load_model

def evaluate_models(X_test, y_test):
    """
    Evaluates all models and returns a dictionary of metrics.
    """
    models = ['lr', 'rf', 'xgb', 'svm', 'nn', 'stacking']
    results = []
    
    # Load and apply feature selection for Models that used it (XGB and Stacking)
    import os
    import joblib
    models_dir = os.path.join(os.path.dirname(__file__), '..', 'models')
    selector_path = os.path.join(models_dir, 'selector.pkl')
    
    X_test_selected = X_test
    if os.path.exists(selector_path):
        selector = joblib.load(selector_path)
        X_test_selected = selector.transform(X_test)
        print("Feature selection applied to test data for XGB and Stacking.")

    for m in models:
        model = load_model(m)
        
        # Determine which test set to use based on model
        # Note: XGB and Stacking are now trained on the full interaction set
        X_curr = X_test
        
        if m == 'nn':
            y_prob = model.predict(X_curr, verbose=0)
            y_pred = (y_prob > 0.5).astype(int).flatten()
            y_prob = y_prob.flatten()
        else:
            y_pred = model.predict(X_curr)
            y_prob = model.predict_proba(X_curr)[:, 1]
            
        acc = accuracy_score(y_test, y_pred)
        prec = precision_score(y_test, y_pred, zero_division=0)
        rec = recall_score(y_test, y_pred, zero_division=0)
        f1 = f1_score(y_test, y_pred, zero_division=0)
        auc = roc_auc_score(y_test, y_prob)
        cm = confusion_matrix(y_test, y_pred).tolist()
        
        results.append({
            "model": m.upper(),
            "accuracy": round(acc, 4),
            "precision": round(prec, 4),
            "recall": round(rec, 4),
            "f1_score": round(f1, 4),
            "auc": round(auc, 4),
            "confusion_matrix": cm
        })
        
    return results
