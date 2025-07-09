import os
import uuid
import json
import bcrypt
import requests
import numpy as np
import mysql.connector
from datetime import datetime, timedelta
from dotenv import load_dotenv
from flask import Flask, request, jsonify, session, send_from_directory
from flask_cors import CORS
from tensorflow.keras.models import Model
from tensorflow.keras.applications.efficientnet import EfficientNetB0, preprocess_input
from tensorflow.keras.preprocessing import image
from tensorflow.keras.layers import GlobalAveragePooling2D, Dense, Dropout
from mysql.connector import Error

# === Load Env Variables ===
load_dotenv()
GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")
GOOGLE_MAPS_EMBED_KEY = os.getenv("GOOGLE_MAPS_EMBED_KEY")

MODEL_PATH = "model-2/model_weights.h5"
LABELS_PATH = "model-2/class_labels.txt"
EXPLANATION_FILE = "disease_explanations.json"
UPLOAD_DIR = "uploads"

DB_CONFIG = {
    'host': 'localhost',
    'user': 'root',
    'password': 'Swami@2006',
    'database': 'hackorbit_'
}

app = Flask(__name__)
app.secret_key = 'vedarala_secret_2025'
app.permanent_session_lifetime = timedelta(days=7)
CORS(app, supports_credentials=True)

# === Load Labels ===
try:
    with open(LABELS_PATH, "r") as f:
        class_names = [line.strip() for line in f]
except:
    class_names = ["benign", "melanoma", "nevus"]

# === Build Model ===
def build_model():
    base = EfficientNetB0(include_top=False, weights="imagenet", input_shape=(224, 224, 3))
    x = GlobalAveragePooling2D()(base.output)
    x = Dropout(0.4)(x)
    x = Dense(128, activation="relu")(x)
    output = Dense(len(class_names), activation="softmax")(x)
    model = Model(inputs=base.input, outputs=output)
    model.load_weights(MODEL_PATH)
    return model

model = build_model()

# === DB Connection ===
def get_db_connection():
    try:
        return mysql.connector.connect(**DB_CONFIG)
    except Error as e:
        print("❌ DB Connection Error:", e)
        return None

# === Severity Estimator (used in UI only) ===
def estimate_severity(prediction, confidence):
    if prediction.lower() == "melanoma":
        if confidence >= 90: return "Severe"
        elif confidence >= 70: return "Moderate"
        else: return "Mild"
    elif prediction.lower() == "nevus":
        if confidence >= 85: return "Severe"
        elif confidence >= 60: return "Moderate"
        else: return "Mild"
    elif prediction.lower() == "benign":
        if confidence >= 85: return "Moderate"
        else: return "Mild"
    return "Unknown"

# === Register ===
@app.route("/api/register", methods=["POST"])
def register():
    data = request.get_json()
    full_name = data.get("full_name", "").strip()
    email = data.get("email", "").strip()
    password = data.get("password", "").strip()

    if not all([full_name, email, password]):
        return jsonify({"error": "Missing fields"}), 400

    username = email.split("@")[0]
    hashed_pw = bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")

    try:
        conn = get_db_connection()
        cur = conn.cursor()
        cur.execute("""
            INSERT INTO users (username, password_hash, email, full_name)
            VALUES (%s, %s, %s, %s)
        """, (username, hashed_pw, email, full_name))
        conn.commit()
        cur.close()
        conn.close()
        return jsonify({"message": "Registration successful"}), 201
    except mysql.connector.IntegrityError:
        return jsonify({"error": "Email or username already exists"}), 409
    except Exception as e:
        print("❌ Register Error:", e)
        return jsonify({"error": "Server error"}), 500

# === Login ===
@app.route("/api/login", methods=["POST"])
def login():
    data = request.get_json()
    email = data.get("email", "").strip()
    password = data.get("password", "").strip()

    if not email or not password:
        return jsonify({"error": "Missing email or password"}), 400

    try:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT * FROM users WHERE email = %s", (email,))
        user = cursor.fetchone()
        cursor.close()
        conn.close()

        if user and bcrypt.checkpw(password.encode("utf-8"), user["password_hash"].encode("utf-8")):
            session["user_id"] = user["id"]
            return jsonify({"message": "Login successful"}), 200
        else:
            return jsonify({"error": "Invalid credentials"}), 401
    except Exception as e:
        print("❌ Login Error:", e)
        return jsonify({"error": "Server error"}), 500

@app.route("/api/logout", methods=["POST"])
def logout():
    session.clear()
    return jsonify({"message": "Logged out"}), 200

@app.route("/api/health", methods=["GET"])
def health():
    return jsonify({"loggedIn": bool(session.get("user_id"))}), 200

# === Predict ===
@app.route("/api/predict", methods=["POST"])
def predict():
    if "file" not in request.files:
        return jsonify({"error": "No image uploaded"}), 400

    file = request.files["file"]
    os.makedirs(UPLOAD_DIR, exist_ok=True)
    filename = f"{uuid.uuid4().hex}.jpg"
    path = os.path.join(UPLOAD_DIR, filename)
    file.save(path)

    img = image.load_img(path, target_size=(224, 224))
    arr = preprocess_input(np.expand_dims(image.img_to_array(img), 0))
    preds = model.predict(arr)[0]
    label = class_names[np.argmax(preds)]
    conf = round(float(np.max(preds)) * 100, 2)
    severity = estimate_severity(label, conf)

    # Save prediction without severity
    if session.get("user_id"):
        try:
            conn = get_db_connection()
            cur = conn.cursor()
            cur.execute("""
                INSERT INTO skin_analysis (user_id, image_path, prediction, confidence)
                VALUES (%s, %s, %s, %s)
            """, (session["user_id"], path, label, conf))
            conn.commit()
            cur.close()
            conn.close()
        except Exception as e:
            print("❌ DB Insert Error:", e)

    return jsonify({
        "prediction": label,
        "confidence": f"{conf}%",
        "severity": severity,
        "path": path
    })

# === Explanation from local JSON ===
@app.route("/api/explain-disease", methods=["POST"])
def explain_disease():
    data = request.get_json()
    condition = data.get("condition", "").capitalize()
    severity = data.get("severity", "").capitalize()

    try:
        with open(EXPLANATION_FILE, "r") as f:
            explanations = json.load(f)
        explanation = explanations.get(condition, {}).get(severity)
        if explanation:
            return jsonify({"explanation": explanation}), 200
        else:
            return jsonify({"error": "Explanation not found"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# === Save Report Manually (for button) ===
@app.route("/api/save-report", methods=["POST"])
def save_report():
    if not session.get("user_id"):
        return jsonify({"error": "Not logged in"}), 401

    data = request.get_json()
    prediction = data.get("prediction")
    confidence = data.get("confidence", "").replace("%", "")
    image_path = data.get("image_path")

    if not all([prediction, confidence, image_path]):
        return jsonify({"error": "Missing report data"}), 400

    try:
        conn = get_db_connection()
        cur = conn.cursor()
        cur.execute("""
            INSERT INTO skin_analysis (user_id, image_path, prediction, confidence)
            VALUES (%s, %s, %s, %s)
        """, (session["user_id"], image_path, prediction, float(confidence)))
        conn.commit()
        cur.close()
        conn.close()
        return jsonify({"message": "Report saved"}), 200
    except Exception as e:
        print("❌ Save Report Error:", e)
        return jsonify({"error": "Failed to save report"}), 500

# === View Past Reports (Scan Page only) ===
@app.route("/api/analysis-history", methods=["GET"])
def analysis_history():
    if not session.get("user_id"):
        return jsonify({"error": "Not logged in"}), 401

    try:
        conn = get_db_connection()
        cur = conn.cursor(dictionary=True)
        cur.execute("""
            SELECT prediction, confidence, image_path, analysis_date
            FROM skin_analysis
            WHERE user_id = %s
            ORDER BY analysis_date DESC
            LIMIT 10
        """, (session["user_id"],))
        results = cur.fetchall()
        cur.close()
        conn.close()
        return jsonify({"history": results}), 200
    except Exception as e:
        print("❌ Fetch History Error:", e)
        return jsonify({"error": "Failed to fetch history"}), 500

# === Serve Uploaded Images ===
@app.route("/uploads/<path:filename>")
def uploaded_file(filename):
    return send_from_directory("uploads", filename)

# === Doctor Search (Google Maps Nearby Search) ===
@app.route("/api/get-map-key", methods=["GET"])
def get_map_key():
    return jsonify({"key": GOOGLE_MAPS_EMBED_KEY})

@app.route("/api/search-doctors", methods=["POST"])
def search_doctors():
    data = request.get_json()
    lat, lon = data.get("lat"), data.get("lon")
    if not lat or not lon:
        return jsonify({"error": "Coordinates missing"}), 400

    try:
        url = f"https://maps.googleapis.com/maps/api/place/nearbysearch/json?location={lat},{lon}&radius=5000&type=doctor&keyword=dermatologist&key={GOOGLE_API_KEY}"
        res = requests.get(url).json()
        doctors = [{
            "name": place.get("name"),
            "address": place.get("vicinity"),
            "rating": place.get("rating", "N/A")
        } for place in res.get("results", [])[:5]]
        return jsonify({"doctors": doctors}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# === Run Flask App ===
if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=5000)
