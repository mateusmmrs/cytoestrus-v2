"use client";
import { useState } from "react";
import { mockCytologies, mockPatients } from "@/lib/mock-data";

const phaseLabels: Record<string, string> = {
    ESTRO: "Estro", PROESTRO: "Proestro", DIESTRO: "Diestro", ANESTRO: "Anestro",
};

export default function GaleriaPage() {
    const [filterPatient, setFilterPatient] = useState("ALL");
    const [filterPhase, setFilterPhase] = useState("ALL");
    const [selected, setSelected] = useState<string[]>([]);
    const [viewModal, setViewModal] = useState<string | null>(null);

    const filtered = mockCytologies
        .filter(c => filterPatient === "ALL" || c.patient_id === filterPatient)
        .filter(c => filterPhase === "ALL" || c.phase === filterPhase)
        .sort((a, b) => new Date(b.exam_date).getTime() - new Date(a.exam_date).getTime());

    const toggleSelect = (id: string) => {
        if (selected.includes(id)) setSelected(selected.filter(s => s !== id));
        else if (selected.length < 2) setSelected([...selected, id]);
    };

    const compareSlides = selected.length === 2 ? selected.map(id => filtered.find(c => c.id === id)!) : null;
    const viewSlide = viewModal ? mockCytologies.find(c => c.id === viewModal) : null;

    return (
        <div className="page-container">
            <div className="page-header">
                <div>
                    <h1>Galeria de Lâminas</h1>
                    <p>{mockCytologies.length} lâminas registradas</p>
                </div>
            </div>

            {/* Filters */}
            <div className="filters-bar">
                <select className="select-input" value={filterPatient} onChange={e => setFilterPatient(e.target.value)} style={{ maxWidth: 240 }}>
                    <option value="ALL">Todas as pacientes</option>
                    {mockPatients.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                </select>
                <div className="filter-pills">
                    {["ALL", "ESTRO", "PROESTRO", "DIESTRO", "ANESTRO"].map(f => (
                        <button key={f} className={`filter-pill ${filterPhase === f ? "active" : ""}`} onClick={() => setFilterPhase(f)}>
                            {f === "ALL" ? "Todas" : phaseLabels[f]}
                        </button>
                    ))}
                </div>
            </div>

            {selected.length > 0 && (
                <div style={{ marginBottom: 16, padding: "8px 16px", borderRadius: 12, background: "rgba(41,151,255,0.08)", border: "1px solid rgba(41,151,255,0.2)", fontSize: 13, color: "var(--accent)" }}>
                    {selected.length === 1 ? "1 selecionada — clique em outra para comparar" : "2 selecionadas — comparação abaixo"}
                    <button onClick={() => setSelected([])} style={{ marginLeft: 12, color: "var(--danger)", background: "none", border: "none", cursor: "pointer", fontSize: 13 }}>Limpar</button>
                </div>
            )}

            {/* Comparison */}
            {compareSlides && (
                <div className="compare-container">
                    {compareSlides.map((c) => (
                        <div key={c.id} className="compare-card">
                            <div className="slide-thumb-img" style={{ height: 200, background: "var(--bg-glass)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 48 }}>🔬</div>
                            <div style={{ padding: 16 }}>
                                <strong>{c.patient_name}</strong> — {new Date(c.exam_date).toLocaleDateString("pt-BR")}
                                <div style={{ display: "flex", gap: 8, marginTop: 8, alignItems: "center" }}>
                                    <span className={`phase-badge-sm phase-${c.phase.toLowerCase()}`}>{c.phase}</span>
                                    <span>IQ {c.cornification_index.toFixed(0)}%</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Slide Grid */}
            <div className="slide-gallery">
                {filtered.map(c => (
                    <div key={c.id} className={`slide-thumb ${selected.includes(c.id) ? "selected" : ""}`}>
                        <div className="slide-thumb-img" onClick={() => setViewModal(c.id)} style={{ background: "var(--bg-glass)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 32, cursor: "pointer" }}>🔬</div>
                        <div className="slide-thumb-info">
                            <strong style={{ fontSize: 13 }}>{c.patient_name}</strong>
                            <span className={`phase-badge-sm phase-${c.phase.toLowerCase()}`}>{c.phase}</span>
                            <span>IQ {c.cornification_index.toFixed(0)}%</span>
                            <span style={{ fontSize: 12, color: "var(--text-tertiary)" }}>{new Date(c.exam_date).toLocaleDateString("pt-BR")}</span>
                        </div>
                        <button className="slide-select-btn" onClick={(e) => { e.stopPropagation(); toggleSelect(c.id); }}>
                            {selected.includes(c.id) ? "✓" : "○"}
                        </button>
                    </div>
                ))}
            </div>

            {/* View Modal */}
            {viewSlide && (
                <div className="modal-overlay" onClick={() => setViewModal(null)}>
                    <div className="modal-content" onClick={e => e.stopPropagation()}>
                        <button className="modal-close" onClick={() => setViewModal(null)}>✕</button>
                        <div style={{ background: "var(--bg-glass)", borderRadius: 12, height: 300, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 64, marginBottom: 24 }}>🔬</div>
                        <h3>{viewSlide.patient_name} — {new Date(viewSlide.exam_date).toLocaleDateString("pt-BR")}</h3>
                        <div style={{ display: "flex", gap: 12, marginTop: 12, alignItems: "center" }}>
                            <span className={`phase-badge-sm phase-${viewSlide.phase.toLowerCase()}`}>{viewSlide.phase}</span>
                            <span>IQ {viewSlide.cornification_index.toFixed(1)}%</span>
                            <span>{(viewSlide.confidence * 100).toFixed(0)}% conf.</span>
                        </div>
                        <p style={{ marginTop: 16, fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.7 }}>{viewSlide.reasoning}</p>
                    </div>
                </div>
            )}
        </div>
    );
}
