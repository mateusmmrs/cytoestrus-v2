"use client";
import Link from "next/link";
import { getDashboardStats } from "@/lib/mock-data";

const phaseColors: Record<string, string> = {
    ESTRO: "var(--success)", PROESTRO: "var(--warning)", DIESTRO: "var(--purple)", ANESTRO: "var(--text-tertiary)",
};
const phaseLabels: Record<string, string> = {
    ESTRO: "Estro", PROESTRO: "Proestro", DIESTRO: "Diestro", ANESTRO: "Anestro",
};

export default function DashboardPage() {
    const stats = getDashboardStats();

    return (
        <div className="page-container">
            <div className="page-header">
                <h1>Dashboard</h1>
                <p>Visão geral da clínica</p>
            </div>

            {/* Stats Cards */}
            <div className="dashboard-stats">
                <div className="dash-stat-card">
                    <div className="dash-stat-value">{stats.totalPatients}</div>
                    <div className="dash-stat-label">Pacientes</div>
                </div>
                <div className="dash-stat-card">
                    <div className="dash-stat-value">{stats.examsThisMonth}</div>
                    <div className="dash-stat-label">Exames este mês</div>
                </div>
                <div className="dash-stat-card">
                    <div className="dash-stat-value">{stats.examsThisWeek}</div>
                    <div className="dash-stat-label">Exames esta semana</div>
                </div>
                <div className="dash-stat-card">
                    <div className="dash-stat-value" style={{ color: "var(--success)" }}>
                        {stats.phaseDistribution.ESTRO}
                    </div>
                    <div className="dash-stat-label">Em Estro agora</div>
                </div>
            </div>

            <div className="dashboard-grid">
                {/* Alerts */}
                <div className="dash-section">
                    <h2>🔔 Alertas Ativos</h2>
                    <div className="alerts-list">
                        {stats.alerts.map((a, i) => (
                            <Link href={`/app/pacientes/${a.patient.id}`} key={i} className="alert-item" data-type={a.type}>
                                <div className="alert-dot" style={{ background: a.type === 'success' ? 'var(--success)' : a.type === 'warning' ? 'var(--warning)' : 'var(--accent)' }} />
                                <div>
                                    <strong>{a.patient.name}</strong> — {a.patient.breed}
                                    <p>{a.message}</p>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>

                {/* Phase Distribution */}
                <div className="dash-section">
                    <h2>📊 Distribuição de Fases</h2>
                    <div className="phase-distribution">
                        {(Object.entries(stats.phaseDistribution) as [string, number][]).map(([phase, count]) => (
                            <div key={phase} className="phase-bar-item">
                                <div className="phase-bar-label">
                                    <span style={{ color: phaseColors[phase] }}>{phaseLabels[phase]}</span>
                                    <span>{count}</span>
                                </div>
                                <div className="phase-bar-track">
                                    <div
                                        className="phase-bar-fill"
                                        style={{
                                            width: `${(count / stats.totalPatients) * 100}%`,
                                            background: phaseColors[phase],
                                        }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Recent Exams */}
                <div className="dash-section full-width">
                    <h2>🔬 Últimos Exames</h2>
                    <div className="recent-exams-list">
                        {stats.recentExams.map((exam) => (
                            <div key={exam.id} className="exam-row">
                                <div className="exam-row-patient">{exam.patient_name}</div>
                                <div className={`phase-badge-sm phase-${exam.phase.toLowerCase()}`}>{phaseLabels[exam.phase]}</div>
                                <div className="exam-row-iq">IQ {exam.cornification_index.toFixed(0)}%</div>
                                <div className="exam-row-date">{new Date(exam.exam_date).toLocaleDateString("pt-BR")}</div>
                                <div className="exam-row-conf">{(exam.confidence * 100).toFixed(0)}% conf.</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="quick-actions">
                <Link href="/app/analise" className="btn-primary">🔬 Nova Análise</Link>
                <Link href="/app/pacientes" className="btn-secondary">🐾 Ver Pacientes</Link>
            </div>
        </div>
    );
}
