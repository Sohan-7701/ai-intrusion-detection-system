from fastapi import FastAPI, HTTPException, Request
import os
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import joblib
import json
from utils.preprocess import preprocess_input

print("🔥 RUNNING FINAL app.py 🔥")

# -------------------
# FastAPI app
# -------------------
app = FastAPI(
    title="IDS Backend API",
    version="1.0.0",
    description="AI-powered Intrusion Detection System backend"
)

# -------------------
# CORS Middleware
# -------------------
# CORS configuration
# Default to allowing all origins in local/dev environment to avoid CORS during testing.
# To lock down in production, set ALLOW_ALL_ORIGINS=0 or ALLOW_ALL_ORIGINS=false in the env.
ALLOW_ALL = os.environ.get("ALLOW_ALL_ORIGINS", "true").lower() in ("1", "true", "yes")

if ALLOW_ALL:
    cors_origins = ["*"]
else:
    cors_origins = [
        "http://localhost:8080",
        "http://127.0.0.1:8080",
        "http://0.0.0.0:8080",
        # Vite dev server (default)
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        # Add LAN/dev host so the frontend served at this IP can call the backend
        "http://10.24.182.232:8080",
    ]

print(f"🔐 CORS allow_origins set to: {cors_origins}")

app.add_middleware(
    CORSMiddleware,
    allow_origins=cors_origins,
    allow_credentials=True,
    allow_methods=["*"],   # IMPORTANT: allow OPTIONS
    allow_headers=["*"],
)

# -------------------
# Load model artifacts
# -------------------
MODEL_PATH = "model/rf_ids_model.pkl"
SCALER_PATH = "model/scaler.pkl"
FEATURES_PATH = "model/selected_features.json"

try:
    model = joblib.load(MODEL_PATH)
    scaler = joblib.load(SCALER_PATH)

    with open(FEATURES_PATH, "r") as f:
        selected_features = json.load(f)

    print("✅ Model, scaler, and features loaded")

except Exception as e:
    print("❌ Failed to load model artifacts:", e)
    raise e

# -------------------
# Input schema
# -------------------
class TrafficData(BaseModel):
    data: dict

# -------------------
# Routes
# -------------------
@app.get("/")
def root():
    return {"message": "IDS Backend is Online"}

@app.post("/predict")
async def predict(request: Request):
    """Accepts either {"data": {...}} or a raw features object in the request body.

    Logs incoming body and headers to help debug mismatched frontend requests.
    """
    try:
        # Read raw JSON body so we can accept either shape
        body = await request.json()

        print("➡️ Incoming /predict request body:", body)
        print("➡️ Incoming request headers:", dict(request.headers))

        # Support both { "data": {...} } and raw {...}
        if isinstance(body, dict) and "data" in body:
            data_obj = body.get("data")
        else:
            data_obj = body

        if not isinstance(data_obj, dict) or not data_obj:
            raise ValueError("Request JSON must contain a non-empty object of features (either raw or under the 'data' key)")

        processed_data = preprocess_input(
            data_obj,
            scaler,
            selected_features,
        )

        prediction = model.predict(processed_data)[0]

        if hasattr(model, "predict_proba"):
            probability = model.predict_proba(processed_data)[0].tolist()
        else:
            probability = []

        return {
            "prediction": "Intrusion Detected" if prediction == 1 else "Normal Traffic",
            "probability": probability,
        }

    except Exception as e:
        # Log full traceback for easier debugging in server logs
        import traceback

        print("❌ PREDICT ERROR:", repr(e))
        traceback.print_exc()

        # Return 500 for unexpected server errors, 400 for known input errors
        status = 400 if isinstance(e, ValueError) else 500
        raise HTTPException(
            status_code=status,
            detail=str(e)
        )

