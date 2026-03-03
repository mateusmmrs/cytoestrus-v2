"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function NovoPacientePage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    // Form fields (controlled)
    const [name, setName] = useState("");
    const [breed, setBreed] = useState("");
    const [birthDate, setBirthDate] = useState("");
    const [weight, setWeight] = useState("");
    const [ownerName, setOwnerName] = useState("");
    const [notes, setNotes] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        // Simulate API call to save patient
        setTimeout(() => {
            router.push("/app/pacientes");
            router.refresh();
        }, 1200);
    };

    return (
        <div className="page-container">
            <div className="page-header">
                <div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                        <Link href="/app/pacientes" style={{ color: "var(--text-tertiary)", textDecoration: "none" }}>← Voltar</Link>
                    </div>
                    <h1>Cadastrar Paciente</h1>
                    <p>Adicione uma nova fêmea ao banco de dados reproductivo da clínica.</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} style={{
                background: "var(--bg-card)",
                padding: 32,
                borderRadius: 16,
                border: "1px solid var(--border)",
                maxWidth: 600,
                display: "flex",
                flexDirection: "column",
                gap: 24
            }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                    <div className="input-group">
                        <label>Nome do Animal *</label>
                        <input
                            type="text"
                            required
                            placeholder="Ex: Luna"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>
                    <div className="input-group">
                        <label>Raça</label>
                        <input
                            type="text"
                            placeholder="Ex: Golden Retriever"
                            value={breed}
                            onChange={(e) => setBreed(e.target.value)}
                        />
                    </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                    <div className="input-group">
                        <label>Data de Nascimento</label>
                        <input
                            type="date"
                            value={birthDate}
                            onChange={(e) => setBirthDate(e.target.value)}
                        />
                    </div>
                    <div className="input-group">
                        <label>Peso (kg)</label>
                        <input
                            type="number"
                            step="0.1"
                            placeholder="Ex: 25.5"
                            value={weight}
                            onChange={(e) => setWeight(e.target.value)}
                        />
                    </div>
                </div>

                <div className="input-group">
                    <label>Nome do Tutor *</label>
                    <input
                        type="text"
                        required
                        placeholder="Ex: João da Silva"
                        value={ownerName}
                        onChange={(e) => setOwnerName(e.target.value)}
                    />
                </div>

                <div className="input-group">
                    <label>Histórico Reprodutivo / Observações</label>
                    <textarea
                        rows={4}
                        placeholder="Primeiro cio? Histórico de pseudociese? Cruzamentos anteriores?"
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        style={{
                            width: "100%",
                            padding: "12px 16px",
                            borderRadius: 8,
                            border: "1px solid var(--border)",
                            background: "var(--bg-glass)",
                            color: "var(--text-primary)",
                            fontSize: 14,
                            fontFamily: "inherit",
                            resize: "vertical"
                        }}
                    />
                </div>

                <div style={{ display: "flex", justifyContent: "flex-end", gap: 12, marginTop: 16 }}>
                    <Link href="/app/pacientes" className="btn-secondary">
                        Cancelar
                    </Link>
                    <button type="submit" className="btn-primary" disabled={loading}>
                        {loading ? "Salvando..." : "Salvar Paciente"}
                    </button>
                </div>
            </form>
        </div>
    );
}
