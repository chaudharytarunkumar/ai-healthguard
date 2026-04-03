from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score, roc_auc_score, confusion_matrix
import numpy as np
from .model_trainer import load_model

def evaluate_models(X_test, y_test):
    """
    Evaluates all 5 models and returns a dictionary of metrics.
    """
    models = ['lr', 'rf', 'xgb', 'svm', 'nn']
    results = []
    
    for m in models:
        model = load_model(m)
        
        if m == 'nn':
            y_prob = model.predict(X_test)
            y_pred = (y_prob > 0.5).astype(int).flatten()
            y_prob = y_prob.flatten()
        else:
            y_pred = model.predict(X_test)
            y_prob = model.predict_proba(X_test)[:, 1]
            
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
