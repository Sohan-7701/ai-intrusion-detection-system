import pickle
import json
import numpy as np

# Load model artifacts
model = pickle.load(open("model/rf_ids_model.pkl", "rb"))
scaler = pickle.load(open("model/scaler.pkl", "rb"))

with open("model/selected_features.json") as f:
    selected_features = json.load(f)


def predict(features):

    X = np.array(features).reshape(1, -1)

    X = scaler.transform(X)

    prediction = model.predict(X)[0]
    probability = model.predict_proba(X)[0][prediction]

    if prediction == 1:
        return {
            "label": "Intrusion Detected",
            "confidence": float(probability)
        }

    return {
        "label": "Normal Traffic",
        "confidence": float(probability)
    }