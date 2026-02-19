import os
import subprocess
import sys

def check_kaggle_api():
    try:
        import kaggle
    except ImportError:
        print("Kaggle API not installed. Installing...")
        subprocess.check_call([sys.executable, "-m", "pip", "install", "kaggle"])
        print("\n[!] IMPORTANT: Please ensure your kaggle.json is placed in ~/.kaggle/kaggle.json")
        print("You can get it from your Kaggle Account Settings -> Create New API Token")
        print("Once configured, run this script again.")
        sys.exit(1)

def download_sipakmed():
    check_kaggle_api()
    
    target_dir = "/home/mateus/.gemini/antigravity/scratch/codexor/cytoestrus-v2/data/sipakmed"
    os.makedirs(target_dir, exist_ok=True)
    
    print("Downloading SIPaKMeD dataset from Kaggle...")
    try:
        subprocess.check_call([
            "kaggle", "datasets", "download", "-d", "prahladmehandiratta/cervical-cancer-largest-dataset-sipakmed",
            "-p", target_dir, "--unzip"
        ])
        print(f"Dataset successfully downloaded and extracted to {target_dir}")
    except Exception as e:
        print(f"Failed to download dataset: {e}")
        print("Make sure you have accepted the dataset rules on Kaggle if applicable, and your API key is valid.")

if __name__ == "__main__":
    download_sipakmed()
