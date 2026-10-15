'use client';

import React from 'react';
import { AgentSpan } from '../lib/types';
import { Activity, Coins, Clock, Hash, Layers } from 'lucide-react';

interface TelemetryWaterfallProps {
  telemetry?: {
    traceId: string;
    totalDurationMs: number;
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
    estimatedCostUsd: number;
    spans: AgentSpan[];
  };
}

export function TelemetryWaterfall({ telemetry }: TelemetryWaterfallProps) {
  if (!telemetry || !telemetry.spans || telemetry.spans.length === 0) {
    return (
      <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-8 text-center text-slate-400">
        <Activity className="h-8 w-8 mx-auto mb-2 text-slate-600" />
        <p className="text-sm">No telemetry traces recorded yet. Execute a pipeline task to view OpenTelemetry spans.</p>
      </div>
    );
  }

  const maxDuration = Math.max(...telemetry.spans.map((s) => s.endTime - (telemetry.spans[0]?.startTime || 0)), 1);
  const baseTime = telemetry.spans[0]?.startTime || 0;

  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 shadow-xl space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-semibold text-white flex items-center gap-2">
            <Activity className="h-5 w-5 text-indigo-400" />
            <span>OpenTelemetry Distributed Trace Waterfall</span>
          </h3>
          <p className="text-xs text-slate-400">
            End-to-end multi-agent span lifecycle, latency breakdown, and token attribution.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-slate-400">Trace ID:</span>
          <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-indigo-400 font-semibold select-all">
            {telemetry.traceId}
          </span>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-slate-950/60 border border-slate-800 rounded-lg p-3">
          <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
            <Clock className="h-3.5 w-3.5 text-indigo-400" />
            <span>Latency (Total)</span>
          </div>
          <div className="text-lg font-bold text-white font-mono">{telemetry.totalDurationMs} ms</div>
        </div>

        <div className="bg-slate-950/60 border border-slate-800 rounded-lg p-3">
          <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
            <Hash className="h-3.5 w-3.5 text-cyan-400" />
            <span>Tokens (Prompt/Comp)</span>
          </div>
          <div className="text-lg font-bold text-white font-mono">
            {telemetry.promptTokens} / {telemetry.completionTokens}
          </div>
        </div>

        <div className="bg-slate-950/60 border border-slate-800 rounded-lg p-3">
          <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
            <Coins className="h-3.5 w-3.5 text-amber-400" />
            <span>Est. Invoc. Cost</span>
          </div>
          <div className="text-lg font-bold text-emerald-400 font-mono">
            ${telemetry.estimatedCostUsd.toFixed(5)}
          </div>
        </div>

        <div className="bg-slate-950/60 border border-slate-800 rounded-lg p-3">
          <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
            <Layers className="h-3.5 w-3.5 text-purple-400" />
            <span>Active Spans</span>
          </div>
          <div className="text-lg font-bold text-purple-400 font-mono">
            {telemetry.spans.length} spans
          </div>
        </div>
      </div>

      {/* Waterfall Visualization */}
      <div className="border border-slate-800 rounded-lg bg-slate-950 p-4 space-y-3">
        <div className="flex items-center justify-between text-xs text-slate-400 border-b border-slate-800 pb-2">
          <span>Span Name / Pod Agent</span>
          <span>Timeline (0ms — {maxDuration}ms)</span>
        </div>

        <div className="space-y-2.5">
          {telemetry.spans.map((span) => {
            const startOffset = Math.max(0, ((span.startTime - baseTime) / maxDuration) * 100);
            const width = Math.max(4, (span.durationMs / maxDuration) * 100);

            return (
              <div key={span.spanId} className="group">
                <div className="flex items-center justify-between text-xs mb-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[10px] text-slate-500">{span.spanId}</span>
                    <span className="font-medium text-slate-300 group-hover:text-indigo-400 transition-colors">
                      {span.name}
                    </span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-900 border border-slate-800 text-slate-400">
                      {span.agentRole}
                    </span>
                  </div>
                  <span className="font-mono text-xs text-slate-400">{span.durationMs} ms</span>
                </div>

                <div className="h-2 w-full bg-slate-900 rounded-full relative overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${
                      span.status === 'blocked'
                        ? 'bg-rose-500'
                        : span.status === 'flagged'
                        ? 'bg-amber-500'
                        : 'bg-indigo-500'
                    }`}
                    style={{
                      marginLeft: `${startOffset}%`,
                      width: `${width}%`,
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
