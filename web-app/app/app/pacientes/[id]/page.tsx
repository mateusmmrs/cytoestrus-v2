"use client";
import { useState } from "react";
import { useParams } from "next/navigation";
import { mockPatients, getPatientCytologies, mockCycles } from "@/lib/mock-data";
import type { Cytology } from "@/lib/types";

const phaseLabels: Record<string, string> = {
    ESTRO: "Estro", PROESTRO: "Proestro", DIESTRO: "Diestro", ANESTRO: "Anestro",
};

export default function PatientDetailPage() {
    const { id } = useParams<{ id: string }>();
    const patient = mockPatients.find(p => p.id === id);
    const cytologies = getPatientCytologies(id);
    const cycles = mockCycles.filter(c => c.patient_id === id);
    const [tab, setTab] = useState<"citologias" | "perfil" | "galeria">("citologias");

    if (!patient) return <div className="page-container"><h1>Paciente não encontrada</h1></div>;

    const getAge = (d: string) => {
        const diff = Date.now() - new Date(d).getTime();
        const y = Math.floor(diff / (365.25 * 24 * 60 * 60 * 1000));
        const m = Math.floor((diff % (365.25 * 24 * 60 * 60 * 1000)) / (30.44 * 24 * 60 * 60 * 1000));
        return y > 0 ? `${y} anos e ${m} meses` : `${m} meses`;
    };

    return (
        <div className="page-container">
            {/* Patient Header */}
            <div className="patient-profile-header">
                <div className="patient-profile-avatar">{patient.name[0]}</div>
                <div className="patient-profile-info">
                    <h1>{patient.name}</h1>
                    <p>{patient.breed} · {getAge(patient.birth_date)} · {patient.weight_kg} kg</p>
                    <p style={{ color: "var(--text-tertiary)", fontSize: 13, marginTop: 4 }}>
                        Tutor: {patient.owner_name} · {patient.owner_phone}
                        {patient.kennel_name && <> · Canil: {patient.kennel_name}</>}
                    </p>
                </div>
                {patient.current_phase && (
                    <span className={`phase-badge-sm phase-${patient.current_phase.toLowerCase()}`} style={{ fontSize: 14, padding: "8px 16px" }}>
                        {phaseLabels[patient.current_phase]}
                    </span>
                )}
            </div>

            {patient.notes && (
                <div className="reasoning-card" style={{ marginBottom: 24, padding: 20 }}>
                    <p style={{ fontSize: 14, color: "var(--text-secondary)" }}>📝 {patient.notes}</p>
                </div>
            )}

            {/* Tabs */}
            <div className="profile-tabs">
                <button className={`profile-tab ${tab === "citologias" ? "active" : ""}`} onClick={() => setTab("citologias")}>
                    🔬 Citologias ({cytologies.length})
                </button>
                <button className={`profile-tab ${tab === "perfil" ? "active" : ""}`} onClick={() => setTab("perfil")}>
                    📊 Perfil Reprodutivo
                </button>
                <button className={`profile-tab ${tab === "galeria" ? "active" : ""}`} onClick={() => setTab("galeria")}>
                    🖼️ Galeria de Lâminas
                </button>
            </div>

            {/* Citologias Tab */}
            {tab === "citologias" && (
                <div className="tab-content">
                    {/* IQ Timeline Chart (simplified) */}
                    {cytologies.length >= 2 && (
                        <div className="reasoning-card" style={{ marginBottom: 24 }}>
                            <h3>📈 Curva de Queratinização (IQ%)</h3>
                            <div className="iq-chart">
                                <div className="iq-chart-area">
                                    {/* Phase bands */}
                                    <div className="iq-band band-estro" />
                                    <div className="iq-band band-proestro" />
                                    {/* Data points */}
                                    {cytologies.map((c, i) => {
                                        const x = (i / (cytologies.length - 1)) * 100;
                                        const y = 100 - c.cornification_index;
                                        return (
                                            <div key={c.id} className="iq-point" style={{ left: `${x}%`, bottom: `${c.cornification_index}%` }}
                                                title={`${new Date(c.exam_date).toLocaleDateString("pt-BR")} — IQ ${c.cornification_index}%`}>
                                                <div className="iq-point-dot" style={{ background: c.cornification_index >= 80 ? "var(--success)" : c.cornification_index >= 50 ? "var(--warning)" : "var(--accent)" }} />
                                                <span className="iq-point-label">{c.cornification_index.toFixed(0)}%</span>
                                            </div>
                                        );
                                    })}
                                    {/* Line connecting points */}
                                    <svg className="iq-line-svg" viewBox="0 0 100 100" preserveAspectRatio="none">
                                        <polyline
                                            fill="none"
                                            stroke="var(--accent)"
                                            strokeWidth="0.8"
                                            points={cytologies.map((c, i) => `${(i / (cytologies.length - 1)) * 100},${100 - c.cornification_index}`).join(" ")}
                                        />
                                    </svg>
                                </div>
                                <div className="iq-chart-labels">
                                    {cytologies.map((c) => (
                                        <span key={c.id}>{new Date(c.exam_date).toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" })}</span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Cytology list */}
                    <div className="cytology-list">
                        {cytologies.map((c) => (
                            <CytologyCard key={c.id} cytology={c} />
                        ))}
                    </div>
                </div>
            )}

            {/* Perfil Reprodutivo Tab */}
            {tab === "perfil" && (
                <div className="tab-content">
                    <div className="stats-grid" style={{ marginBottom: 24 }}>
                        <div className="stat-card">
                            <div className="stat-value">{cycles.length}</div>
                            <div className="stat-label">Ciclos Rastreados</div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-value" style={{ color: "var(--success)" }}>
                                {cycles.length > 0 ? `${cycles[0].peak_iq?.toFixed(0) || "—"}%` : "—"}
                            </div>
                            <div className="stat-label">IQ Máximo</div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-value">{cytologies.length}</div>
                            <div className="stat-label">Total de Exames</div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-value">~6.5</div>
                            <div className="stat-label">Interv. Interestro (meses)</div>
                        </div>
                    </div>

                    {/* Cycle Cards */}
                    {cycles.map((cycle) => (
                        <div key={cycle.id} className="reasoning-card" style={{ marginBottom: 16 }}>
                            <h3>📅 Ciclo: {new Date(cycle.start_date).toLocaleDateString("pt-BR")} → {cycle.end_date ? new Date(cycle.end_date).toLocaleDateString("pt-BR") : "Em andamento"}</h3>
                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginTop: 12 }}>
                                <div>
                                    <div style={{ fontSize: 12, color: "var(--text-tertiary)" }}>IQ PICO</div>
                                    <div style={{ fontSize: 18, fontWeight: 600, color: "var(--success)" }}>{cycle.peak_iq?.toFixed(0) || "—"}%</div>
                                </div>
                                <div>
                                    <div style={{ fontSize: 12, color: "var(--text-tertiary)" }}>OVULAÇÃO ESTIM.</div>
                                    <div style={{ fontSize: 18, fontWeight: 600 }}>{cycle.estimated_ovulation_date ? new Date(cycle.estimated_ovulation_date).toLocaleDateString("pt-BR") : "—"}</div>
                                </div>
                                <div>
                                    <div style={{ fontSize: 12, color: "var(--text-tertiary)" }}>COBRIÇÃO</div>
                                    <div style={{ fontSize: 18, fontWeight: 600 }}>{cycle.was_bred ? "Sim" : "Não"}</div>
                                </div>
                            </div>
                            {cycle.notes && <p style={{ fontSize: 13, color: "var(--text-tertiary)", marginTop: 12 }}>{cycle.notes}</p>}
                        </div>
                    ))}
                    {cycles.length === 0 && <p style={{ color: "var(--text-tertiary)" }}>Nenhum ciclo registrado ainda.</p>}
                </div>
            )}

            {/* Galeria Tab */}
            {tab === "galeria" && (
                <div className="tab-content">
                    <div className="slide-gallery">
                        {cytologies.map((c) => (
                            <div key={c.id} className="slide-thumb">
                                <div className="slide-thumb-img" style={{ background: "var(--bg-glass)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 32 }}>🔬</div>
                                <div className="slide-thumb-info">
                                    <span className={`phase-badge-sm phase-${c.phase.toLowerCase()}`}>{c.phase}</span>
                                    <span>IQ {c.cornification_index.toFixed(0)}%</span>
                                    <span>{new Date(c.exam_date).toLocaleDateString("pt-BR")}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                    {cytologies.length === 0 && <p style={{ color: "var(--text-tertiary)" }}>Nenhuma lâmina registrada.</p>}
                </div>
            )}
        </div>
    );
}

function CytologyCard({ cytology }: { cytology: Cytology }) {
    const [expanded, setExpanded] = useState(false);
    return (
        <div className="cytology-card" onClick={() => setExpanded(!expanded)}>
            <div className="cytology-card-header">
                <div className="cytology-card-date">
                    {new Date(cytology.exam_date).toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" })}
                </div>
                <span className={`phase-badge-sm phase-${cytology.phase.toLowerCase()}`}>{cytology.phase}</span>
                <div className="cytology-card-iq">IQ {cytology.cornification_index.toFixed(1)}%</div>
                <div style={{ fontSize: 13, color: "var(--text-tertiary)" }}>{(cytology.confidence * 100).toFixed(0)}% conf.</div>
                <span style={{ color: "var(--text-tertiary)", fontSize: 12 }}>{expanded ? "▲" : "▼"}</span>
            </div>
            {expanded && (
                <div className="cytology-card-body">
                    <p style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.7 }}>{cytology.reasoning}</p>
                    <div style={{ marginTop: 12, padding: 12, borderRadius: 8, background: "rgba(48,209,88,0.04)", border: "1px solid rgba(48,209,88,0.15)" }}>
                        <strong style={{ fontSize: 13, color: "var(--success)" }}>💡 Conselho:</strong>
                        <p style={{ fontSize: 13, color: "var(--text-secondary)", marginTop: 4 }}>{cytology.insemination_advice}</p>
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8, marginTop: 12 }}>
                        {Object.entries(cytology.cells).map(([k, v]) => (
                            <div key={k} style={{ fontSize: 12, display: "flex", justifyContent: "space-between", padding: "4px 0", borderBottom: "1px solid var(--border)" }}>
                                <span style={{ color: "var(--text-tertiary)" }}>{k.replace(/_/g, " ")}</span>
                                <span style={{ fontWeight: 600 }}>{v}</span>
                            </div>
                        ))}
                    </div>
                    {cytology.notes && <p style={{ fontSize: 12, color: "var(--text-tertiary)", marginTop: 8 }}>📝 {cytology.notes}</p>}
                </div>
            )}
        </div>
    );
}
