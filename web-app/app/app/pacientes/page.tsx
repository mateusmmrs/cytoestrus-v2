"use client";
import { useState } from "react";
import Link from "next/link";
import { mockPatients } from "@/lib/mock-data";

const phaseColors: Record<string, string> = {
    ESTRO: "var(--success)", PROESTRO: "var(--warning)", DIESTRO: "var(--purple)", ANESTRO: "var(--text-tertiary)",
};

export default function PacientesPage() {
    const [search, setSearch] = useState("");
    const [filterPhase, setFilterPhase] = useState<string>("ALL");

    const filtered = mockPatients
        .filter(p => !search || p.name.toLowerCase().includes(search.toLowerCase()) || p.breed.toLowerCase().includes(search.toLowerCase()))
        .filter(p => filterPhase === "ALL" || p.current_phase === filterPhase)
        .sort((a, b) => {
            const priority: Record<string, number> = { ESTRO: 0, PROESTRO: 1, DIESTRO: 2, ANESTRO: 3 };
            return (priority[a.current_phase || 'ANESTRO'] ?? 4) - (priority[b.current_phase || 'ANESTRO'] ?? 4);
        });

    const getAge = (birthDate: string) => {
        const diff = Date.now() - new Date(birthDate).getTime();
        const years = Math.floor(diff / (365.25 * 24 * 60 * 60 * 1000));
        const months = Math.floor((diff % (365.25 * 24 * 60 * 60 * 1000)) / (30.44 * 24 * 60 * 60 * 1000));
        return years > 0 ? `${years}a ${months}m` : `${months}m`;
    };

    return (
        <div className="page-container">
            <div className="page-header">
                <div>
                    <h1>Pacientes</h1>
                    <p>{mockPatients.length} cadastradas</p>
                </div>
                <button className="btn-primary" onClick={() => alert("Em construção — será formulário de cadastro")} style={{ fontSize: 14, padding: "10px 20px" }}>
                    + Nova Paciente
                </button>
            </div>

            {/* Filters */}
            <div className="filters-bar">
                <input
                    type="text"
                    className="search-input"
                    placeholder="Buscar por nome ou raça..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
                <div className="filter-pills">
                    {["ALL", "ESTRO", "PROESTRO", "DIESTRO", "ANESTRO"].map((f) => (
                        <button
                            key={f}
                            className={`filter-pill ${filterPhase === f ? "active" : ""}`}
                            onClick={() => setFilterPhase(f)}
                            style={f !== "ALL" ? { borderColor: phaseColors[f] } : {}}
                        >
                            {f === "ALL" ? "Todas" : f.charAt(0) + f.slice(1).toLowerCase()}
                        </button>
                    ))}
                </div>
            </div>

            {/* Patient Cards */}
            <div className="patients-grid">
                {filtered.map((p) => (
                    <Link href={`/app/pacientes/${p.id}`} key={p.id} className="patient-card">
                        <div className="patient-card-header">
                            <div className="patient-avatar">{p.name[0]}</div>
                            <div>
                                <h3>{p.name}</h3>
                                <span className="patient-breed">{p.breed}</span>
                            </div>
                            {p.current_phase && (
                                <span className={`phase-badge-sm phase-${p.current_phase.toLowerCase()}`}>
                                    {p.current_phase}
                                </span>
                            )}
                        </div>
                        <div className="patient-card-body">
                            <div className="patient-info-row">
                                <span>Idade</span>
                                <span>{getAge(p.birth_date)}</span>
                            </div>
                            <div className="patient-info-row">
                                <span>Peso</span>
                                <span>{p.weight_kg} kg</span>
                            </div>
                            <div className="patient-info-row">
                                <span>Tutor</span>
                                <span>{p.owner_name}</span>
                            </div>
                            <div className="patient-info-row">
                                <span>Último exame</span>
                                <span>{p.last_exam_date ? new Date(p.last_exam_date).toLocaleDateString("pt-BR") : "—"}</span>
                            </div>
                        </div>
                        {p.alert && (
                            <div className="patient-alert">
                                ⚡ {p.alert}
                            </div>
                        )}
                    </Link>
                ))}
            </div>
        </div>
    );
}
