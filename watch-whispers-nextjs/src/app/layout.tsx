import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Watch Whispers - Passeport Numérique de Montre de Luxe",
  description: "Engineering Invisible Luxury - Digital Product Passport for luxury watches with ERC-4337, NFC, and decentralized storage",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <head>
        <style>{`
          :root {
            --obsidian: #1a1a2e;
            --gold: #d4af37;
            --silver: #c0c0c0;
            --platinum: #e5e4e2;
            --luxury-black: #0a0a0a;
            --luxury-white: #f8f8f8;
            --success: #10b981;
            --error: #ef4444;
            --warning: #f59e0b;
          }
          
          * {
            box-sizing: border-box;
          }
          
          body {
            background: linear-gradient(135deg, var(--obsidian) 0%, var(--luxury-black) 100%);
            color: var(--luxury-white);
            font-family: var(--font-geist-sans);
            margin: 0;
            padding: 0;
            min-height: 100vh;
          }
          
          .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 0 20px;
          }
          
          h1 {
            font-size: 3rem;
            font-weight: 700;
            color: var(--gold);
            margin: 0;
            text-shadow: 0 2px 4px rgba(0,0,0,0.3);
          }
          
          h2 {
            font-size: 1.5rem;
            font-weight: 600;
            color: var(--luxury-white);
            margin: 0;
          }
          
          h3 {
            font-size: 1.25rem;
            font-weight: 600;
            color: var(--luxury-white);
            margin: 0;
          }
          
          h4 {
            font-size: 1rem;
            font-weight: 600;
            color: var(--luxury-white);
            margin: 0;
          }
          
          p {
            font-size: 0.875rem;
            color: var(--platinum);
            margin: 0;
            line-height: 1.5;
          }
          
          .card {
            background: rgba(26, 26, 46, 0.9);
            border: 1px solid var(--gold);
            border-radius: 16px;
            padding: 24px;
            backdrop-filter: blur(10px);
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
            transition: transform 0.3s ease, box-shadow 0.3s ease;
          }
          
          .card:hover {
            transform: translateY(-2px);
            box-shadow: 0 12px 40px rgba(212, 175, 55, 0.2);
          }
          
          .card-header {
            margin-bottom: 20px;
          }
          
          .card-title {
            margin-bottom: 8px;
          }
          
          .card-description {
            opacity: 0.8;
          }
          
          .card-content {
            display: flex;
            flex-direction: column;
            gap: 16px;
          }
          
          .btn {
            background: var(--gold);
            color: var(--obsidian);
            border: none;
            padding: 12px 24px;
            border-radius: 8px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
            display: inline-flex;
            align-items: center;
            gap: 8px;
            font-size: 0.875rem;
          }
          
          .btn:hover {
            background: var(--silver);
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(212, 175, 55, 0.3);
          }
          
          .btn:disabled {
            background: var(--platinum);
            opacity: 0.5;
            cursor: not-allowed;
            transform: none;
          }
          
          .btn-primary {
            background: var(--gold);
            color: var(--obsidian);
          }
          
          .btn-secondary {
            background: transparent;
            color: var(--gold);
            border: 1px solid var(--gold);
          }
          
          .btn-secondary:hover {
            background: var(--gold);
            color: var(--obsidian);
          }
          
          .btn-full {
            width: 100%;
            justify-content: center;
          }
          
          .nfc-icon {
            width: 64px;
            height: 64px;
            background: rgba(212, 175, 55, 0.1);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 auto 16px;
          }
          
          .scan-button {
            font-size: 1rem;
            padding: 16px;
          }
          
          .error-message {
            display: flex;
            align-items: center;
            gap: 8px;
            color: var(--error);
            padding: 12px;
            background: rgba(239, 68, 68, 0.1);
            border-radius: 8px;
            border: 1px solid var(--error);
          }
          
          .result-section {
            margin-top: 24px;
            padding-top: 24px;
            border-top: 1px solid rgba(212, 175, 55, 0.2);
          }
          
          .result-badge {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            padding: 8px 16px;
            border-radius: 20px;
            font-size: 0.75rem;
            font-weight: 600;
            margin-bottom: 16px;
          }
          
          .badge-success {
            background: rgba(16, 185, 129, 0.1);
            color: var(--success);
            border: 1px solid var(--success);
          }
          
          .result-details {
            display: flex;
            flex-direction: column;
            gap: 12px;
            margin-bottom: 20px;
          }
          
          .result-details p {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 8px 0;
            border-bottom: 1px solid rgba(212, 175, 55, 0.1);
          }
          
          .result-details strong {
            color: var(--gold);
          }
          
          .result-details span {
            font-family: var(--font-geist-mono);
            font-size: 0.75rem;
          }
          
          .action-buttons {
            display: flex;
            gap: 12px;
          }
          
          .action-buttons .btn {
            flex: 1;
          }
          
          .app-layout {
            display: grid;
            grid-template-columns: 1fr 400px;
            gap: 32px;
            align-items: start;
          }
          
          @media (max-width: 1024px) {
            .app-layout {
              grid-template-columns: 1fr;
              gap: 24px;
            }
          }
          
          .dashboard-grid {
            display: flex;
            flex-direction: column;
            gap: 24px;
          }
          
          .watch-list, .history-list {
            display: flex;
            flex-direction: column;
            gap: 16px;
          }
          
          .watch-item, .history-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 16px;
            background: rgba(212, 175, 55, 0.05);
            border-radius: 8px;
            border: 1px solid rgba(212, 175, 55, 0.1);
          }
          
          .history-item {
            align-items: start;
            gap: 16px;
          }
          
          .history-icon {
            width: 32px;
            height: 32px;
            background: rgba(212, 175, 55, 0.1);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-shrink: 0;
          }
          
          .watch-info, .history-info {
            flex: 1;
          }
          
          .watch-info h4, .history-info h4 {
            color: var(--gold);
            margin-bottom: 4px;
          }
          
          .watch-info p, .history-info p {
            font-size: 0.75rem;
            opacity: 0.8;
          }
          
          .watch-status {
            color: var(--gold);
          }
        `}</style>
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
