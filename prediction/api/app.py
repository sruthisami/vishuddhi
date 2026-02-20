from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import numpy as np

app = Flask(__name__)
CORS(app)

# -----------------------------
# Load trained models
# -----------------------------
try:
    classifier = joblib.load("../models/classifier.joblib")
    print("✅ Classifier model loaded successfully")
except Exception as e:
    print(f"❌ Error loading classifier model: {e}")
    classifier = None

try:
    regressor = joblib.load("../models/regressor.joblib")
    print("✅ Regressor model loaded successfully")
except Exception as e:
    print(f"⚠️ Regressor model not found or failed to load: {e}")
    regressor = None


# -----------------------------
# Health Check Endpoint
# -----------------------------
@app.route("/")
def home():
    return jsonify({"message": "🧠 StressMate ML API is running"})


# -----------------------------
# Classifier Prediction Endpoint
# -----------------------------
@app.route("/predict/classifier", methods=["POST"])
def predict_classifier():
    if classifier is None:
        return jsonify({"error": "Classifier model not loaded"}), 500

    data = request.get_json()
    features = np.array(data.get("features")).reshape(1, -1)

    label = int(classifier.predict(features)[0])
    label_text = ["No Stress", "Low Stress", "Moderate Stress", "High Stress"][label]

    return jsonify({
        "label": label,
        "label_text": label_text
    })


# -----------------------------
# Regressor Prediction Endpoint
# -----------------------------
@app.route("/predict/regressor", methods=["POST"])
def predict_regressor():
    if regressor is None:
        return jsonify({"error": "Regressor model not loaded"}), 500

    data = request.get_json()
    features = np.array(data.get("features")).reshape(1, -1)

    period_stress = float(regressor.predict(features)[0])

    return jsonify({
        "period_stress": round(period_stress, 2)
    })


# -----------------------------
# Run Server
# -----------------------------
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
