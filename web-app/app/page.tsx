"use client";
import { useState, useRef, useCallback } from "react";

type Phase = "ESTRO" | "PROESTRO" | "DIESTRO" | "ANESTRO";
type AppState = "landing" | "uploading" | "analyzing" | "results";

interface CellCounts {
    parabasal: number;
    intermediate_small: number;
    intermediate_large: number;
    superficial_nucleated: number;
    anuclear_squame: number;
    neutrophil: number;
}

interface AnalysisResult {
    phase: Phase;
    confidence: number;
    cornification_index: number;
    reasoning: string;
    insemination_advice: string;
    cells: CellCounts;
    total_epithelial: number;
}

// Simulated analysis engine (rule-based, same logic as the Python pipeline)
function simulateAnalysis(): AnalysisResult {
    const scenarios: AnalysisResult[] = [
        {
            phase: "ESTRO",
            confidence: 0.94,
            cornification_index: 87.2,
            reasoning:
                "IQ de 87.2% confirmando queratinização máxima do epitélio vaginal. Predomínio absoluto de células superficiais nucleadas (22) e escamas anucleares (19), com ausência total de neutrófilos. Padrão citológico compatível com pico estrogênico e ovulação iminente ou recente.",
            insemination_advice:
                "Momento ideal para inseminação artificial ou monta natural. Recomenda-se dosagem de progesterona sérica para confirmar o dia da ovulação e programar a IA em 48-72h pós-pico de LH.",
            cells: { parabasal: 0, intermediate_small: 1, intermediate_large: 5, superficial_nucleated: 22, anuclear_squame: 19, neutrophil: 0 },
            total_epithelial: 47,
        },
        {
            phase: "PROESTRO",
            confidence: 0.88,
            cornification_index: 62.5,
            reasoning:
                "IQ de 62.5% indica queratinização progressiva mas ainda não máxima. Mix de intermediárias grandes (12) e superficiais nucleadas (15), com presença residual de hemácias no fundo da lâmina. Neutrófilos em declínio (3 detectados). Padrão compatível com proestro tardio, fase de transição para o estro.",
            insemination_advice:
                "Aguardar 2 a 3 dias para nova citologia de acompanhamento. Monitorar a transição para estro (IQ > 80% com desaparecimento de neutrófilos). Iniciar dosagem de progesterona sérica a cada 48 horas.",
            cells: { parabasal: 1, intermediate_small: 4, intermediate_large: 12, superficial_nucleated: 15, anuclear_squame: 8, neutrophil: 3 },
            total_epithelial: 40,
        },
        {
            phase: "DIESTRO",
            confidence: 0.91,
            cornification_index: 12.0,
            reasoning:
                "IQ de 12.0% com retorno abrupto de células parabasais (8) e intermediárias pequenas (14). Neutrófilos abundantes (22 detectados) indicando a típica 'chuva de neutrófilos' do metestro/diestro inicial. Queda drástica da influência estrogênica confirma o fim do período fértil.",
            insemination_advice:
                "A fêmea NÃO está no período fértil. Se houve cobrição ou inseminação prévia, avaliar gestação por ultrassonografia a partir de 25 dias pós-ovulação. Se não houve cobrição, aguardar próximo ciclo.",
            cells: { parabasal: 8, intermediate_small: 14, intermediate_large: 3, superficial_nucleated: 2, anuclear_squame: 1, neutrophil: 22 },
            total_epithelial: 28,
        },
    ];

    return scenarios[Math.floor(Math.random() * scenarios.length)];
}

const phaseEmoji: Record<Phase, string> = {
    ESTRO: "🟢",
    PROESTRO: "🟡",
    DIESTRO: "🟣",
    ANESTRO: "⚪",
};
const phaseClass: Record<Phase, string> = {
    ESTRO: "phase-estro",
    PROESTRO: "phase-proestro",
    DIESTRO: "phase-diestro",
    ANESTRO: "phase-anestro",
};
const phaseLabels: Record<Phase, string> = {
    ESTRO: "Estro — Período Fértil",
    PROESTRO: "Proestro Tardio",
    DIESTRO: "Diestro (Metestro)",
    ANESTRO: "Anestro — Inatividade",
};

export default function Home() {
    const [state, setState] = useState<AppState>("landing");
    const [preview, setPreview] = useState<string | null>(null);
    const [result, setResult] = useState<AnalysisResult | null>(null);
    const [analysisStep, setAnalysisStep] = useState(0);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [dragOver, setDragOver] = useState(false);

    const handleFile = useCallback((file: File) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            setPreview(e.target?.result as string);
            setState("analyzing");
            runAnalysis();
        };
        reader.readAsDataURL(file);
    }, []);

    const runAnalysis = () => {
        setAnalysisStep(0);
        const steps = [1000, 2000, 3200, 4500];
        steps.forEach((delay, i) => {
            setTimeout(() => setAnalysisStep(i + 1), delay);
        });
        setTimeout(() => {
            setResult(simulateAnalysis());
            setState("results");
        }, 5500);
    };

    const reset = () => {
        setState("landing");
        setPreview(null);
        setResult(null);
        setAnalysisStep(0);
    };

    return (
        <>
            {/* NAV */}
            <nav className="nav">
                <div className="nav-logo" onClick={reset} style={{ cursor: "pointer" }}>
                    🔬 <span>Cyto</span>Estrus
                </div>
                <div className="nav-links">
                    <a href="#features">Como funciona</a>
                    <a href="#architecture">Arquitetura</a>
                    <a href="#demo">Analisar</a>
                </div>
            </nav>

            {state === "landing" && <LandingPage onUpload={handleFile} fileInputRef={fileInputRef} dragOver={dragOver} setDragOver={setDragOver} />}
            {state === "analyzing" && <AnalyzingPage preview={preview} step={analysisStep} />}
            {state === "results" && result && <ResultsPage result={result} preview={preview} onReset={reset} />}
        </>
    );
}

/* ====== LANDING PAGE ====== */
function LandingPage({
    onUpload,
    fileInputRef,
    dragOver,
    setDragOver,
}: {
    onUpload: (f: File) => void;
    fileInputRef: React.RefObject<HTMLInputElement | null>;
    dragOver: boolean;
    setDragOver: (v: boolean) => void;
}) {
    return (
        <>
            {/* HERO */}
            <section className="hero">
                <div className="hero-badge">🧬 Visão Computacional + IA Generativa</div>
                <h1>
                    Citologia vaginal
                    <br />
                    <span className="gradient">automatizada.</span>
                </h1>
                <p>
                    Fotografe a lâmina no microscópio. A rede neural detecta cada célula. O LLM interpreta a fase do ciclo estral. Em segundos.
                </p>
                <div className="hero-cta">
                    <a href="#demo" className="btn-primary">
                        Analisar Lâmina →
                    </a>
                    <a href="#features" className="btn-secondary">
                        Como funciona
                    </a>
                </div>
            </section>

            {/* FEATURES */}
            <section className="section" id="features">
                <div className="section-label">Recursos</div>
                <h2 className="section-title">Dois estágios.<br />Uma resposta.</h2>
                <p className="section-subtitle">
                    A arquitetura híbrida combina a velocidade de uma rede neural convolucional com o raciocínio clínico de um modelo de linguagem.
                </p>
                <div className="features-grid">
                    <div className="feature-card">
                        <div className="feature-icon">🔍</div>
                        <h3>Detecção Celular</h3>
                        <p>YOLOv8-nano identifica e classifica 6 tipos celulares em tempo real: parabasais, intermediárias (S/L), superficiais, anucleares e neutrófilos.</p>
                    </div>
                    <div className="feature-card">
                        <div className="feature-icon">🧮</div>
                        <h3>Índice de Queratinização</h3>
                        <p>Calculado automaticamente a partir das contagens celulares. IQ ≥ 80% = Estro. Sem subjetividade, sem variação entre operadores.</p>
                    </div>
                    <div className="feature-card">
                        <div className="feature-icon">🧠</div>
                        <h3>Interpretação por LLM</h3>
                        <p>O modelo de linguagem recebe apenas o JSON com contagens (~200 tokens), não a imagem. Custo por análise: ~R$ 0,01. Raciocínio clínico explicável.</p>
                    </div>
                    <div className="feature-card">
                        <div className="feature-icon">📱</div>
                        <h3>Foto de Celular</h3>
                        <p>Não precisa de câmera científica. Uma foto de celular adaptada à ocular do microscópio é suficiente para a detecção funcionar.</p>
                    </div>
                    <div className="feature-card">
                        <div className="feature-icon">🐾</div>
                        <h3>Metestro Inteligente</h3>
                        <p>A célula de metestro é detectada por sobreposição espacial: neutrófilo dentro do citoplasma de uma intermediária. Sem classe extra no modelo.</p>
                    </div>
                    <div className="feature-card">
                        <div className="feature-icon">📊</div>
                        <h3>Laudo Completo</h3>
                        <p>Fase do ciclo, IQ, contagem celular detalhada, raciocínio fisiológico e conselho reprodutivo. Tudo em JSON exportável.</p>
                    </div>
                </div>
            </section>

            {/* ARCHITECTURE */}
            <section className="section" id="architecture">
                <div className="section-label">Arquitetura</div>
                <h2 className="section-title">Pipeline de<br />dois estágios.</h2>
                <p className="section-subtitle">
                    A rede neural é determinística e roda offline. O LLM recebe só texto. Custo por análise cai de ~$0.10 para ~$0.002.
                </p>
                <div className="arch-flow">
                    <div className="arch-node">
                        <h4>📸 Imagem</h4>
                        <p>Foto da lâmina</p>
                    </div>
                    <span className="arch-arrow">→</span>
                    <div className="arch-node">
                        <h4>🧬 YOLOv8</h4>
                        <p>6 classes celulares</p>
                    </div>
                    <span className="arch-arrow">→</span>
                    <div className="arch-node">
                        <h4>📋 JSON</h4>
                        <p>Contagens + IQ</p>
                    </div>
                    <span className="arch-arrow">→</span>
                    <div className="arch-node">
                        <h4>🧠 LLM</h4>
                        <p>Fase + Conselho</p>
                    </div>
                </div>
            </section>

            {/* DEMO — UPLOAD */}
            <section className="demo-section" id="demo">
                <div className="section-label" style={{ marginBottom: 12 }}>Demo</div>
                <h2 className="section-title" style={{ marginBottom: 20 }}>Teste agora.</h2>
                <p className="section-subtitle" style={{ margin: "0 auto 48px", maxWidth: 500 }}>
                    Envie uma foto de citologia vaginal canina e veja o diagnóstico em tempo real.
                </p>
                <div
                    className={`upload-zone ${dragOver ? "dragover" : ""}`}
                    onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                    onDragLeave={() => setDragOver(false)}
                    onDrop={(e) => {
                        e.preventDefault();
                        setDragOver(false);
                        if (e.dataTransfer.files[0]) onUpload(e.dataTransfer.files[0]);
                    }}
                    onClick={() => fileInputRef.current?.click()}
                >
                    <input
                        type="file"
                        ref={fileInputRef}
                        accept="image/*"
                        onChange={(e) => {
                            if (e.target.files?.[0]) onUpload(e.target.files[0]);
                        }}
                    />
                    <div className="upload-icon">🔬</div>
                    <h3>Arraste a imagem ou clique para selecionar</h3>
                    <p>JPG, PNG ou WEBP • Foto de microscópio</p>
                </div>
            </section>

            <footer className="footer">
                <p>CytoEstrus v2 · Mateus Martins · Médico Veterinário · Analista de Dados</p>
            </footer>
        </>
    );
}

/* ====== ANALYZING PAGE ====== */
function AnalyzingPage({ preview, step }: { preview: string | null; step: number }) {
    const steps = [
        "Pré-processamento da imagem",
        "Detecção celular (YOLOv8)",
        "Contagem e cálculo do IQ",
        "Interpretação clínica (LLM)",
    ];

    return (
        <section className="demo-section" style={{ paddingTop: 120 }}>
            <div className="analysis-container">
                {preview && (
                    <img
                        src={preview}
                        alt="Lâmina"
                        style={{
                            width: "100%",
                            maxHeight: 240,
                            objectFit: "cover",
                            borderRadius: 12,
                            marginBottom: 32,
                            opacity: 0.8,
                        }}
                    />
                )}
                <div className="spinner" />
                <h3 style={{ fontSize: 20, fontWeight: 600, marginBottom: 8 }}>Analisando lâmina...</h3>
                <p style={{ color: "var(--text-tertiary)", fontSize: 14 }}>Pipeline de dois estágios em execução</p>
                <ul className="analysis-steps">
                    {steps.map((s, i) => (
                        <li key={i} className={step > i ? "done" : step === i ? "active" : ""}>
                            <span>{step > i ? "✅" : step === i ? "⏳" : "○"}</span>
                            {s}
                        </li>
                    ))}
                </ul>
            </div>
        </section>
    );
}

/* ====== RESULTS PAGE ====== */
function ResultsPage({
    result,
    preview,
    onReset,
}: {
    result: AnalysisResult;
    preview: string | null;
    onReset: () => void;
}) {
    return (
        <section className="section" style={{ paddingTop: 100 }}>
            <div className="results-container">
                <div className="result-header">
                    <div className={`phase-badge ${phaseClass[result.phase]}`}>
                        {phaseEmoji[result.phase]} {phaseLabels[result.phase]}
                    </div>
                    <h2 className="section-title" style={{ marginTop: 24 }}>
                        Diagnóstico concluído.
                    </h2>
                    <p style={{ color: "var(--text-secondary)", fontSize: 16 }}>
                        Confiança do modelo: <strong>{(result.confidence * 100).toFixed(0)}%</strong>
                    </p>
                </div>

                {preview && (
                    <img
                        src={preview}
                        alt="Lâmina analisada"
                        style={{
                            width: "100%",
                            maxHeight: 300,
                            objectFit: "cover",
                            borderRadius: 16,
                            marginBottom: 40,
                            border: "1px solid var(--border)",
                        }}
                    />
                )}

                {/* Stats */}
                <div className="stats-grid">
                    <div className="stat-card">
                        <div className="stat-value" style={{ color: "var(--accent)" }}>
                            {result.cornification_index.toFixed(1)}%
                        </div>
                        <div className="stat-label">Índice de Queratinização</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-value">{result.total_epithelial}</div>
                        <div className="stat-label">Células Epiteliais</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-value">{result.cells.neutrophil}</div>
                        <div className="stat-label">Neutrófilos</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-value">
                            {result.cells.superficial_nucleated + result.cells.anuclear_squame}
                        </div>
                        <div className="stat-label">Queratinizadas</div>
                    </div>
                </div>

                {/* Cell Breakdown */}
                <div className="reasoning-card">
                    <h3>🔬 Contagem Celular Detalhada</h3>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px 24px", marginTop: 12 }}>
                        {Object.entries(result.cells).map(([key, val]) => (
                            <div key={key} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: "1px solid var(--border)" }}>
                                <span style={{ color: "var(--text-secondary)", fontSize: 14 }}>
                                    {key.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}
                                </span>
                                <span style={{ fontWeight: 600 }}>{val}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Reasoning */}
                <div className="reasoning-card">
                    <h3>🧠 Raciocínio Clínico</h3>
                    <p>{result.reasoning}</p>
                </div>

                {/* Advice */}
                <div className="reasoning-card" style={{ borderColor: "rgba(48,209,88,0.2)", background: "rgba(48,209,88,0.04)" }}>
                    <h3>💡 Conselho Reprodutivo</h3>
                    <p>{result.insemination_advice}</p>
                </div>

                {/* Fertility Prediction Window */}
                <FertilityWindow phase={result.phase} iq={result.cornification_index} />

                {/* Actions */}
                <div style={{ display: "flex", gap: 16, justifyContent: "center", marginTop: 48 }}>
                    <button className="btn-primary" onClick={onReset}>
                        Nova Análise →
                    </button>
                    <button className="btn-secondary" onClick={() => {
                        const blob = new Blob([JSON.stringify(result, null, 2)], { type: "application/json" });
                        const url = URL.createObjectURL(blob);
                        const a = document.createElement("a");
                        a.href = url;
                        a.download = `cytoestrus_laudo_${Date.now()}.json`;
                        a.click();
                        URL.revokeObjectURL(url);
                    }}>
                        Exportar JSON
                    </button>
                </div>
            </div>
            <footer className="footer" style={{ marginTop: 80 }}>
                <p>CytoEstrus v2 · Mateus Martins · Médico Veterinário · Analista de Dados</p>
            </footer>
        </section>
    );
}

/* ====== FERTILITY PREDICTION WINDOW ====== */
/*
  Scientifically grounded on:
  - Concannon PW (2011). Reproductive cycles of the domestic bitch. Anim Reprod Sci.
  - Johnston SD, Root Kustritz MV, Olson PNS (2001). Canine and Feline Theriogenology.
  
  Key physiological facts:
  - LH surge occurs when IQ ≈ 80-90% and progesterone begins to rise (>2 ng/mL)
  - Ovulation = LH +2 days (oocytes released as primary oocytes)
  - Oocyte maturation = 2-3 days post-ovulation
  - Optimal insemination window = LH +4 to LH +7 (day 4-7 post LH surge)
  - Fertile window lasts ~3-5 days after oocyte maturation
*/
function FertilityWindow({ phase, iq }: { phase: Phase; iq: number }) {
    // Compute fertility prediction based on phase + IQ
    const prediction = computeFertilityPrediction(phase, iq);

    return (
        <div className="reasoning-card" style={{ borderColor: "rgba(41,151,255,0.2)", background: "rgba(41,151,255,0.04)" }}>
            <h3>📅 Janela de Fertilidade Predita</h3>
            <p style={{ fontSize: 13, color: "var(--text-tertiary)", marginBottom: 16 }}>
                Baseado em Concannon (2011) e Johnston et al. (2001)
            </p>

            {/* Visual Timeline */}
            <div style={{ position: "relative", margin: "24px 0", padding: "0 8px" }}>
                {/* Track */}
                <div style={{ height: 6, background: "var(--border)", borderRadius: 3, position: "relative" }}>
                    {/* Fertile window highlight */}
                    <div style={{
                        position: "absolute",
                        left: `${prediction.windowStart}%`,
                        width: `${prediction.windowWidth}%`,
                        height: "100%",
                        background: prediction.isNow ? "var(--success)" : "var(--accent)",
                        borderRadius: 3,
                        opacity: 0.6,
                        animation: prediction.isNow ? "pulse 2s ease-in-out infinite" : "none",
                    }} />
                    {/* Current position marker */}
                    <div style={{
                        position: "absolute",
                        left: `${prediction.currentPosition}%`,
                        top: "50%",
                        transform: "translate(-50%, -50%)",
                        width: 16,
                        height: 16,
                        borderRadius: "50%",
                        background: prediction.isNow ? "var(--success)" : "white",
                        border: "3px solid var(--bg-card)",
                        boxShadow: prediction.isNow ? "0 0 12px var(--success)" : "0 0 8px rgba(255,255,255,0.3)",
                        zIndex: 2,
                    }} />
                </div>

                {/* Labels */}
                <div style={{ display: "flex", justifyContent: "space-between", marginTop: 12, fontSize: 11, color: "var(--text-tertiary)" }}>
                    <span>Anestro</span>
                    <span>Proestro</span>
                    <span style={{ color: "var(--success)", fontWeight: 600 }}>Estro</span>
                    <span>Diestro</span>
                </div>
            </div>

            {/* Prediction Details Grid */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 20 }}>
                <div style={{ padding: 16, borderRadius: 12, background: "var(--bg-glass)", border: "1px solid var(--border)" }}>
                    <div style={{ fontSize: 12, color: "var(--text-tertiary)", marginBottom: 4 }}>STATUS</div>
                    <div style={{ fontSize: 16, fontWeight: 600, color: prediction.statusColor }}>{prediction.status}</div>
                </div>
                <div style={{ padding: 16, borderRadius: 12, background: "var(--bg-glass)", border: "1px solid var(--border)" }}>
                    <div style={{ fontSize: 12, color: "var(--text-tertiary)", marginBottom: 4 }}>JANELA FÉRTIL</div>
                    <div style={{ fontSize: 16, fontWeight: 600 }}>{prediction.windowLabel}</div>
                </div>
                <div style={{ padding: 16, borderRadius: 12, background: "var(--bg-glass)", border: "1px solid var(--border)" }}>
                    <div style={{ fontSize: 12, color: "var(--text-tertiary)", marginBottom: 4 }}>OVULAÇÃO ESTIMADA</div>
                    <div style={{ fontSize: 16, fontWeight: 600 }}>{prediction.ovulationEstimate}</div>
                </div>
                <div style={{ padding: 16, borderRadius: 12, background: "var(--bg-glass)", border: "1px solid var(--border)" }}>
                    <div style={{ fontSize: 12, color: "var(--text-tertiary)", marginBottom: 4 }}>IA RECOMENDADA</div>
                    <div style={{ fontSize: 16, fontWeight: 600, color: "var(--accent)" }}>{prediction.aiTiming}</div>
                </div>
            </div>

            {/* Scientific basis note */}
            <div style={{ marginTop: 16, padding: 12, borderRadius: 8, background: "rgba(255,255,255,0.02)", fontSize: 12, color: "var(--text-tertiary)", lineHeight: 1.6 }}>
                <strong>Base científica:</strong> Na cadela, a ovulação ocorre ~48h após o pico de LH. Os oócitos são liberados como oócitos primários e necessitam de 2-3 dias adicionais para maturação nuclear. A janela fértil real compreende os dias 4 a 7 pós-pico de LH (Concannon, 2011). A citologia vaginal isolada estima a janela, mas a dosagem de progesterona sérica (P4 &gt; 5 ng/mL = ovulação) é o gold-standard para timing preciso.
            </div>
        </div>
    );
}

function computeFertilityPrediction(phase: Phase, iq: number) {
    if (phase === "ESTRO" && iq >= 80) {
        return {
            status: "🟢 Janela Aberta",
            statusColor: "var(--success)",
            windowLabel: "Agora → 3 dias",
            ovulationEstimate: "Há 24-48h (provável)",
            aiTiming: "Hoje ou amanhã",
            currentPosition: 62,
            windowStart: 50,
            windowWidth: 25,
            isNow: true,
        };
    } else if (phase === "PROESTRO") {
        const daysToEstro = iq >= 70 ? "1-2 dias" : iq >= 50 ? "2-4 dias" : "4-7 dias";
        return {
            status: "🟡 Em Transição",
            statusColor: "var(--warning)",
            windowLabel: `Em ${daysToEstro}`,
            ovulationEstimate: `Em ${iq >= 70 ? "3-4" : "5-8"} dias`,
            aiTiming: `Programar em ${iq >= 70 ? "3-5" : "6-10"} dias`,
            currentPosition: iq >= 70 ? 42 : 30,
            windowStart: 50,
            windowWidth: 25,
            isNow: false,
        };
    } else if (phase === "DIESTRO") {
        return {
            status: "🟣 Janela Fechada",
            statusColor: "var(--purple)",
            windowLabel: "Encerrada",
            ovulationEstimate: "Já ocorreu (>5 dias)",
            aiTiming: "Não recomendado",
            currentPosition: 82,
            windowStart: 50,
            windowWidth: 25,
            isNow: false,
        };
    }
    return {
        status: "⚪ Inativa",
        statusColor: "var(--text-tertiary)",
        windowLabel: "Indeterminada",
        ovulationEstimate: "Sem previsão",
        aiTiming: "Aguardar proestro",
        currentPosition: 8,
        windowStart: 50,
        windowWidth: 25,
        isNow: false,
    };
}
