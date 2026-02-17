import os
import time
import requests
from bs4 import BeautifulSoup
import urllib.parse
import pandas as pd

RAW_DIR = "/home/mateus/.gemini/antigravity/scratch/codexor/cytoestrus-v2/data/raw"
os.makedirs(RAW_DIR, exist_ok=True)

HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36'
}

downloaded_metadata = []

def download_image(img_url, source_url, name_prefix, metadata_label):
    try:
        if img_url.startswith('//'):
            img_url = 'https:' + img_url
        elif img_url.startswith('/'):
            domain = '{uri.scheme}://{uri.netloc}'.format(uri=urllib.parse.urlparse(source_url))
            img_url = domain + img_url
            
        print(f"Downloading {img_url}...")
        res = requests.get(img_url, headers=HEADERS, timeout=10)
        if res.status_code == 200:
            ext = img_url.split('.')[-1].split('?')[0]
            if len(ext) > 4 or ext.lower() not in ['jpg', 'jpeg', 'png', 'webp']:
                ext = 'jpg'
            
            filename = f"{name_prefix}_{int(time.time()*1000)}.{ext}"
            filepath = os.path.join(RAW_DIR, filename)
            
            with open(filepath, 'wb') as f:
                f.write(res.content)
            
            downloaded_metadata.append({
                'filename': filename,
                'source_url': source_url,
                'image_url': img_url,
                'literature_label': metadata_label
            })
            return True
    except Exception as e:
        print(f"Error downloading {img_url}: {e}")
    return False

def scrape_reckers():
    url = "https://www.frontiersin.org/journals/veterinary-science/articles/10.3389/fvets.2022.834031/full"
    print("Scraping Reckers et al. (Frontiers)...")
    try:
        res = requests.get(url, headers=HEADERS)
        soup = BeautifulSoup(res.text, 'html.parser')
        # Find images in the article
        images = soup.find_all('img')
        for img in images:
            src = img.get('src')
            if src and 'fvets-09-834031' in src and ('g001' in src or 'g00' in src):
                download_image(src, url, "reckers", "various_cells")
    except Exception as e:
        print(f"Failed to scrape Reckers: {e}")

def scrape_lsu():
    base_url = "http://therio.vetmed.lsu.edu/"
    url = "http://therio.vetmed.lsu.edu/k-9__vaginal_cytology.htm"
    print("Scraping LSU Theriogenology...")
    try:
        res = requests.get(url, headers=HEADERS)
        soup = BeautifulSoup(res.text, 'html.parser')
        images = soup.find_all('img')
        for img in images:
            src = img.get('src')
            if src and ('jpg' in src.lower() or 'gif' in src.lower()):
                full_src = urllib.parse.urljoin(base_url, src)
                if 'nav' not in src.lower() and 'logo' not in src.lower():
                    download_image(full_src, url, "lsu", "clinical_case")
    except Exception as e:
        print(f"Failed to scrape LSU: {e}")

def scrape_merck():
    url = "https://www.merckvetmanual.com/multimedia/image/exfoliative-vaginal-cytology-estrous-cycle-dog"
    print("Scraping Merck Vet Manual...")
    try:
        res = requests.get(url, headers=HEADERS)
        soup = BeautifulSoup(res.text, 'html.parser')
        images = soup.find_all('img')
        for img in images:
            src = img.get('src', '')
            if 'multimedia' in src or 'figure' in src.lower() or 'image' in src.lower():
                download_image(src, url, "merck", "phases")
    except Exception as e:
        print(f"Failed to scrape Merck: {e}")

if __name__ == "__main__":
    scrape_reckers()
    scrape_lsu()
    scrape_merck()
    
    if downloaded_metadata:
        df = pd.DataFrame(downloaded_metadata)
        csv_path = os.path.join(RAW_DIR, 'sources.csv')
        df.to_csv(csv_path, index=False)
        print(f"Scraping completed. {len(df)} images downloaded to {RAW_DIR}")
        print(f"Metadata saved to {csv_path}")
    else:
        print("No images were downloaded. Might need browser scraping.")
