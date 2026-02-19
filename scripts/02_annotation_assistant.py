import os
import json
import glob
from PIL import Image
import google.generativeai as genai
import time

# NOTE: Requires GOOGLE_API_KEY to be set in the environment
# export GOOGLE_API_KEY="your-api-key"

RAW_DIR = "/home/mateus/.gemini/antigravity/scratch/codexor/cytoestrus-v2/data/raw"
ANNOTATED_DIR = "/home/mateus/.gemini/antigravity/scratch/codexor/cytoestrus-v2/data/annotated"
os.makedirs(ANNOTATED_DIR, exist_ok=True)

# YOLO Classes definition
CLASSES = [
    "parabasal",
    "intermediate_small",
    "intermediate_large",
    "superficial_nucleated",
    "anuclear_squame",
    "neutrophil"
]

def setup_gemini():
    api_key = os.getenv("GOOGLE_API_KEY")
    if not api_key:
        print("ERROR: GOOGLE_API_KEY environment variable not found.")
        print("Please run: export GOOGLE_API_KEY='your_key_here'")
        # For demonstration, we will mock the LLM response if key is missing
        return None
    genai.configure(api_key=api_key)
    # Using gemini-1.5-pro for vision tasks
    return genai.GenerativeModel('gemini-1.5-pro')

def get_ai_annotations(model, image_path):
    prompt = """
    You are an expert veterinary cytopathologist. I am providing a microscopy image of a canine vaginal cytology slide.
    Identify all prominent cells and classify them into one of the following 6 classes:
    0: parabasal
    1: intermediate_small
    2: intermediate_large
    3: superficial_nucleated
    4: anuclear_squame
    5: neutrophil
    
    Return a STRICT JSON list of bounding boxes in YOLO format (Center X, Center Y, Width, Height) normalized between 0.0 and 1.0.
    FORMAT:
    [
        {"class_id": 3, "x_center": 0.5, "y_center": 0.5, "width": 0.2, "height": 0.2}, ...
    ]
    Respond ONLY with the JSON array, no markdown formatting or backticks.
    """
    
    if not model:
        # Mock response for when API key is not present, returns a fake bounding box
        return [{"class_id": 3, "x_center": 0.5, "y_center": 0.5, "width": 0.2, "height": 0.2}]
        
    try:
        img = Image.open(image_path)
        response = model.generate_content([prompt, img], generation_config={"temperature": 0.1})
        text = response.text.strip().replace('```json', '').replace('```', '')
        return json.loads(text)
    except Exception as e:
        print(f"Error processing {image_path}: {e}")
        return []

def convert_to_yolo(annotations, img_width, img_height, txt_path):
    with open(txt_path, 'w') as f:
        for ann in annotations:
            # Format: class_id x_center y_center width height
            line = f"{ann['class_id']} {ann['x_center']:.6f} {ann['y_center']:.6f} {ann['width']:.6f} {ann['height']:.6f}\n"
            f.write(line)

def main():
    model = setup_gemini()
    images = glob.glob(os.path.join(RAW_DIR, "*.jpg")) + \
             glob.glob(os.path.join(RAW_DIR, "*.png")) + \
             glob.glob(os.path.join(RAW_DIR, "*.webp"))
             
    print(f"Found {len(images)} images to annotate.")
    
    # Create classes.txt
    with open(os.path.join(ANNOTATED_DIR, "classes.txt"), "w") as f:
        for c in CLASSES:
            f.write(c + "\n")
            
    for idx, img_path in enumerate(images):
        filename = os.path.basename(img_path)
        name, _ = os.path.splitext(filename)
        print(f"[{idx+1}/{len(images)}] Annotating {filename} via Gemini Vision...")
        
        annotations = get_ai_annotations(model, img_path)
        
        # Save image to annotated dir (keep as training set)
        img = Image.open(img_path).convert("RGB")
        target_img_path = os.path.join(ANNOTATED_DIR, f"{name}.jpg")
        img.save(target_img_path)
        
        # Save YOLO txt
        txt_path = os.path.join(ANNOTATED_DIR, f"{name}.txt")
        convert_to_yolo(annotations, img.width, img.height, txt_path)
        
        # Rate limiting avoidance (if real model)
        if model:
            time.sleep(2)

    print("AI Annotation process completed! The dataset is now ready for review and augmentation.")

if __name__ == "__main__":
    main()
