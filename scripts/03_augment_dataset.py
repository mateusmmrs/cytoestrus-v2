import os
import glob
import shutil
import albumentations as A
import cv2
import numpy as np
from pathlib import Path

ANNOTATED_DIR = "/home/mateus/.gemini/antigravity/scratch/codexor/cytoestrus-v2/data/annotated"
AUG_DIR = "/home/mateus/.gemini/antigravity/scratch/codexor/cytoestrus-v2/data/augmented"
os.makedirs(AUG_DIR, exist_ok=True)

# Copy classes.txt to augmented dir
shutil.copy(os.path.join(ANNOTATED_DIR, "classes.txt"), os.path.join(AUG_DIR, "classes.txt"))

# Augmentation pipeline - simulates real microscopy variability
transform = A.Compose([
    A.RandomRotate90(p=0.5),
    A.HorizontalFlip(p=0.5),
    A.VerticalFlip(p=0.5),
    A.RandomBrightnessContrast(brightness_limit=0.2, contrast_limit=0.2, p=0.5),
    A.HueSaturationValue(hue_shift_limit=10, sat_shift_limit=20, val_shift_limit=20, p=0.4),
    A.GaussNoise(p=0.3),
    A.GaussianBlur(blur_limit=(3, 7), p=0.3),
    A.RandomScale(scale_limit=0.15, p=0.4),
    A.ShiftScaleRotate(shift_limit=0.1, scale_limit=0.1, rotate_limit=30, p=0.5),
], bbox_params=A.BboxParams(format='yolo', label_fields=['class_labels'], min_area=0.001, min_visibility=0.3))

def load_yolo_annotations(txt_path, img_w, img_h):
    bboxes = []
    class_labels = []
    if not os.path.exists(txt_path):
        return bboxes, class_labels
    with open(txt_path) as f:
        for line in f:
            parts = line.strip().split()
            if len(parts) == 5:
                cls = int(parts[0])
                x_c, y_c, w, h = map(float, parts[1:])
                bboxes.append([x_c, y_c, w, h])
                class_labels.append(cls)
    return bboxes, class_labels

def save_yolo_annotations(bboxes, class_labels, txt_path):
    with open(txt_path, 'w') as f:
        for cls, bbox in zip(class_labels, bboxes):
            f.write(f"{cls} {bbox[0]:.6f} {bbox[1]:.6f} {bbox[2]:.6f} {bbox[3]:.6f}\n")

AUGMENTATIONS_PER_IMAGE = 15

images = glob.glob(os.path.join(ANNOTATED_DIR, "*.jpg"))
print(f"Augmenting {len(images)} annotated images x{AUGMENTATIONS_PER_IMAGE} each...")

total_generated = 0
for img_path in images:
    name = Path(img_path).stem
    img = cv2.imread(img_path)
    if img is None:
        continue
    img_rgb = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
    h, w = img_rgb.shape[:2]
    txt_path = os.path.join(ANNOTATED_DIR, f"{name}.txt")
    bboxes, class_labels = load_yolo_annotations(txt_path, w, h)


    for i in range(AUGMENTATIONS_PER_IMAGE):
        if bboxes:
            try:
                augmented = transform(image=img_rgb, bboxes=bboxes, class_labels=class_labels)
                aug_img = augmented['image']
                aug_bboxes = augmented['bboxes']
                aug_labels = augmented['class_labels']
            except Exception:
                aug_img = img_rgb
                aug_bboxes = bboxes
                aug_labels = class_labels
        else:
            # No bboxes: apply spatial-safe transforms
            spatial_tf = A.Compose([
                A.RandomRotate90(p=0.5),
                A.HorizontalFlip(p=0.5),
                A.RandomBrightnessContrast(p=0.5),
                A.GaussNoise(p=0.3),
            ])
            augmented = spatial_tf(image=img_rgb)
            aug_img = augmented['image']
            aug_bboxes = []
            aug_labels = []

        out_name = f"{name}_aug{i:03d}"
        out_img = cv2.cvtColor(aug_img, cv2.COLOR_RGB2BGR)
        cv2.imwrite(os.path.join(AUG_DIR, f"{out_name}.jpg"), out_img)
        save_yolo_annotations(aug_bboxes, aug_labels, os.path.join(AUG_DIR, f"{out_name}.txt"))
        total_generated += 1

print(f"Augmentation complete: {total_generated} images created in {AUG_DIR}")
