import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
    title: "CytoEstrus — AI-Powered Canine Vaginal Cytology",
    description: "Detecção automatizada de células em esfregaços vaginais caninos para diagnóstico da fase do ciclo estral. Computer Vision + LLM.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="pt-BR">
            <body>{children}</body>
        </html>
    );
}
