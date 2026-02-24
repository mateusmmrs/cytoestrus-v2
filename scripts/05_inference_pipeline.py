"""
CytoEstrus v2 — Inference Pipeline

Loads a trained YOLOv8 model, runs detection on a cytology image,
computes the Cornification Index, then sends the summary JSON to a
LLM (Google Gemini or Anthropic Claude) for clinical interpretation.

Usage:
    python scripts/05_inference_pipeline.py --image path/to/slide.jpg
"""

import argparse
import json
import time
from pathlib import Path

# --------------------------------------------------------------------------- #
#  Stage 1 — YOLOv8 Cell Detection
# --------------------------------------------------------------------------- #

CLASS_NAMES = [
    "parabasal", "intermediate_small", "intermediate_large",
    "superficial_nucleated", "anuclear_squame", "neutrophil"
]

EPITHELIAL_CLASSES = CLASS_NAMES[:5]   # all except neutrophil

def detect_cells(image_path: str, model_path: str = "models/cytoestrus-yolov8n/weights/best.pt", conf: float = 0.35):
    """Run YOLOv8 detection on a cytology slide image."""
    from ultralytics import YOLO
    model = YOLO(model_path)
    
    results = model.predict(source=image_path, conf=conf, verbose=False)
    
    detections = []
    counts = {cls: 0 for cls in CLASS_NAMES}
    
    for result in results:
        if result.boxes is None:
            continue
        for box in result.boxes:
            cls_id = int(box.cls.item())
            cls_name = CLASS_NAMES[cls_id]
            conf_score = float(box.conf.item())
            x1, y1, x2, y2 = [round(float(c), 1) for c in box.xyxy[0].tolist()]
            
            detections.append({
                "class": cls_name,
                "confidence": round(conf_score, 3),
                "box": [x1, y1, x2, y2]
            })
            counts[cls_name] += 1
    
    total_epithelial = sum(counts[c] for c in EPITHELIAL_CLASSES)
    cornification_index = 0.0
    if total_epithelial > 0:
        cornification_index = round(
            (counts["superficial_nucleated"] + counts["anuclear_squame"]) / total_epithelial * 100,
            1
        )
    
    # Detect metestrum cells: neutrophil bbox overlapping an intermediate bbox
    metestrum_count = _detect_metestrum_cells(detections)
    
    summary = {
        "total_epithelial": total_epithelial,
        **{cls: counts[cls] for cls in CLASS_NAMES},
        "metestrum_cells_detected": metestrum_count,
        "cornification_index": cornification_index,
    }
    
    return {
        "image_path": str(image_path),
        "model_version": "cytoestrus-yolov8n-v1",
        "detections": detections,
        "summary": summary,
    }


def _detect_metestrum_cells(detections):
    """Detect metestrum cells from spatial overlap of neutrophils inside intermediates."""
    intermediates = [d for d in detections if d["class"] in ("intermediate_small", "intermediate_large")]
    neutrophils = [d for d in detections if d["class"] == "neutrophil"]
    
    count = 0
    for neut in neutrophils:
        nx1, ny1, nx2, ny2 = neut["box"]
        for inter in intermediates:
            ix1, iy1, ix2, iy2 = inter["box"]
            # Check if neutrophil center is inside the intermediate bbox
            nc_x = (nx1 + nx2) / 2
            nc_y = (ny1 + ny2) / 2
            if ix1 <= nc_x <= ix2 and iy1 <= nc_y <= iy2:
                count += 1
                break
    return count


# --------------------------------------------------------------------------- #
#  Stage 2 — LLM Clinical Interpretation
# --------------------------------------------------------------------------- #

SYSTEM_PROMPT = """Você é um sistema especialista em citopatologia veterinária, 
com ênfase em citologia vaginal canina e manejo reprodutivo da cadela.
Analise os dados de detecção automática de células e determine a fase do ciclo estral."""

CLASSIFICATION_RULES = """
REGRAS DE CLASSIFICAÇÃO (baseadas em Reckers et al. 2022):
- ESTRO: IQ >= 80% + neutrófilos AUSENTES + fundo limpo
- PROESTRO: IQ 50-79% + hemacias possivelmente presentes + neutrófilos em declínio
- DIESTRO: IQ < 20% + retorno ABRUPTO de parabasais/intermediárias + neutrófilos ABUNDANTES + células de metestro
- ANESTRO: Baixa celularidade geral + parabasais dominam + sem hemacias + fundo mucinoso
"""

def interpret_with_llm(detection_json: dict):
    """Send the detection summary JSON to a LLM for clinical interpretation."""
    import os
    
    summary = detection_json["summary"]
    prompt = f"""
Analise o resultado da detecção automática de células de um esfregaço vaginal canino
e determine a fase do ciclo estral.

RESULTADO DA DETECÇÃO AUTOMÁTICA:
{json.dumps(summary, indent=2, ensure_ascii=False)}

{CLASSIFICATION_RULES}

Responda APENAS com um JSON válido no seguinte formato, sem markdown:
{{
  "phase": "ESTRO | PROESTRO | DIESTRO | ANESTRO",
  "confidence": 0.0–1.0,
  "cornification_index": {summary["cornification_index"]},
  "reasoning": "explicação técnica em português com base nas contagens celulares",
  "insemination_advice": "conselho reprodutivo prático",
  "flags": ["alertas relevantes ou lista vazia"]
}}
"""
    
    # Try Gemini first, then Claude, then fallback to rule-based
    result = _try_gemini(prompt)
    if result is None:
        result = _try_claude(prompt)
    if result is None:
        result = _rule_based_fallback(summary)
    
    return result


def _try_gemini(prompt):
    try:
        import google.generativeai as genai
        import os
        api_key = os.getenv("GOOGLE_API_KEY")
        if not api_key:
            return None
        genai.configure(api_key=api_key)
        model = genai.GenerativeModel("gemini-1.5-pro")
        response = model.generate_content(
            f"{SYSTEM_PROMPT}\n\n{prompt}",
            generation_config={"temperature": 0.1}
        )
        text = response.text.strip().replace("```json","").replace("```","")
        return json.loads(text)
    except Exception:
        return None
    
    
def _try_claude(prompt):
    try:
        import anthropic, os
        api_key = os.getenv("ANTHROPIC_API_KEY")
        if not api_key:
            return None
        client = anthropic.Anthropic(api_key=api_key)
        message = client.messages.create(
            model="claude-3-5-sonnet-20241022",
            max_tokens=1024,
            system=SYSTEM_PROMPT,
            messages=[{"role": "user", "content": prompt}]
        )
        text = message.content[0].text.strip().replace("```json","").replace("```","")
        return json.loads(text)
    except Exception:
        return None


def _rule_based_fallback(summary):
    """Simple rule-based classifier as fallback when no LLM API is available."""
    iq = summary["cornification_index"]
    neutrophils = summary.get("neutrophil", 0)
    total = summary.get("total_epithelial", 1)
    neutrophil_density = neutrophils / max(total, 1)
    
    if iq >= 80 and neutrophil_density < 0.05:
        phase = "ESTRO"
        advice = "Momento ideal para inseminação ou monta natural. Verificar LH para timing preciso."
        reasoning = f"IQ de {iq}% confirma queratinização máxima. Ausência de neutrófilos indica ausência de diestro. Fêmea em pico fértil."
    elif iq >= 50:
        phase = "PROESTRO"
        advice = "Aguardar mais 2-3 dias para nova citologia. Monitorar transição para Estro."
        reasoning = f"IQ de {iq}% indica queratinização progressiva mas ainda não máxima."
    elif neutrophil_density > 0.2 or summary.get("metestrum_cells_detected", 0) > 0:
        phase = "DIESTRO"
        advice = "Fêmea não está no período fértil. Avaliar gestação se houve cobrição."
        reasoning = f"IQ de {iq}% com neutrófilos abundantes ({neutrophils} detectados). Retorno das células intermediárias e parabasais."
    else:
        phase = "ANESTRO"
        advice = "Fêmea fora do ciclo reprodutivo. Aguardar próximo proestro ou investigar causas se ciclo atrasado."
        reasoning = f"IQ de {iq}% com baixa celularidade total ({total} células epiteliais detectadas). Padrão compatível com anestro."
    
    return {
        "phase": phase,
        "confidence": 0.75,
        "cornification_index": iq,
        "reasoning": reasoning,
        "insemination_advice": advice,
        "flags": [] if phase != "DIESTRO" else ["Monitorar possível gestação"]
    }


# --------------------------------------------------------------------------- #
#  Main
# --------------------------------------------------------------------------- #

def run_pipeline(image_path: str, model_path: str = None):
    print(f">>> Stage 1: Detecting cells in '{image_path}'...")
    
    default_model = str(Path(__file__).parent.parent / "models/cytoestrus-yolov8n/weights/best.pt")
    if model_path is None:
        model_path = default_model
    
    if not Path(model_path).exists():
        print(f"[WARNING] Trained model not found at {model_path}.")
        print("Using mock detection for demonstration purposes.")
        detection_result = _mock_detection(image_path)
    else:
        detection_result = detect_cells(image_path, model_path)
    
    print(f">>> Stage 2: Sending summary to LLM for clinical interpretation...")
    interpretation = interpret_with_llm(detection_result)
    
    final_result = {
        **detection_result,
        "clinical_interpretation": interpretation
    }
    
    print("\n" + "="*60)
    print("CYTOESTRUS v2 — ANALYSIS COMPLETE")
    print("="*60)
    print(json.dumps(final_result["clinical_interpretation"], indent=2, ensure_ascii=False))
    print(f"\nCornification Index: {detection_result['summary']['cornification_index']}%")
    print(f"Phase: {interpretation['phase']}")
    print("="*60)
    
    return final_result


def _mock_detection(image_path):
    """Returns a realistic estro-phase mock detection when no model is available."""
    return {
        "image_path": image_path,
        "model_version": "cytoestrus-yolov8n-v1 [MOCK - model not trained yet]",
        "detections": [
            {"class": "anuclear_squame", "confidence": 0.92, "box": [50, 120, 180, 250]},
            {"class": "superficial_nucleated", "confidence": 0.88, "box": [210, 90, 340, 220]},
            {"class": "superficial_nucleated", "confidence": 0.85, "box": [380, 200, 480, 310]},
            {"class": "anuclear_squame", "confidence": 0.81, "box": [120, 300, 250, 420]},
        ],
        "summary": {
            "total_epithelial": 47,
            "parabasal": 0,
            "intermediate_small": 2,
            "intermediate_large": 3,
            "superficial_nucleated": 20,
            "anuclear_squame": 22,
            "neutrophil": 0,
            "metestrum_cells_detected": 0,
            "cornification_index": 89.4,
        }
    }


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="CytoEstrus v2: Full Inference Pipeline")
    parser.add_argument("--image", type=str, default="DEMO", help="Path to cytology slide image")
    parser.add_argument("--model", type=str, default=None, help="Path to trained .pt model")
    args = parser.parse_args()
    run_pipeline(args.image, args.model)
