'use client';

import React from 'react';
import { MultiAgentExecutionResult, ReasoningStep } from '../lib/types';
import {
  Compass,
  Database,
  Code2,
  ShieldAlert,
  FileCheck2,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Clock,
} from 'lucide-react';

interface AgentDagGraphProps {
  execution: MultiAgentExecutionResult | null;
  isLoading: boolean;
}

export function AgentDagGraph({ execution, isLoading }: AgentDagGraphProps) {
  const steps: ReasoningStep[] = execution?.reasoningSteps || [];

  const agentNodes = [
    {
      id: 'triage_planner',
      title: 'Triage & Intent Planner',
      subtitle: 'Semantic task deconstruction & intent classification',
      icon: Compass,
      color: 'from-blue-500 to-indigo-600',
    },
    {
      id: 'context_retriever',
      title: 'Context Grounding Engine',
      subtitle: 'Hybrid dense/sparse vector retrieval & pruning',
      icon: Database,
      color: 'from-cyan-500 to-teal-600',
    },
    {
      id: 'structured_synthesizer',
      title: 'Structured Synthesizer',
      subtitle: 'Schema-constrained LLM generation',
      icon: Code2,
      color: 'from-purple-500 to-pink-600',
    },
    {
      id: 'guardrail_critic',
      title: 'Guardrail Critic Gate',
      subtitle: 'Injection scanner, PII redactor & hallucination audit',
      icon: ShieldAlert,
      color: 'from-amber-500 to-orange-600',
    },
    {
      id: 'governance_audit',
      title: 'Governance & OTel Logger',
      subtitle: 'Immutable trace ledger & compliance dispatch',
      icon: FileCheck2,
      color: 'from-emerald-500 to-green-600',
    },
  ];

  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 shadow-xl">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-base font-semibold text-white flex items-center gap-2">
            <span>Multi-Agent Pod Execution Mesh</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-mono">
              DAG Flow
            </span>
          </h3>
          <p className="text-xs text-slate-400">
            Real-time inter-pod handoffs, intent dispatch, and safety verification stages.
          </p>
        </div>
        {execution && (
          <div className="flex items-center gap-2 text-xs font-mono">
            <span className="text-slate-400">Total Duration:</span>
            <span className="text-indigo-400 font-semibold">{execution.telemetry.totalDurationMs} ms</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-3 relative">
        {agentNodes.map((node, index) => {
          const stepData = steps.find((s) => s.agentRole === node.id);
          const hasRun = Boolean(stepData);
          const status = stepData?.status || (isLoading ? 'in_progress' : 'pending');

          return (
            <div
              key={node.id}
              className={`relative rounded-lg p-3.5 border transition-all duration-300 flex flex-col justify-between ${
                status === 'completed'
                  ? 'bg-slate-900 border-indigo-500/40 shadow-sm shadow-indigo-500/10'
                  : status === 'blocked'
                  ? 'bg-rose-950/20 border-rose-500/60'
                  : status === 'flagged'
                  ? 'bg-amber-950/20 border-amber-500/50'
                  : isLoading && index === steps.length
                  ? 'bg-slate-900 border-indigo-400 animate-pulse'
                  : 'bg-slate-950/40 border-slate-800/80 opacity-60'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div
                    className={`h-8 w-8 rounded-lg bg-gradient-to-tr ${node.color} flex items-center justify-center text-white shadow-md`}
                  >
                    <node.icon className="h-4 w-4" />
                  </div>
                  <div>
                    {status === 'completed' && (
                      <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                    )}
                    {status === 'blocked' && (
                      <XCircle className="h-4 w-4 text-rose-400" />
                    )}
                    {status === 'flagged' && (
                      <AlertTriangle className="h-4 w-4 text-amber-400" />
                    )}
                    {status === 'pending' && (
                      <Clock className="h-4 w-4 text-slate-500" />
                    )}
                  </div>
                </div>

                <div className="text-xs font-bold text-slate-200 leading-tight">
                  {node.title}
                </div>
                <div className="text-[11px] text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                  {node.subtitle}
                </div>
              </div>

              <div className="mt-3 pt-2 border-t border-slate-800/60 flex items-center justify-between text-[10px] font-mono">
                <span
                  className={`font-semibold uppercase tracking-wider ${
                    status === 'completed'
                      ? 'text-emerald-400'
                      : status === 'blocked'
                      ? 'text-rose-400'
                      : status === 'flagged'
                      ? 'text-amber-400'
                      : 'text-slate-500'
                  }`}
                >
                  {status}
                </span>
                {stepData && (
                  <span className="text-slate-400">{stepData.durationMs}ms</span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Step Reasoner Detail Log */}
      {steps.length > 0 && (
        <div className="mt-4 p-3 bg-slate-950 rounded-lg border border-slate-800 text-xs font-mono space-y-2 max-h-48 overflow-y-auto">
          <div className="text-[11px] font-bold text-indigo-400 tracking-wider uppercase mb-1">
            Agent Reasoning & Action Trace
          </div>
          {steps.map((s, idx) => (
            <div key={idx} className="flex items-start gap-2 text-slate-300">
              <span className="text-indigo-400 select-none">[{idx + 1}]</span>
              <span className="font-semibold text-slate-200">[{s.agentName}]:</span>
              <span className="text-slate-400">{s.thought}</span>
              <span className="text-indigo-300/80 bg-indigo-950/60 px-1.5 py-0.5 rounded text-[10px]">
                {s.action}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
