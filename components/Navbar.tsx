'use client';

import React from 'react';
import { ShieldCheck, Activity, Terminal, ExternalLink, Cpu } from 'lucide-react';

interface NavbarProps {
  activeTab: 'playground' | 'traces' | 'guardrails' | 'architecture';
  setActiveTab: (tab: 'playground' | 'traces' | 'guardrails' | 'architecture') => void;
}

export function Navbar({ activeTab, setActiveTab }: NavbarProps) {
  return (
    <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-cyan-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <ShieldCheck className="h-6 w-6 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-lg text-white tracking-tight">AgentGuard</span>
              <span className="px-2 py-0.5 text-[10px] font-semibold bg-indigo-950 text-indigo-400 border border-indigo-800 rounded-full uppercase tracking-wider">
                Enterprise Pod Orchestrator
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">
              Multi-Agent AI Governance • Context Grounding • OpenTelemetry Observability
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex items-center gap-1 bg-slate-900/90 p-1 rounded-lg border border-slate-800 text-xs sm:text-sm font-medium">
          <button
            onClick={() => setActiveTab('playground')}
            className={`px-3 py-1.5 rounded-md transition-colors flex items-center gap-1.5 ${
              activeTab === 'playground'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Terminal className="h-4 w-4" />
            <span>Workbench</span>
          </button>
          <button
            onClick={() => setActiveTab('traces')}
            className={`px-3 py-1.5 rounded-md transition-colors flex items-center gap-1.5 ${
              activeTab === 'traces'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Activity className="h-4 w-4" />
            <span>OTel Traces</span>
          </button>
          <button
            onClick={() => setActiveTab('guardrails')}
            className={`px-3 py-1.5 rounded-md transition-colors flex items-center gap-1.5 ${
              activeTab === 'guardrails'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <ShieldCheck className="h-4 w-4" />
            <span>Guardrails</span>
          </button>
          <button
            onClick={() => setActiveTab('architecture')}
            className={`px-3 py-1.5 rounded-md transition-colors flex items-center gap-1.5 ${
              activeTab === 'architecture'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Cpu className="h-4 w-4" />
            <span>Architecture</span>
          </button>
        </nav>

        {/* Status badges */}
        <div className="hidden md:flex items-center gap-3 text-xs">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-950/40 border border-emerald-800/40 text-emerald-400 font-mono">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>Agent Mesh: LIVE</span>
          </div>
          <a
            href="https://github.com/TejdeepKodati/agentguard-orchestrator"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-slate-400 hover:text-white transition-colors"
          >
            <span>GitHub</span>
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
        </div>
      </div>
    </header>
  );
}
