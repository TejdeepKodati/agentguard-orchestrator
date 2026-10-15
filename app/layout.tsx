import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'AgentGuard | Multi-Agent AI Governance & Guardrail Orchestrator',
  description:
    'Enterprise multi-agent governance platform providing safety guardrails, context grounding, prompt firewall, and OpenTelemetry observability.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-950 text-slate-100 antialiased selection:bg-indigo-500 selection:text-white">
        {children}

        {/* Mandatory Footer Badge */}
        <div className="fixed bottom-3 right-3 z-50">
          <a
            href="https://github.com/TejdeepKodati/agentguard-orchestrator"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 bg-slate-900/90 hover:bg-slate-800 border border-slate-700/80 rounded-full shadow-lg backdrop-blur-md transition-all hover:text-white hover:border-indigo-500/50 group"
          >
            <span>made with ♥ by Tejdeep</span>
            <span className="text-slate-500 group-hover:text-indigo-400 transition-colors">↗</span>
          </a>
        </div>
      </body>
    </html>
  );
}
