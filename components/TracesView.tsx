'use client';

import React from 'react';
import { Activity, Download, CheckCircle, Database } from 'lucide-react';

export function TracesView() {
  const sampleTraces = [
    {
      traceId: 'trace-8a9d102e',
      timestamp: '2026-10-15T18:30:12Z',
      operation: 'executeMultiAgentPipeline',
      status: 'APPROVED',
      spansCount: 5,
      durationMs: 382,
      totalTokens: 240,
      costUsd: 0.0028,
    },
    {
      traceId: 'trace-4f7b991a',
      timestamp: '2026-10-15T18:24:45Z',
      operation: 'executeMultiAgentPipeline',
      status: 'SANITIZED',
      spansCount: 5,
      durationMs: 410,
      totalTokens: 312,
      costUsd: 0.0036,
    },
    {
      traceId: 'trace-e13a44d0',
      timestamp: '2026-10-15T18:19:02Z',
      operation: 'executeMultiAgentPipeline',
      status: 'BLOCKED',
      spansCount: 2,
      durationMs: 38,
      totalTokens: 45,
      costUsd: 0.0001,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-6 shadow-xl">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-3">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Activity className="h-6 w-6 text-indigo-400" />
              <span>OpenTelemetry & AgentOps Telemetry Ledger</span>
            </h2>
            <p className="text-sm text-slate-400">
              Distributed traces recorded across frontier pod agent nodes with microsecond precision.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                const blob = new Blob([JSON.stringify(sampleTraces, null, 2)], {
                  type: 'application/json',
                });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'agentguard-otel-traces.json';
                a.click();
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium transition-colors shadow-sm"
            >
              <Download className="h-3.5 w-3.5" />
              <span>Export Traces (JSON)</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4 text-xs font-mono">
          <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 flex items-center justify-between">
            <span className="text-slate-400">OTel Exporter:</span>
            <span className="text-emerald-400 font-bold flex items-center gap-1">
              <CheckCircle className="h-3.5 w-3.5" /> OTLP / gRPC
            </span>
          </div>
          <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 flex items-center justify-between">
            <span className="text-slate-400">Sampling Rate:</span>
            <span className="text-indigo-400 font-bold">100% Adaptive</span>
          </div>
          <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 flex items-center justify-between">
            <span className="text-slate-400">Context Carrier:</span>
            <span className="text-cyan-400 font-bold">W3C TraceContext</span>
          </div>
        </div>
      </div>

      {/* Trace History Table */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-white flex items-center gap-2">
            <Database className="h-4 w-4 text-indigo-400" />
            <span>Trace History Buffer</span>
          </h3>
          <span className="text-xs text-slate-500 font-mono">Showing recent telemetry spans</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-slate-950/80 text-slate-400 border-b border-slate-800">
              <tr>
                <th className="p-3 font-medium">Trace ID</th>
                <th className="p-3 font-medium">Operation</th>
                <th className="p-3 font-medium">Decision</th>
                <th className="p-3 font-medium">Latency</th>
                <th className="p-3 font-medium">Tokens</th>
                <th className="p-3 font-medium">Est. Cost</th>
                <th className="p-3 font-medium">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {sampleTraces.map((trace) => (
                <tr key={trace.traceId} className="hover:bg-slate-850/50 transition-colors">
                  <td className="p-3 text-indigo-400 font-bold">{trace.traceId}</td>
                  <td className="p-3">{trace.operation}</td>
                  <td className="p-3">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        trace.status === 'APPROVED'
                          ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                          : trace.status === 'SANITIZED'
                          ? 'bg-amber-950 text-amber-400 border border-amber-800'
                          : 'bg-rose-950 text-rose-400 border border-rose-800'
                      }`}
                    >
                      {trace.status}
                    </span>
                  </td>
                  <td className="p-3 text-slate-400">{trace.durationMs}ms</td>
                  <td className="p-3 text-slate-400">{trace.totalTokens}</td>
                  <td className="p-3 text-emerald-400">${trace.costUsd.toFixed(4)}</td>
                  <td className="p-3 text-slate-500">{trace.timestamp}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
