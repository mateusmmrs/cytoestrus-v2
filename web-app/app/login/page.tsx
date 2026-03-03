"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        // Demo: skip auth and go to app
        setTimeout(() => {
            router.push("/app/dashboard");
        }, 800);
    };

    const handleDemo = () => {
        setLoading(true);
        setTimeout(() => router.push("/app/dashboard"), 500);
    };

    return (
        <div className="login-page">
            <div className="login-card">
                <div className="login-logo">🔬 <span>Cyto</span>Estrus</div>
                <p className="login-subtitle">Plataforma de Citologia Vaginal Canina</p>

                <form onSubmit={handleLogin} className="login-form">
                    <div className="input-group">
                        <label>Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="clinica@email.com"
                        />
                    </div>
                    <div className="input-group">
                        <label>Senha</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                        />
                    </div>
                    <button type="submit" className="btn-primary" style={{ width: "100%", justifyContent: "center" }} disabled={loading}>
                        {loading ? "Entrando..." : "Entrar"}
                    </button>
                </form>

                <div className="login-divider">
                    <span>ou</span>
                </div>

                <button className="btn-secondary" style={{ width: "100%", justifyContent: "center" }} onClick={handleDemo}>
                    🎮 Acessar Demo
                </button>

                <p className="login-footer-text">
                    Não tem conta? <a href="#">Solicitar acesso</a>
                </p>
            </div>
        </div>
    );
}
