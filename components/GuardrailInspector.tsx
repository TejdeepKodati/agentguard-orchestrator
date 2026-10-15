'use client';

import React from 'react';
import { GuardrailCheckResult } from '../lib/types';
import { ShieldAlert, CheckCircle2, AlertTriangle, XCircle, Eye, EyeOff } from 'lucide-react';

interface GuardrailInspectorProps {
  checks: GuardrailCheckResult[];
  rawResponse?: string;
  finalResponse?: string;
  status?: 'approved' | 'sanitized' | 'blocked';
}

export function GuardrailInspector({
  checks,
  rawResponse,
  finalResponse,
  status,
}: GuardrailInspectorProps) {
  const [showRaw, setShowRaw] = React.useState(false);

  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 shadow-xl">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-base font-semibold text-white flex items-center gap-2">
            <ShieldAlert className="h-5 w-5 text-indigo-400" />
            <span>AI Quality Gates & Guardrail Verifications</span>
          </h3>
          <p className="text-xs text-slate-400">
            Real-time evaluation against adversarial injection, sensitive PII, safety policies, and hallucination drift.
          </p>
        </div>

        {status && (
          <span
            className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${
              status === 'approved'
                ? 'bg-emerald-950/60 text-emerald-400 border-emerald-700/50'
                : status === 'sanitized'
                ? 'bg-amber-950/60 text-amber-400 border-amber-700/50'
                : 'bg-rose-950/60 text-rose-400 border-rose-700/50'
            }`}
          >
            Policy Decision: {status}
          </span>
        )}
      </div>

      {/* Grid of checks */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-5">
        {checks.map((check) => (
          <div
            key={check.ruleId}
            className={`p-3.5 rounded-lg border transition-all ${
              check.status === 'passed'
                ? 'bg-slate-950/40 border-slate-800/80'
                : check.status === 'warning'
                ? 'bg-amber-950/20 border-amber-500/40'
                : 'bg-rose-950/20 border-rose-500/50'
            }`}
          >
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono text-slate-400">{check.ruleId}</span>
                  <span className="text-xs font-semibold text-slate-200">{check.ruleName}</span>
                </div>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">{check.details}</p>
              </div>
              <div>
                {check.status === 'passed' && (
                  <CheckCircle2 className="h-4 w-4 text-emerald-400 flex-shrink-0" />
                )}
                {check.status === 'warning' && (
                  <AlertTriangle className="h-4 w-4 text-amber-400 flex-shrink-0" />
                )}
                {check.status === 'violated' && (
                  <XCircle className="h-4 w-4 text-rose-400 flex-shrink-0" />
                )}
              </div>
            </div>

            <div className="mt-3 pt-2 border-t border-slate-800/60 flex items-center justify-between text-[11px] font-mono">
              <span className="text-slate-400">
                Confidence: <strong className="text-indigo-400">{(check.confidence * 100).toFixed(0)}%</strong>
              </span>
              <span className="text-slate-400">Scan latency: {check.latencyMs}ms</span>
            </div>
          </div>
        ))}
      </div>

      {/* Output Comparison (Raw vs Sanitized) */}
      {(rawResponse || finalResponse) && (
        <div className="border border-slate-800 rounded-lg p-4 bg-slate-950">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-300">
              Verified Pipeline Output & Sanitization Audit
            </span>
            {rawResponse && rawResponse !== finalResponse && (
              <button
                onClick={() => setShowRaw(!showRaw)}
                className="flex items-center gap-1 text-xs text-indigo-400 hover:text-indigo-300 transition-colors"
              >
                {showRaw ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                <span>{showRaw ? 'Show Sanitized Output' : 'Compare with Unsanitized'}</span>
              </button>
            )}
          </div>

          <div className="text-xs font-mono p-3 bg-slate-900 rounded border border-slate-800 text-slate-200 whitespace-pre-wrap leading-relaxed">
            {showRaw ? rawResponse : finalResponse}
          </div>
        </div>
      )}
    </div>
  );
}
