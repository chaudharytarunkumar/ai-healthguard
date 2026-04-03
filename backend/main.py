from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import pandas as pd
import numpy as np

import sys
import os
sys.path.insert(0, os.path.dirname(__file__))

from src.model_trainer import load_model
from src.preprocessor import preprocess_for_inference
from src.explainer import get_local_shap_values
from src.risk_scorer import calculate_risk_score
from src.recommender import generate_recommendations
import json

app = FastAPI(title="AiHealth Guard API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class PatientData(BaseModel):
    age: float
    sex: int
    cp: int
    trestbps: float
    chol: float
    fbs: int
    restecg: int
    thalach: float
    exang: int
    oldpeak: float
    slope: int
    ca: float
    thal: int

@app.post("/api/predict")
async def predict_risk(data: PatientData, model_name: str = "xgb"):
    try:
        # Convert to DataFrame
        df = pd.DataFrame([data.model_dump()])
        
        # Preprocess
        X_processed = preprocess_for_inference(df)
        
        # Load Model and Predict
        model = load_model(model_name)
        if model_name == 'nn':
            prob_2d = model.predict(X_processed)
            prob = float(prob_2d[0][0])
        else:
            prob = float(model.predict_proba(X_processed)[0][1])
            
        prediction = 1 if prob > 0.5 else 0
        
        # Calculate Risk Score
        risk_score, risk_level = calculate_risk_score(prob)
        
        # Explainability
        shap_dict = get_local_shap_values(model_name, X_processed)
        
        # Recommendations
        recommendations = generate_recommendations(shap_dict, risk_score)
        
        return {
            "prediction": prediction,
            "probability": prob,
            "risk_score": risk_score,
            "risk_level": risk_level,
            "shap": shap_dict,
            "recommendations": recommendations
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse

@app.get("/api/metrics")
async def get_metrics():
    # Attempt to load precomputed metrics if available, otherwise would return dummy or train on fly
    # To keep this fast, usually we train beforehand and save a metrics.json
    try:
        import os
        metrics_path = os.path.join(os.path.dirname(__file__), 'models', 'metrics.json')
        if os.path.exists(metrics_path):
            with open(metrics_path, 'r') as f:
                return json.load(f)
        return {"message": "Metrics not found. Please run train.py first."}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# For Railway Deployment: Mount the Vite React 'dist' directory
# This must come AFTER all /api routes so it doesn't block them.
import os
dist_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), "dist")
if os.path.exists(dist_path):
    app.mount("/", StaticFiles(directory=dist_path, html=True), name="static")
    
    # Catch-all route to serve index.html for React Router (SPA fallback)
    @app.get("/{full_path:path}")
    async def serve_vue_app(full_path: str):
        index_file = os.path.join(dist_path, "index.html")
        if os.path.exists(index_file):
            return FileResponse(index_file)
        return {"message": "Frontend not built yet. Run npm run build."}

if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=True)
