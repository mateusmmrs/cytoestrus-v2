"use client";
import { useState, useRef, useCallback, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { mockPatients, mockCytologies } from "@/lib/mock-data";
import type { Phase, CellCounts } from "@/lib/types";

interface AnalysisResult {
    phase: Phase;
    confidence: number;
    cornification_index: number;
    reasoning: string;
    insemination_advice: string;
    cells: CellCounts;
    total_epithelial: number;
}

function simulateAnalysis(): AnalysisResult {
    const scenarios: AnalysisResult[] = [
        {
            phase: "ESTRO", confidence: 0.94, cornification_index: 87.2,
            reasoning: "IQ de 87.2% confirmando queratinização máxima do epitélio vaginal. Predomínio absoluto de células superficiais nucleadas (22) e escamas anucleares (19), com ausência total de neutrófilos.",
            insemination_advice: "Momento ideal para inseminação artificial ou monta natural. Recomenda-se dosagem de progesterona sérica.",
            cells: { parabasal: 0, intermediate_small: 1, intermediate_large: 5, superficial_nucleated: 22, anuclear_squame: 19, neutrophil: 0 },
            total_epithelial: 47,
        },
        {
            phase: "PROESTRO", confidence: 0.88, cornification_index: 62.5,
            reasoning: "IQ de 62.5% indica queratinização progressiva. Mix de intermediárias grandes e superficiais nucleadas, com neutrófilos em declínio.",
            insemination_advice: "Aguardar 2 a 3 dias para nova citologia. Iniciar dosagem de P4 a cada 48 horas.",
            cells: { parabasal: 1, intermediate_small: 4, intermediate_large: 12, superficial_nucleated: 15, anuclear_squame: 8, neutrophil: 3 },
            total_epithelial: 40,
        },
        {
            phase: "DIESTRO", confidence: 0.91, cornification_index: 12.0,
            reasoning: "IQ de 12.0% com retorno de células parabasais e intermediárias pequenas. Neutrófilos abundantes ('chuva de neutrófilos'). Fim do período fértil.",
            insemination_advice: "A fêmea NÃO está no período fértil. Se houve IA, avaliar gestação por ultrassonografia a partir de 25 dias.",
            cells: { parabasal: 8, intermediate_small: 14, intermediate_large: 3, superficial_nucleated: 2, anuclear_squame: 1, neutrophil: 22 },
            total_epithelial: 28,
        },
    ];
    return scenarios[Math.floor(Math.random() * scenarios.length)];
}

type AppState = "select" | "upload" | "analyzing" | "results";

export default function AnalisePage() {
    return (
        <Suspense fallback={<div className="page-container">Carregando...</div>}>
            <AnaliseContent />
        </Suspense>
    );
}

function AnaliseContent() {
    const searchParams = useSearchParams();
    const [state, setState] = useState<AppState>("select");
    const [selectedPatient, setSelectedPatient] = useState<string>("");
    const [preview, setPreview] = useState<string | null>(null);
    const [result, setResult] = useState<AnalysisResult | null>(null);
    const [analysisStep, setAnalysisStep] = useState(0);
    const [dragOver, setDragOver] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [saved, setSaved] = useState(false);

    useEffect(() => {
        const p = searchParams.get("paciente");
        if (p) {
            setSelectedPatient(p);
            setState("upload"); // Pula a seleção e vai direto pro upload
        }
    }, [searchParams]);

    const handleFile = useCallback((file: File) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            setPreview(e.target?.result as string);
            setState("analyzing");
            setAnalysisStep(0);
            const steps = [800, 1600, 2600, 3800];
            steps.forEach((delay, i) => setTimeout(() => setAnalysisStep(i + 1), delay));
            setTimeout(() => {
                setResult(simulateAnalysis());
                setState("results");
            }, 4500);
        };
        reader.readAsDataURL(file);
    }, []);

    const reset = () => {
        setState("select");
        setSelectedPatient("");
        setPreview(null);
        setResult(null);
        setAnalysisStep(0);
        setSaved(false);
    };

    const saveToPatient = () => {
        setSaved(true);
        // In production: save to Supabase
    };

    const patientName = mockPatients.find(p => p.id === selectedPatient)?.name || "";

    return (
        <div className="page-container">
            <div className="page-header">
                <h1>Nova Análise</h1>
                <p>Upload de lâmina e diagnóstico automatizado</p>
            </div>

            {/* Step 1: Patient Selection */}
            {state === "select" && (
                <div className="analysis-step-card">
                    <div className="step-number">1</div>
                    <h2>Selecionar Paciente</h2>
                    <p style={{ color: "var(--text-secondary)", marginBottom: 24 }}>
                        Vincule esta análise a uma paciente cadastrada.
                    </p>
                    <select className="select-input" value={selectedPatient} onChange={e => setSelectedPatient(e.target.value)}>
                        <option value="">Selecione a paciente...</option>
                        {mockPatients.map(p => (
                            <option key={p.id} value={p.id}>{p.name} — {p.breed}</option>
                        ))}
                    </select>
                    <button
                        className="btn-primary"
                        style={{ marginTop: 24 }}
                        disabled={!selectedPatient}
                        onClick={() => setState("upload")}
                    >
                        Continuar →
                    </button>
                </div>
            )}

            {/* Step 2: Upload */}
            {state === "upload" && (
                <div className="analysis-step-card">
                    <div className="step-number">2</div>
                    <h2>Upload da Lâmina — {patientName}</h2>
                    <div
                        className={`upload-zone ${dragOver ? "dragover" : ""}`}
                        style={{ maxWidth: "100%", marginTop: 24 }}
                        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                        onDragLeave={() => setDragOver(false)}
                        onDrop={(e) => { e.preventDefault(); setDragOver(false); if (e.dataTransfer.files[0]) handleFile(e.dataTransfer.files[0]); }}
                        onClick={() => fileInputRef.current?.click()}
                    >
                        <input type="file" ref={fileInputRef} accept="image/*" onChange={(e) => { if (e.target.files?.[0]) handleFile(e.target.files[0]); }} />
                        <div className="upload-icon">🔬</div>
                        <h3>Arraste a imagem ou clique para selecionar</h3>
                        <p>JPG, PNG ou WEBP • Foto de microscópio</p>
                    </div>
                </div>
            )}

            {/* Step 3: Analyzing */}
            {state === "analyzing" && (
                <div className="analysis-step-card" style={{ textAlign: "center" }}>
                    {preview && <img src={preview} alt="Lâmina" style={{ width: "100%", maxHeight: 200, objectFit: "cover", borderRadius: 12, marginBottom: 24, opacity: 0.8 }} />}
                    <div className="spinner" />
                    <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 8 }}>Analisando lâmina de {patientName}...</h3>
                    <ul className="analysis-steps">
                        {["Validação da imagem", "Detecção celular (YOLOv8)", "Cálculo do IQ", "Interpretação clínica (LLM)"].map((s, i) => (
                            <li key={i} className={analysisStep > i ? "done" : analysisStep === i ? "active" : ""}>
                                <span>{analysisStep > i ? "✅" : analysisStep === i ? "⏳" : "○"}</span> {s}
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {/* Step 4: Results */}
            {state === "results" && result && (
                <div>
                    <div className="analysis-step-card">
                        <div className="result-header" style={{ textAlign: "center", marginBottom: 24 }}>
                            <span className={`phase-badge-sm phase-${result.phase.toLowerCase()}`} style={{ fontSize: 16, padding: "10px 24px" }}>
                                {result.phase === "ESTRO" ? "🟢" : result.phase === "PROESTRO" ? "🟡" : "🟣"} {result.phase}
                            </span>
                            <h2 style={{ fontSize: 24, fontWeight: 700, marginTop: 16 }}>Laudo — {patientName}</h2>
                            <p style={{ color: "var(--text-secondary)", fontSize: 14 }}>Confiança: {(result.confidence * 100).toFixed(0)}%</p>
                        </div>

                        {preview && <img src={preview} alt="Lâmina" style={{ width: "100%", maxHeight: 250, objectFit: "cover", borderRadius: 12, marginBottom: 24, border: "1px solid var(--border)" }} />}

                        <div className="stats-grid">
                            <div className="stat-card"><div className="stat-value" style={{ color: "var(--accent)" }}>{result.cornification_index.toFixed(1)}%</div><div className="stat-label">IQ</div></div>
                            <div className="stat-card"><div className="stat-value">{result.total_epithelial}</div><div className="stat-label">Cél. Epiteliais</div></div>
                            <div className="stat-card"><div className="stat-value">{result.cells.neutrophil}</div><div className="stat-label">Neutrófilos</div></div>
                            <div className="stat-card"><div className="stat-value">{result.cells.superficial_nucleated + result.cells.anuclear_squame}</div><div className="stat-label">Queratinizadas</div></div>
                        </div>

                        <div className="reasoning-card"><h3>🧠 Raciocínio</h3><p>{result.reasoning}</p></div>
                        <div className="reasoning-card" style={{ borderColor: "rgba(48,209,88,0.2)", background: "rgba(48,209,88,0.04)" }}><h3>💡 Conselho</h3><p>{result.insemination_advice}</p></div>
                    </div>

                    <div style={{ display: "flex", gap: 16, justifyContent: "center", marginTop: 24 }}>
                        {!saved ? (
                            <button className="btn-primary" onClick={saveToPatient}>💾 Salvar no perfil de {patientName}</button>
                        ) : (
                            <div style={{ padding: "12px 24px", borderRadius: "var(--radius-xl)", background: "rgba(48,209,88,0.15)", color: "var(--success)", fontWeight: 600 }}>
                                ✅ Salvo no perfil de {patientName}
                            </div>
                        )}
                        <button className="btn-secondary" onClick={reset}>Nova Análise</button>
                    </div>
                </div>
            )}
        </div>
    );
}
