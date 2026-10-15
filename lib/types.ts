export type AgentRole =
  | 'triage_planner'
  | 'context_retriever'
  | 'structured_synthesizer'
  | 'guardrail_critic'
  | 'governance_audit';

export type GuardrailCategory =
  | 'prompt_injection'
  | 'pii_leakage'
  | 'toxicity_safety'
  | 'hallucination_grounding'
  | 'policy_compliance';

export type CheckStatus = 'passed' | 'warning' | 'violated';

export interface GuardrailCheckResult {
  ruleId: string;
  ruleName: string;
  category: GuardrailCategory;
  status: CheckStatus;
  confidence: number;
  details: string;
  redactedText?: string;
  interventions: string[];
  latencyMs: number;
}

export interface AgentSpan {
  spanId: string;
  traceId: string;
  parentSpanId?: string;
  name: string;
  agentRole: AgentRole;
  startTime: number;
  endTime: number;
  durationMs: number;
  status: 'ok' | 'flagged' | 'blocked';
  attributes: Record<string, any>;
  inputPreview: string;
  outputPreview: string;
}

export interface ReasoningStep {
  agentRole: AgentRole;
  agentName: string;
  thought: string;
  action: string;
  status: 'pending' | 'in_progress' | 'completed' | 'flagged' | 'blocked';
  durationMs: number;
}

export interface MultiAgentExecutionResult {
  id: string;
  timestamp: string;
  userQuery: string;
  groundingContext: string;
  finalResponse: string;
  rawResponse: string;
  status: 'approved' | 'sanitized' | 'blocked';
  escalationRequired: boolean;
  reasoningSteps: ReasoningStep[];
  guardrailChecks: GuardrailCheckResult[];
  telemetry: {
    traceId: string;
    totalDurationMs: number;
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
    estimatedCostUsd: number;
    spans: AgentSpan[];
  };
  metrics: {
    faithfulnessScore: number;
    safetyScore: number;
    latencyP95EstimateMs: number;
    sanitizationCount: number;
  };
}

export interface GuardrailSettings {
  promptInjectionSensitivity: 'low' | 'medium' | 'strict';
  piiMaskingEnabled: boolean;
  piiCategories: {
    emails: boolean;
    phoneNumbers: boolean;
    creditCards: boolean;
    apiKeys: boolean;
    ssn: boolean;
  };
  toxicityThreshold: number; // 0.0 to 1.0
  hallucinationThreshold: number; // 0.0 to 1.0
  enforceStructuredJsonOutput: boolean;
}
