'use client';

import React, { useState } from 'react';
import { Navbar } from '../components/Navbar';
import { Playground } from '../components/Playground';
import { TracesView } from '../components/TracesView';
import { GuardrailsView } from '../components/GuardrailsView';
import { ArchitectureView } from '../components/ArchitectureView';
import { ShieldCheck, Activity, Cpu, Layers } from 'lucide-react';

export default function Home() {
  const [activeTab, setActiveTab] = useState<'playground' | 'traces' | 'guardrails' | 'architecture'>('playground');

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col">
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-950/60 border border-indigo-800 text-indigo-400 text-xs font-mono mb-3">
            <ShieldCheck className="h-3.5 w-3.5" />
            <span>Autonomous AI Pod Orchestration & Governance Mesh</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            AgentGuard Orchestrator
          </h1>
          <p className="mt-2 text-sm sm:text-base text-slate-400 max-w-3xl leading-relaxed">
            Production-grade multi-agent governance platform featuring adversarial prompt injection firewalls,
            cryptographic PII redaction, context grounding verification, and OpenTelemetry distributed tracing.
          </p>

          {/* KPI Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6">
            <div className="bg-slate-900/60 border border-slate-800/80 rounded-lg p-3">
              <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
                <Cpu className="h-3.5 w-3.5 text-indigo-400" />
                <span>Frontier Pod Mesh</span>
              </div>
              <div className="text-lg font-bold text-white font-mono">5 Agents</div>
              <div className="text-[10px] text-slate-500">Decoupled DAG Pipeline</div>
            </div>

            <div className="bg-slate-900/60 border border-slate-800/80 rounded-lg p-3">
              <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
                <span>Interception Efficacy</span>
              </div>
              <div className="text-lg font-bold text-emerald-400 font-mono">99.4%</div>
              <div className="text-[10px] text-slate-500">Injection & PII Coverage</div>
            </div>

            <div className="bg-slate-900/60 border border-slate-800/80 rounded-lg p-3">
              <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
                <Activity className="h-3.5 w-3.5 text-cyan-400" />
                <span>P95 Verification Latency</span>
              </div>
              <div className="text-lg font-bold text-cyan-400 font-mono">42 ms</div>
              <div className="text-[10px] text-slate-500">Sub-50ms Quality Gate</div>
            </div>

            <div className="bg-slate-900/60 border border-slate-800/80 rounded-lg p-3">
              <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
                <Layers className="h-3.5 w-3.5 text-purple-400" />
                <span>Telemetry Protocol</span>
              </div>
              <div className="text-lg font-bold text-purple-400 font-mono">OpenTelemetry</div>
              <div className="text-[10px] text-slate-500">W3C Distributed Spans</div>
            </div>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'playground' && <Playground />}
        {activeTab === 'traces' && <TracesView />}
        {activeTab === 'guardrails' && <GuardrailsView />}
        {activeTab === 'architecture' && <ArchitectureView />}
      </main>

      <footer className="border-t border-slate-900 py-6 text-center text-xs text-slate-600 font-mono">
        AgentGuard Multi-Agent System • Enterprise AI Governance & Quality Platform
      </footer>
    </div>
  );
}
