import os
import uuid
import json
import bcrypt
import requests
import numpy as np
import mysql.connector
from datetime import datetime
from dotenv import load_dotenv
from flask import Flask, request, jsonify, session
from flask_cors import CORS
from tensorflow.keras.models import Model
from tensorflow.keras.applications.efficientnet import EfficientNetB0, preprocess_input
from tensorflow.keras.preprocessing import image
from tensorflow.keras.layers import GlobalAveragePooling2D, Dense, Dropout
from mysql.connector import Error
import openai  # ✅ NEW

# === Load .env variables ===
load_dotenv()

OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")
GOOGLE_MAPS_EMBED_KEY = os.getenv("GOOGLE_MAPS_EMBED_KEY")

# === OpenAI Client ===
client = openai.OpenAI(api_key=OPENAI_API_KEY)

# === Config ===
MODEL_PATH = "C:/Users/Samarth Kale/Documents/GitHub/Hackorbit-Hackathon/model-2/model_weights.h5"
LABELS_PATH = "C:/Users/Samarth Kale/Documents/GitHub/Hackorbit-Hackathon/model-2/class_labels.txt"
UPLOAD_DIR = "uploads"

DB_CONFIG = {
    'host': 'localhost',
    'user': 'root',
    'password': 'Swami@2006',
    'database': 'hackorbit_'
}

app = Flask(__name__)
app.secret_key = 'vedarala_secret_2025'
CORS(app, supports_credentials=True)

# === Load Class Labels ===
try:
    with open(LABELS_PATH, "r") as f:
        class_names = [line.strip() for line in f.readlines()]
except:
    class_names = ["benign", "malignant", "normal"]

# === Load CNN Model ===
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
        print("DB Error:", e)
        return None

# === Routes ===

@app.route("/api/predict", methods=["POST"])
def predict():
    if "file" not in request.files:
        return jsonify({"error": "No image provided"}), 400
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
        except:
            pass

    return jsonify({"prediction": label, "confidence": f"{conf}%", "path": path})

@app.route("/api/explain-disease", methods=["POST"])
def explain_disease():
    data = request.get_json()
    condition = data.get("condition", "")
    if not condition:
        return jsonify({"error": "Condition required"}), 400

    try:
        prompt = f"Explain in simple terms what '{condition}' is, what its symptoms are, how serious it is, and what treatments are available. Make it easy for a patient to understand."

        response = client.chat.completions.create(
            model="gpt-3.5-turbo",  # Or "gpt-4" if your key supports it
            messages=[{"role": "user", "content": prompt}],
            temperature=0.7,
            max_tokens=600
        )

        explanation = response.choices[0].message.content.strip()
        return jsonify({"explanation": explanation})
    except Exception as e:
        print("OpenAI API Error:", e)
        return jsonify({"error": "Failed to generate explanation"}), 500

@app.route("/api/search-doctors", methods=["POST"])
def search_doctors():
    data = request.get_json()
    lat, lon = data.get("lat"), data.get("lon")
    if not lat or not lon:
        return jsonify({"error": "Missing coordinates"}), 400

    try:
        url = f"https://maps.googleapis.com/maps/api/place/nearbysearch/json?location={lat},{lon}&radius=5000&type=doctor&keyword=dermatologist&key={GOOGLE_API_KEY}"
        res = requests.get(url).json()
        doctors = []
        for place in res.get("results", [])[:5]:
            doctors.append({
                "name": place.get("name"),
                "address": place.get("vicinity"),
                "rating": place.get("rating", "N/A")
            })
        return jsonify({"doctors": doctors})
    except Exception as e:
        print("Google API error:", e)
        return jsonify({"error": "Failed to fetch doctors"}), 500

@app.route("/api/get-map-key", methods=["GET"])
def get_map_key():
    return jsonify({"key": GOOGLE_MAPS_EMBED_KEY})

@app.route("/api/health", methods=["GET"])
def health():
    return jsonify({"status": "ok", "model": model is not None})

if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=5000)
