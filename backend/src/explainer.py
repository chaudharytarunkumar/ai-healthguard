import shap
import pandas as pd
import numpy as np
import os
from .model_trainer import load_model

class MockExplainer:
    def __init__(self, model):
        self.model = model
        self.expected_value = 0.45
    def shap_values(self, X):
        # Return a list of two arrays to match binary classification expectation (0, 1)
        val = np.random.normal(0, 0.1, X.shape[1])
        return [-val, val]

def get_shap_explainer(model_name="xgb", X_background=None):
    model = load_model(model_name)
    
    # Check if we are in DEMO MODE
    from .model_trainer import MockModel
    if isinstance(model, MockModel):
        return MockExplainer(model)
        
    if model_name in ['rf', 'xgb']:
        explainer = shap.TreeExplainer(model)
    else:
        if X_background is None:
            bg_path = os.path.join(os.path.dirname(__file__), '..', 'models', 'background.csv')
            if os.path.exists(bg_path):
                X_background = pd.read_csv(bg_path)
            else:
                from .preprocessor import SF_2_FEATURES
                X_background = pd.DataFrame(np.zeros((10, len(SF_2_FEATURES))), columns=SF_2_FEATURES)
                
        # Use KernelExplainer for others, requires background dataset
        if model_name == 'nn':
            # Wrapper to ensure NN predict returns 1D array for SHAP
            def nn_predict_wrapper(x):
                return model.predict(x).flatten()
            explainer = shap.KernelExplainer(nn_predict_wrapper, X_background)
        else:
            explainer = shap.KernelExplainer(model.predict_proba, X_background)
    return explainer

def get_local_shap_values(model_name, X_instance, X_background=None):
    explainer = get_shap_explainer(model_name, X_background)
    shap_values = explainer.shap_values(X_instance)
    
    # SHAP values for binary classifiers often return a list [class0, class1] 
    # or a 3D array (samples, features, classes), or just a 2D array (samples, features).
    if isinstance(shap_values, list):
        # If it's a list with 2 elements, index 1 is the positive class.
        # If it's a list with 1 element, we take that element.
        shap_values = shap_values[1] if len(shap_values) > 1 else shap_values[0]
        
    # Get base value
    if isinstance(explainer.expected_value, (list, np.ndarray)):
        base_value = explainer.expected_value[1] if len(explainer.expected_value) > 1 else explainer.expected_value[0]
    else:
        base_value = explainer.expected_value
        
    return {
        "shap_values": shap_values[0].tolist() if hasattr(shap_values, 'tolist') else shap_values, # single instance
        "base_value": float(base_value),
        "features": X_instance.iloc[0].to_dict()
    }
