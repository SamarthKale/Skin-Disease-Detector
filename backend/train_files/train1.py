import os
import shutil
import numpy as np
import tensorflow as tf
from sklearn.utils.class_weight import compute_class_weight
from tensorflow.keras.applications.efficientnet import EfficientNetB0, preprocess_input
from tensorflow.keras.models import Model
from tensorflow.keras.layers import GlobalAveragePooling2D, Dense, Dropout
from tensorflow.keras.preprocessing import image_dataset_from_directory
from tensorflow.keras.callbacks import EarlyStopping, ReduceLROnPlateau

# === Config ===
BATCH_SIZE = 16
IMG_SIZE = (224, 224)
EPOCHS = 6

# === Paths ===
DATASET_PATH = "../dataset"
SAVE_DIR = "C:/Users/Samarth Kale/Documents/GitHub/Hackorbit/model-2"
WEIGHTS_PATH = os.path.join(SAVE_DIR, "model_weights.h5")
CLASS_LABELS = os.path.join(SAVE_DIR, "class_labels.txt")

# === Clean __pycache__ ===
shutil.rmtree("__pycache__", ignore_errors=True)

# === GPU memory growth ===
gpus = tf.config.experimental.list_physical_devices("GPU")
if gpus:
    for gpu in gpus:
        tf.config.experimental.set_memory_growth(gpu, True)

# === Load dataset ===
train_ds = image_dataset_from_directory(
    DATASET_PATH,
    validation_split=0.2,
    subset="training",
    seed=42,
    label_mode="categorical",
    image_size=IMG_SIZE,
    batch_size=BATCH_SIZE,
)
val_ds = image_dataset_from_directory(
    DATASET_PATH,
    validation_split=0.2,
    subset="validation",
    seed=42,
    label_mode="categorical",
    image_size=IMG_SIZE,
    batch_size=BATCH_SIZE,
)
class_names = train_ds.class_names

# === Preprocessing ===
train_ds = train_ds.map(lambda x, y: (preprocess_input(x), y)).prefetch(tf.data.AUTOTUNE)
val_ds = val_ds.map(lambda x, y: (preprocess_input(x), y)).prefetch(tf.data.AUTOTUNE)

# === Compute class weights ===
train_labels = np.concatenate([y.numpy() for x, y in train_ds], axis=0)
y_classes = np.argmax(train_labels, axis=1)
class_weights = dict(enumerate(
    compute_class_weight(class_weight="balanced", classes=np.unique(y_classes), y=y_classes)
))

# === Build model ===
base_model = EfficientNetB0(include_top=False, weights="imagenet", input_shape=(224, 224, 3))
x = base_model.output
x = GlobalAveragePooling2D()(x)
x = Dropout(0.4)(x)
x = Dense(128, activation="relu")(x)
output = Dense(len(class_names), activation="softmax")(x)
model = Model(inputs=base_model.input, outputs=output)

model.compile(
    optimizer=tf.keras.optimizers.Adam(1e-4),
    loss="categorical_crossentropy",
    metrics=["accuracy", tf.keras.metrics.Precision(), tf.keras.metrics.Recall()]
)

# === Callbacks ===
es = EarlyStopping(patience=5, restore_best_weights=True)
rlr = ReduceLROnPlateau(factor=0.5, patience=3, min_lr=1e-6, verbose=1)

# === Train ===
history = model.fit(
    train_ds,
    validation_data=val_ds,
    epochs=EPOCHS,
    class_weight=class_weights,
    callbacks=[es, rlr],
)

# === Save weights only ===
os.makedirs(SAVE_DIR, exist_ok=True)
model.save_weights(WEIGHTS_PATH)
print(f"\n✅ Weights saved to: {WEIGHTS_PATH}")

# === Save class names ===
with open(CLASS_LABELS, "w") as f:
    for label in class_names:
        f.write(label + "\n")
print(f"📚 Class labels saved to: {CLASS_LABELS}")
