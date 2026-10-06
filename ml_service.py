import joblib
import os
import logging

MODEL_PATH = os.path.join(os.path.dirname(__file__), "ml", "elective_model.pkl")

# 2. MATCH THE SUBJECTS HERE EXACTLY
EXPECTED_SUBJECTS = ["ds", "dbms", "os", "cn", "se"]

try:
    if os.path.exists(MODEL_PATH): model = joblib.load(MODEL_PATH)
    else: model = None
except Exception:
    model = None

def predict_elective(marks: dict) -> str:
    if model is None: return "Model Not Trained"
    
    # Extract features safely
    features = [marks.get(subj, 0) for subj in EXPECTED_SUBJECTS]
    try:
        return model.predict([features])[0]
    except Exception:
        return "Prediction Failed"
