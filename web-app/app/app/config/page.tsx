"use client";

export default function ConfigPage() {
    return (
        <div className="page-container">
            <div className="page-header">
                <h1>Configurações</h1>
                <p>Preferências da clínica</p>
            </div>

            <div className="reasoning-card">
                <h3>🏥 Dados da Clínica</h3>
                <div className="config-form">
                    <div className="input-group">
                        <label>Nome da Clínica</label>
                        <input type="text" defaultValue="Clínica Vet+" />
                    </div>
                    <div className="input-group">
                        <label>CRMV</label>
                        <input type="text" defaultValue="BA-12345" />
                    </div>
                    <div className="input-group">
                        <label>Email</label>
                        <input type="email" defaultValue="clinica@vetmais.com.br" />
                    </div>
                </div>
            </div>

            <div className="reasoning-card" style={{ marginTop: 16 }}>
                <h3>🔗 Integração Supabase</h3>
                <div className="config-form">
                    <div className="input-group">
                        <label>Supabase URL</label>
                        <input type="text" placeholder="https://seu-projeto.supabase.co" />
                    </div>
                    <div className="input-group">
                        <label>Anon Key</label>
                        <input type="password" placeholder="eyJ..." />
                    </div>
                </div>
                <p style={{ fontSize: 13, color: "var(--text-tertiary)", marginTop: 12 }}>
                    Conecte ao Supabase para persistir dados. Sem conexão, o app funciona com dados de demonstração.
                </p>
            </div>

            <div className="reasoning-card" style={{ marginTop: 16 }}>
                <h3>🤖 API de Interpretação</h3>
                <div className="config-form">
                    <div className="input-group">
                        <label>Provider</label>
                        <select className="select-input">
                            <option>Gemini Pro (recomendado)</option>
                            <option>Claude 3.5 Sonnet</option>
                            <option>Offline (rule-based)</option>
                        </select>
                    </div>
                    <div className="input-group">
                        <label>API Key</label>
                        <input type="password" placeholder="sua-api-key" />
                    </div>
                </div>
            </div>
        </div>
    );
}
