import numpy as np
import tensorflow as tf
from tensorflow.keras.applications.efficientnet import EfficientNetB0, preprocess_input
from tensorflow.keras.models import Model
from tensorflow.keras.layers import GlobalAveragePooling2D, Dense, Dropout
from tensorflow.keras.preprocessing import image
import os
import sys

# === Config ===
MODEL_PATH = "C:/Users/Samarth Kale/Documents/GitHub/Hackorbit/model-2/model_weights.h5"
LABELS_PATH = "C:/Users/Samarth Kale/Documents/GitHub/Hackorbit/model-2/class_labels.txt"

# === Load labels ===
with open(LABELS_PATH, "r") as f:
    class_names = [line.strip() for line in f.readlines()]

# === Build model ===
def build_model():
    base_model = EfficientNetB0(include_top=False, weights="imagenet", input_shape=(224, 224, 3))
    x = base_model.output
    x = GlobalAveragePooling2D()(x)
    x = Dropout(0.4)(x)
    x = Dense(128, activation="relu")(x)
    output = Dense(len(class_names), activation="softmax")(x)
    model = Model(inputs=base_model.input, outputs=output)
    model.load_weights(MODEL_PATH)
    model.compile(optimizer="adam", loss="categorical_crossentropy", metrics=["accuracy"])
    return model

model = build_model()

# === Predict on image ===
def predict_image(image_path):
    img = image.load_img(image_path, target_size=(224, 224))
    img_array = image.img_to_array(img)
    img_array = preprocess_input(img_array)
    img_array = np.expand_dims(img_array, axis=0)

    preds = model.predict(img_array)[0]
    top_class = class_names[np.argmax(preds)]
    confidence = round(float(np.max(preds)) * 100, 2)

    print(f"\n🧠 Prediction: {top_class}")
    print(f"📊 Confidence: {confidence}%")

# === Run ===
if __name__ == "__main__":
    if len(sys.argv) != 2:
        print("Usage: python predict.py <image_path>")
    else:
        image_path = sys.argv[1]
        if not os.path.exists(image_path):
            print(f"❌ File not found: {image_path}")
        else:
            predict_image(image_path)

