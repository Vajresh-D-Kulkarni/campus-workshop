import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestClassifier
import joblib
import os

# 1. CHANGE SUBJECTS HERE IN THE FUTURE
SUBJECTS = ["ds", "dbms", "os", "cn", "se"]
ELECTIVES = ["Artificial Intelligence", "Full Stack Web Development", "Cloud Computing", "Cybersecurity"]

def generate_synthetic_data(num_samples=10000):
    np.random.seed(42)
    data = []
    for _ in range(num_samples):
        marks = {subj: np.random.randint(40, 101) for subj in SUBJECTS}
        
        # Simple logical rules
        if marks["ds"] > 80 and marks["dbms"] > 80: target = "Artificial Intelligence"
        elif marks["cn"] > 85 and marks["os"] > 80: target = "Cybersecurity"
        elif marks["se"] > 85: target = "Full Stack Web Development"
        else: target = "Cloud Computing"
            
        row = list(marks.values()) + [target]
        data.append(row)
        
    return pd.DataFrame(data, columns=SUBJECTS + ["target"])

if __name__ == "__main__":
    df = generate_synthetic_data()
    X, y = df[SUBJECTS], df["target"]
    
    model = RandomForestClassifier(n_estimators=100, random_state=42)
    model.fit(X, y)
    
    os.makedirs(os.path.dirname(__file__), exist_ok=True)
    model_path = os.path.join(os.path.dirname(__file__), "elective_model.pkl")
    joblib.dump(model, model_path)
    print(f"Model saved to {model_path}")
