'use client';

import React from 'react';
import { Layers, ShieldCheck, Cpu, Terminal, GitBranch, Lock } from 'lucide-react';

export function ArchitectureView() {
  return (
    <div className="space-y-6">
      <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-6 shadow-xl">
        <h2 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
          <Cpu className="h-6 w-6 text-indigo-400" />
          <span>AgentGuard Enterprise Architecture & Pod Topology</span>
        </h2>
        <p className="text-sm text-slate-400 leading-relaxed max-w-3xl">
          Designed for mission-critical enterprise environments requiring end-to-end multi-agent orchestration,
          deterministic schema validation, multi-tier safety guardrails, and OpenTelemetry observability.
        </p>

        {/* 3 Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <div className="bg-slate-950/70 border border-slate-800 p-4 rounded-lg">
            <div className="h-9 w-9 rounded-lg bg-indigo-950 border border-indigo-800 flex items-center justify-center text-indigo-400 mb-3">
              <GitBranch className="h-5 w-5" />
            </div>
            <h3 className="font-semibold text-sm text-white mb-1">Multi-Agent Pod Topology</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Decoupled specialist agents operating on stateful DAG graphs: Intent Planner, Grounding Retriever,
              Structured Synthesizer, Safety Critic, and Audit Dispatcher.
            </p>
          </div>

          <div className="bg-slate-950/70 border border-slate-800 p-4 rounded-lg">
            <div className="h-9 w-9 rounded-lg bg-emerald-950 border border-emerald-800 flex items-center justify-center text-emerald-400 mb-3">
              <Lock className="h-5 w-5" />
            </div>
            <h3 className="font-semibold text-sm text-white mb-1">Defense-in-Depth Guardrails</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Pre-flight adversarial injection scanner, token entropy probes, in-flight PII cryptographic masking
              (emails, cards, credentials), and RAG hallucination scoring.
            </p>
          </div>

          <div className="bg-slate-950/70 border border-slate-800 p-4 rounded-lg">
            <div className="h-9 w-9 rounded-lg bg-cyan-950 border border-cyan-800 flex items-center justify-center text-cyan-400 mb-3">
              <Layers className="h-5 w-5" />
            </div>
            <h3 className="font-semibold text-sm text-white mb-1">OpenTelemetry & AgentOps</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              W3C traceparent propagation across agent spans, granular latency waterfalls, prompt/completion token
              budgeting, and cost tracking.
            </p>
          </div>
        </div>
      </div>

      {/* Pipeline Flow Diagram */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-6 shadow-xl">
        <h3 className="text-base font-semibold text-white mb-4 flex items-center gap-2">
          <Terminal className="h-5 w-5 text-indigo-400" />
          <span>Execution Flow & Governance Gates</span>
        </h3>

        <div className="space-y-4 text-xs font-mono">
          <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 text-slate-300">
            <div className="text-indigo-400 font-bold mb-1">1. Pre-Flight Security Gate</div>
            <p className="text-slate-400">
              User query passes through adversarial injection regex scanner & base64 obfuscation detector.
              If threshold &gt; 0.40, execution is halted with an immediate quarantine code and governance alert.
            </p>
          </div>

          <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 text-slate-300">
            <div className="text-blue-400 font-bold mb-1">2. Semantic Decomposition & Intent Routing</div>
            <p className="text-slate-400">
              Planner Agent deconstructs requirements into sub-tasks, classifying intent (Engineering, Security,
              Compliance) and determining necessary retrieval parameters.
            </p>
          </div>

          <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 text-slate-300">
            <div className="text-cyan-400 font-bold mb-1">3. Hybrid Context Retrieval & Grounding</div>
            <p className="text-slate-400">
              Knowledge base chunks are extracted and scored. Context window is pruned to remove irrelevant tokens and
              prevent prompt stuffing latency.
            </p>
          </div>

          <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 text-slate-300">
            <div className="text-purple-400 font-bold mb-1">4. Schema-Constrained Generation</div>
            <p className="text-slate-400">
              Synthesizer Agent produces candidate responses adhering to strict Pydantic/Zod schema structures,
              enforcing predictable typed outputs.
            </p>
          </div>

          <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 text-slate-300">
            <div className="text-amber-400 font-bold mb-1">5. Post-Generation Critic & Redaction</div>
            <p className="text-slate-400">
              Evaluates response against PII signatures (redacting secrets, cards, emails) and computes Faithfulness
              overlap against source grounding context to detect hallucination drift.
            </p>
          </div>

          <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 text-slate-300">
            <div className="text-emerald-400 font-bold mb-1">6. Audit Ledger & Telemetry Dispatch</div>
            <p className="text-slate-400">
              Emits OpenTelemetry spans to collector with latency, token usage, and financial cost attribution,
              saving immutable audit logs.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
