"""
CytoEstrus v2 — YOLOv8 Training Script
Pre-trains on SIPaKMeD classes and fine-tunes on annotated canine cytology images.

Usage:
    python scripts/04_train_yolov8.py              # Train from scratch with defaults
    python scripts/04_train_yolov8.py --epochs 50  # Custom epochs
"""

import argparse
from pathlib import Path

def train(epochs=100, batch=16, imgsz=640, device='cpu', resume=False):
    from ultralytics import YOLO
    
    DATASET_YAML = str(Path(__file__).parent.parent / "dataset.yaml")
    
    # Start from COCO pre-trained nano model — fastest for CPU/small dataset
    model = YOLO("yolov8n.pt")
    
    results = model.train(
        data=DATASET_YAML,
        epochs=epochs,
        imgsz=imgsz,
        batch=batch,
        device=device,
        name="cytoestrus-yolov8n",
        project="models",
        resume=resume,
        # Disable heavy augmentation since we already handled it with Albumentations
        augment=False,
        # Metrics
        save=True,
        save_period=10,
        plots=True,
        # Overfit prevention
        lr0=0.001,
        patience=30,
    )
    
    print(f"Training complete. Best model: models/cytoestrus-yolov8n/weights/best.pt")
    return results

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Train CytoEstrus YOLOv8 model")
    parser.add_argument("--epochs", type=int, default=100)
    parser.add_argument("--batch", type=int, default=16)
    parser.add_argument("--imgsz", type=int, default=640)
    parser.add_argument("--device", type=str, default="cpu", help="cpu | 0 | cuda:0")
    parser.add_argument("--resume", action="store_true")
    args = parser.parse_args()

    train(args.epochs, args.batch, args.imgsz, args.device, args.resume)
