"use client";
import Link from "next/link";
import { useState } from "react";

export default function Home() {
    return (
        <div style={{ background: "var(--bg-primary)", minHeight: "100vh" }}>
            {/* NAV */}
            <nav className="nav">
                <div className="nav-logo" style={{ cursor: "pointer" }}>
                    🔬 <span>Cyto</span>Estrus
                </div>
                <div className="nav-links">
                    <a href="#features">Como funciona</a>
                    <a href="#architecture">Arquitetura</a>
                    <Link href="/login" style={{ marginLeft: 16, padding: "8px 16px", background: "var(--bg-glass)", borderRadius: 8, color: "var(--text-primary)", fontWeight: 500, border: "1px solid var(--border)" }}>
                        Login Clínica
                    </Link>
                </div>
            </nav>

            {/* HERO */}
            <section className="hero">
                <div className="hero-badge">🧬 Visão Computacional + IA Generativa</div>
                <h1>
                    Citologia vaginal
                    <br />
                    <span className="gradient">automatizada.</span>
                </h1>
                <p>
                    A primeira plataforma para clínicas veterinárias e criadores profissionais.
                    Upload de citologias, contagem celular automatizada (YOLOv8) e perfil reprodutivo guiado por Inteligência Artificial.
                </p>
                <div className="hero-cta">
                    <Link href="/login" className="btn-primary">
                        Acessar a Plataforma →
                    </Link>
                    <a href="#features" className="btn-secondary">
                        Como funciona
                    </a>
                </div>
            </section>

            {/* FEATURES */}
            <section className="section" id="features">
                <div className="section-label">Recursos para Clínicas</div>
                <h2 className="section-title">Muito além de<br />uma análise.</h2>
                <p className="section-subtitle">
                    Cyto Estrus MVP agora é uma plataforma completa de gestão reprodutiva canina, vinculando citologias a pacientes.
                </p>
                <div className="features-grid">
                    <div className="feature-card">
                        <div className="feature-icon">🐾</div>
                        <h3>Banco de Pacientes</h3>
                        <p>Gerencie o histórico reprodutivo de fêmeas, idade, histórico e cruzamentos em um só lugar. Acesso seguro para sua clínica.</p>
                    </div>
                    <div className="feature-card">
                        <div className="feature-icon">🔍</div>
                        <h3>Detecção YOLOv8</h3>
                        <p>Nossa rede neural classifica 6 tipos celulares em tempo real (parabasais, intermediárias, superficiais, anucleares, neutrófilos, hemácias) a partir de uma foto de microscópio.</p>
                    </div>
                    <div className="feature-card">
                        <div className="feature-icon">📈</div>
                        <h3>Perfil Reprodutivo</h3>
                        <p>O aplicativo plota o Índice de Queratinização (IQ) ao longo do tempo. Descubra automaticamente o pico fértil e acompanhe a transição para o diestro.</p>
                    </div>
                    <div className="feature-card">
                        <div className="feature-icon">🧠</div>
                        <h3>Raciocínio Clínico IA</h3>
                        <p>O LLM não apenas define a fase, mas também provê raciocínio fisiológico explicável e conselhos de fertilidade/inseminação. Custo: R$0,01 por análise.</p>
                    </div>
                    <div className="feature-card">
                        <div className="feature-icon">🖼️</div>
                        <h3>Galeria de Lâminas</h3>
                        <p>Acesse todas as citologias arquivadas na nuvem, com filtros rápidos por paciente ou por fase do ciclo. Compare lâminas de dias consecutivos.</p>
                    </div>
                    <div className="feature-card">
                        <div className="feature-icon">📊</div>
                        <h3>Dashboard Analítico</h3>
                        <p>Uma visão geral diária da sua clínica. Alertas ativos para IA, distribuição de fases em tempo real e últimos exames realizados hoje.</p>
                    </div>
                </div>
            </section>

            {/* ARCHITECTURE */}
            <section className="section" id="architecture">
                <div className="section-label">Pipeline Computacional</div>
                <h2 className="section-title">Análise de<br />dois estágios.</h2>
                <p className="section-subtitle">
                    Sistemática híbrida: a precisão óptica do YOLOv8 e o entendimento contextual avançado da IA generativa (Gemini Edge).
                </p>
                <div className="arch-flow">
                    <div className="arch-node">
                        <h4>📸 Upload Seguro</h4>
                        <p>Lâmina associada à fêmea</p>
                    </div>
                    <span className="arch-arrow">→</span>
                    <div className="arch-node">
                        <h4>🧬 YOLOv8 Edge</h4>
                        <p>Matrix celular extraída</p>
                    </div>
                    <span className="arch-arrow">→</span>
                    <div className="arch-node">
                        <h4>📋 LLM Prompt</h4>
                        <p>Contagens + IQ% processados</p>
                    </div>
                    <span className="arch-arrow">→</span>
                    <div className="arch-node">
                        <h4>🏥 Diagnóstico</h4>
                        <p>Painel clínico atualizado</p>
                    </div>
                </div>
            </section>

            {/* CTA FOOTER */}
            <section className="demo-section" style={{ textAlign: "center", padding: "80px 24px" }}>
                <h2 className="section-title" style={{ marginBottom: 24 }}>Inicie sua análise agora.</h2>
                <p style={{ color: "var(--text-secondary)", marginBottom: 40, maxWidth: 500, margin: "0 auto 40px auto" }}>Experimente gratuitamente o fluxo da área clínica utilizando a demo da nossa plataforma.</p>
                <Link href="/login" className="btn-primary" style={{ padding: "16px 32px", fontSize: 16 }}>
                    Acessar Plataforma MVP
                </Link>
            </section>

            <footer className="footer">
                <p>CytoEstrus v2 MVP · Mateus Martins · Médico Veterinário · Plataforma B2B</p>
            </footer>
        </div>
    );
}
