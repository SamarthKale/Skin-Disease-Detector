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

# === Suppress TensorFlow logs ===
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '3'

# === Clean __pycache__ (optional)
shutil.rmtree("__pycache__", ignore_errors=True)

# === Enable GPU memory growth ===
gpus = tf.config.experimental.list_physical_devices('GPU')
if gpus:
    try:
        for gpu in gpus:
            tf.config.experimental.set_memory_growth(gpu, True)
    except RuntimeError as e:
        print(f"⚠️ GPU memory config error: {e}")

# === Config ===
BATCH_SIZE = 16
IMG_SIZE = (224, 224)
EPOCHS = 6  # set to 6+ for full training

# === Paths
DATASET_PATH = "../dataset"  # ✅ Corrected path
MODEL_SAVE_PATH = "../model/model.h5"
CLASS_LABELS_PATH = "../model/class_labels.txt"

# === Load Dataset ===
train_ds = image_dataset_from_directory(
    DATASET_PATH,
    validation_split=0.2,
    subset="training",
    seed=42,
    label_mode="categorical",
    image_size=IMG_SIZE,
    batch_size=BATCH_SIZE
)

val_ds = image_dataset_from_directory(
    DATASET_PATH,
    validation_split=0.2,
    subset="validation",
    seed=42,
    label_mode="categorical",
    image_size=IMG_SIZE,
    batch_size=BATCH_SIZE
)

class_names = train_ds.class_names

# === Preprocessing ===
train_ds = train_ds.map(lambda x, y: (preprocess_input(x), y))
val_ds = val_ds.map(lambda x, y: (preprocess_input(x), y))
train_ds = train_ds.prefetch(buffer_size=tf.data.AUTOTUNE)
val_ds = val_ds.prefetch(buffer_size=tf.data.AUTOTUNE)

# === Compute Class Weights ===
train_labels = np.concatenate([y.numpy() for x, y in train_ds], axis=0)
y_classes = np.argmax(train_labels, axis=1)
class_weights = compute_class_weight(
    class_weight='balanced',
    classes=np.unique(y_classes),
    y=y_classes
)
class_weights = dict(enumerate(class_weights))

# === Build Model
base_model = EfficientNetB0(include_top=False, weights='imagenet', input_shape=(224, 224, 3))
base_model.trainable = True

x = base_model.output
x = GlobalAveragePooling2D()(x)
x = Dropout(0.4)(x)
x = Dense(128, activation='relu')(x)
output = Dense(len(class_names), activation='softmax')(x)

model = Model(inputs=base_model.input, outputs=output)

# === Compile Model
model.compile(
    optimizer=tf.keras.optimizers.Adam(1e-4),
    loss='categorical_crossentropy',
    metrics=['accuracy', tf.keras.metrics.Precision(), tf.keras.metrics.Recall()]
)

# === Callbacks
es = EarlyStopping(patience=5, restore_best_weights=True)
rlr = ReduceLROnPlateau(factor=0.5, patience=3, min_lr=1e-6, verbose=1)

# === Train
history = model.fit(
    train_ds,
    validation_data=val_ds,
    epochs=EPOCHS,
    callbacks=[es, rlr],
    class_weight=class_weights
)

# === Save model weights only (.h5)
os.makedirs("../model", exist_ok=True)
if os.path.exists(MODEL_SAVE_PATH):
    os.remove(MODEL_SAVE_PATH)
    print("🗑️ Old model.h5 deleted.")

model.save_weights(MODEL_SAVE_PATH)  # ✅ safe save
print(f"\n✅ Model weights saved to: {MODEL_SAVE_PATH}")

# === Save Class Labels
with open(CLASS_LABELS_PATH, "w") as f:
    for label in class_names:
        f.write(label + "\n")
print(f"📚 Class labels saved to: {CLASS_LABELS_PATH}")
