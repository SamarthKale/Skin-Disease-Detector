import os
import pandas as pd
import shutil

metadata_path = 'C:/Users/Samarth Kale/Documents/GitHub/Hackorbit/dataset/HAM10000_metadata.csv'
img_dir1 = 'C:/Users/Samarth Kale/Documents/GitHub/Hackorbit/dataset/HAM10000_images_part_1'
img_dir2 = 'C:/Users/Samarth Kale/Documents/GitHub/Hackorbit/dataset/HAM10000_images_part_2'
output_dir = 'C:/Users/Samarth Kale/Documents/GitHub/Hackorbit/dataset'

label_map = {
    'mel': 'Melanoma',
    'nv': 'Nevus',
    'bkl': 'Benign',
    'akiec': 'Benign',
    'bcc': 'Benign',
    'vasc': 'Benign',
    'df': 'Benign'
}

for label in label_map.values():
    os.makedirs(os.path.join(output_dir, label), exist_ok=True)

df = pd.read_csv(metadata_path)

all_imgs = {f[:-4]: os.path.join(img_dir1, f) for f in os.listdir(img_dir1)}
all_imgs.update({f[:-4]: os.path.join(img_dir2, f) for f in os.listdir(img_dir2)})

for index, row in df.iterrows():
    image_id = row['image_id']
    dx = row['dx']
    if dx in label_map:
        label = label_map[dx]
        src = all_imgs.get(image_id)
        dst = os.path.join(output_dir, label, f"{image_id}.jpg")
        if src and os.path.exists(src):
            shutil.copy(src, dst)

print("✅ Dataset organized successfully.")