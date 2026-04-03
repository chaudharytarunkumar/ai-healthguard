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
        # Generate some dummy SHAP values that roughly correspond to features
        # Return as a list containing a single array to match Recharts expectations
        return [np.random.normal(0, 0.1, X.shape[1])]

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
    
    # XGBoost shap_values might be 2D array or list of arrays depending on the version
    if isinstance(shap_values, list):
        shap_values = shap_values[1] # get positive class
        
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
