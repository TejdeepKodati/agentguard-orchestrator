'use client';

import React from 'react';
import { ShieldCheck, Flame, Lock, AlertOctagon, CheckSquare, Sparkles } from 'lucide-react';

export function GuardrailsView() {
  const guardrailRules = [
    {
      id: 'RULE-INJECT-01',
      name: 'Adversarial Prompt Injection & Jailbreak Firewall',
      category: 'Input Validation',
      riskLevel: 'CRITICAL',
      icon: Flame,
      color: 'text-rose-400',
      description:
        'Intercepts system prompt override attempts, DAN-mode roleplay attacks, delimiter abuse, and Base64-obfuscated executable payloads before prompt dispatch.',
      mitigation: 'Immediate pipeline termination, incident quarantine, and governance alert dispatch.',
    },
    {
      id: 'RULE-PII-02',
      name: 'Sensitive Data (PII & Secrets) Masking Gate',
      category: 'Data Privacy',
      riskLevel: 'HIGH',
      icon: Lock,
      color: 'text-amber-400',
      description:
        'Scans raw outputs for payment card numbers (Luhn validated), Social Security Numbers, corporate email addresses, phone numbers, and bearer credentials (JWT, OpenAI, AWS AKIA keys).',
      mitigation: 'Cryptographic token replacement with auditable redaction markers ([REDACTED_API_KEY], etc.).',
    },
    {
      id: 'RULE-TOXIC-03',
      name: 'Harmful Intent & Policy Enforcement',
      category: 'Safety & Compliance',
      riskLevel: 'HIGH',
      icon: AlertOctagon,
      color: 'text-red-400',
      description:
        'Detects requests attempting to generate exploit payloads, phishing templates, DDoS instructions, or unauthorized infrastructure reconnaissance.',
      mitigation: 'Policy violation flag, payload blocking, and compliance logging.',
    },
    {
      id: 'RULE-GROUND-04',
      name: 'Context Grounding & Hallucination Auditor',
      category: 'Output Quality',
      riskLevel: 'MEDIUM',
      icon: Sparkles,
      color: 'text-indigo-400',
      description:
        'Calculates lexical and semantic entity overlap between generated assertions and verified reference context chunks, measuring faithfulness index from 0.0 to 1.0.',
      mitigation: 'Generates confidence warnings, alerts operator of unverified claims, and suggests citation anchors.',
    },
    {
      id: 'RULE-SCHEMA-05',
      name: 'Deterministic Schema & JSON Structural Validator',
      category: 'Interface Integrity',
      riskLevel: 'MEDIUM',
      icon: CheckSquare,
      color: 'text-emerald-400',
      description:
        'Enforces typed JSON interfaces via Pydantic and Zod validation, preventing malformed responses from breaking downstream microservice consumers.',
      mitigation: 'Automated retry with error reflection prompt if JSON fails schema validation.',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-6 shadow-xl">
        <h2 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
          <ShieldCheck className="h-6 w-6 text-indigo-400" />
          <span>Active Guardrail Rules Catalog</span>
        </h2>
        <p className="text-sm text-slate-400 max-w-3xl leading-relaxed">
          Comprehensive enterprise defense system combining pre-flight input sanitization, in-flight schema contracts,
          and post-generation compliance checks to ensure Responsible and Auditable AI operations.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {guardrailRules.map((rule) => (
          <div
            key={rule.id}
            className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 shadow-lg flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2.5">
                  <div className="h-8 w-8 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-center">
                    <rule.icon className={`h-4 w-4 ${rule.color}`} />
                  </div>
                  <div>
                    <span className="text-xs font-mono text-slate-500">{rule.id}</span>
                    <h3 className="text-sm font-semibold text-slate-200">{rule.name}</h3>
                  </div>
                </div>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase tracking-wider ${
                    rule.riskLevel === 'CRITICAL'
                      ? 'bg-rose-950/60 text-rose-400 border-rose-800'
                      : rule.riskLevel === 'HIGH'
                      ? 'bg-amber-950/60 text-amber-400 border-amber-800'
                      : 'bg-indigo-950/60 text-indigo-400 border-indigo-800'
                  }`}
                >
                  {rule.riskLevel}
                </span>
              </div>

              <p className="text-xs text-slate-400 leading-relaxed mb-3">{rule.description}</p>
            </div>

            <div className="pt-3 border-t border-slate-800/80 bg-slate-950/40 p-2.5 rounded text-[11px] font-mono text-slate-300">
              <strong className="text-indigo-400">Enforcement Action:</strong> {rule.mitigation}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
