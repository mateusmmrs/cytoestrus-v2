"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
    { href: "/app/dashboard", icon: "🏠", label: "Dashboard" },
    { href: "/app/pacientes", icon: "🐾", label: "Pacientes" },
    { href: "/app/analise", icon: "🔬", label: "Nova Análise" },
    { href: "/app/galeria", icon: "🖼️", label: "Galeria" },
    { href: "/app/config", icon: "⚙️", label: "Configurações" },
];

export default function Sidebar() {
    const pathname = usePathname();

    return (
        <aside className="sidebar">
            <div className="sidebar-logo">
                <Link href="/">🔬 <span>Cyto</span>Estrus</Link>
            </div>
            <nav className="sidebar-nav">
                {navItems.map((item) => (
                    <Link
                        key={item.href}
                        href={item.href}
                        className={`sidebar-link ${pathname === item.href ? "active" : ""}`}
                    >
                        <span className="sidebar-icon">{item.icon}</span>
                        {item.label}
                    </Link>
                ))}
            </nav>
            <div className="sidebar-footer">
                <div className="sidebar-clinic">
                    <div className="sidebar-clinic-avatar">CV</div>
                    <div>
                        <div style={{ fontWeight: 600, fontSize: 14 }}>Clínica Vet+</div>
                        <div style={{ fontSize: 12, color: "var(--text-tertiary)" }}>Demo</div>
                    </div>
                </div>
                <Link href="/login" className="sidebar-link" style={{ fontSize: 13 }}>
                    <span className="sidebar-icon">🚪</span>Sair
                </Link>
            </div>
        </aside>
    );
}
