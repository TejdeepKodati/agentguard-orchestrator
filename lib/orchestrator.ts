import {
  AgentRole,
  AgentSpan,
  GuardrailCheckResult,
  GuardrailSettings,
  MultiAgentExecutionResult,
  ReasoningStep,
} from './types';
import {
  evaluateFaithfulness,
  redactPII,
  scanPromptInjection,
  scanToxicity,
  EMAIL_REGEX,
  API_KEY_REGEX,
} from './guardrails';

function generateId(prefix: string): string {
  return `${prefix}-${Math.random().toString(36).substring(2, 9)}`;
}

export async function executeMultiAgentPipeline(
  query: string,
  groundingContext: string,
  settings: GuardrailSettings
): Promise<MultiAgentExecutionResult> {
  const pipelineStartTime = performance.now();
  const traceId = `trace-${Math.random().toString(36).substring(2, 11)}`;
  const spans: AgentSpan[] = [];
  const reasoningSteps: ReasoningStep[] = [];
  const guardrailChecks: GuardrailCheckResult[] = [];

  // Helper to record spans
  function createSpan(
    name: string,
    agentRole: AgentRole,
    startTime: number,
    endTime: number,
    status: 'ok' | 'flagged' | 'blocked',
    inputPreview: string,
    outputPreview: string,
    attributes: Record<string, any> = {}
  ): AgentSpan {
    const span: AgentSpan = {
      spanId: generateId('span'),
      traceId,
      name,
      agentRole,
      startTime: Math.round(startTime),
      endTime: Math.round(endTime),
      durationMs: Math.max(1, Math.round(endTime - startTime)),
      status,
      attributes,
      inputPreview,
      outputPreview,
    };
    spans.push(span);
    return span;
  }

  // --- STEP 1: Pre-execution Safety Guardrail (Prompt Injection Scanner) ---
  const injCheck = scanPromptInjection(query, settings.promptInjectionSensitivity);
  guardrailChecks.push(injCheck);

  if (injCheck.status === 'violated') {
    const endTime = performance.now();
    createSpan(
      'Pre-execution Firewall Scan',
      'guardrail_critic',
      pipelineStartTime,
      endTime,
      'blocked',
      query.slice(0, 100),
      'Threat blocked by security guardrails',
      { violation: injCheck.details }
    );

    reasoningSteps.push({
      agentRole: 'guardrail_critic',
      agentName: 'AgentGuard Security Gate',
      thought: `Adversarial prompt injection pattern detected (${(injCheck.confidence * 100).toFixed(0)}% confidence). Halting execution to prevent jailbreak or policy bypass.`,
      action: 'ABORT_AND_QUARANTINE',
      status: 'blocked',
      durationMs: Math.round(endTime - pipelineStartTime),
    });

    return {
      id: generateId('exec'),
      timestamp: new Date().toISOString(),
      userQuery: query,
      groundingContext,
      finalResponse: `[SECURITY GUARDRAIL ENGAGED] Request terminated due to safety policy violation. Adversarial pattern detected: ${injCheck.details}. Incident has been logged for governance review.`,
      rawResponse: `Blocked prompt: ${query}`,
      status: 'blocked',
      escalationRequired: true,
      reasoningSteps,
      guardrailChecks,
      telemetry: {
        traceId,
        totalDurationMs: Math.max(1, Math.round(endTime - pipelineStartTime)),
        promptTokens: Math.ceil(query.length / 4),
        completionTokens: 25,
        totalTokens: Math.ceil(query.length / 4) + 25,
        estimatedCostUsd: 0.00002,
        spans,
      },
      metrics: {
        faithfulnessScore: 0.0,
        safetyScore: 0.0,
        latencyP95EstimateMs: 42,
        sanitizationCount: 0,
      },
    };
  }

  // --- STEP 2: Triage & Intent Planner Agent ---
  const t1 = performance.now();
  await new Promise((r) => setTimeout(r, 80 + Math.random() * 40));
  const t2 = performance.now();

  const isCodeQuery = /code|function|algorithm|react|api|docker|pipeline/i.test(query);
  const isSecurityQuery = /security|auth|pii|token|vulnerability|audit/i.test(query);
  const intentType = isCodeQuery ? 'ENGINEERING_IMPLEMENTATION' : isSecurityQuery ? 'SECURITY_ASSURANCE' : 'KNOWLEDGE_RETRIEVAL';

  reasoningSteps.push({
    agentRole: 'triage_planner',
    agentName: 'Planner Pod',
    thought: `Deconstructed user query. Identified intent category: ${intentType}. Formulating context retrieval strategy and structured schema constraints.`,
    action: `DISPATCH_TO_RETRIEVAL(intent=${intentType}, priority=HIGH)`,
    status: 'completed',
    durationMs: Math.round(t2 - t1),
  });

  createSpan(
    'Intent Classification & Decomposition',
    'triage_planner',
    t1,
    t2,
    'ok',
    query.slice(0, 120),
    `Intent=${intentType}`,
    { 'agent.intent': intentType, 'planner.heuristic': 'semantic_decomposition' }
  );

  // --- STEP 3: Context Retrieval Agent ---
  const t3 = performance.now();
  await new Promise((r) => setTimeout(r, 90 + Math.random() * 50));
  const t4 = performance.now();

  const effectiveContext = groundingContext && groundingContext.trim().length > 0
    ? groundingContext
    : `Enterprise Reference Architecture: All microservices communicate through mutual TLS and authenticated API gateways. Data ingestion pipelines enforce event-driven Kafka streaming with Dead Letter Queues (DLQ). PII fields must be masked at rest and in transit using AES-256 GCM. Observability mandates distributed tracing via OpenTelemetry exporters.`;

  reasoningSteps.push({
    agentRole: 'context_retriever',
    agentName: 'Context Retrieval Pod',
    thought: `Retrieved enterprise knowledge chunks. Executed vector similarity match and context window pruning (length: ${effectiveContext.length} chars).`,
    action: 'INDEX_AND_GROUND_CHUNKS',
    status: 'completed',
    durationMs: Math.round(t4 - t3),
  });

  createSpan(
    'Vector & Context Grounding Retrieval',
    'context_retriever',
    t3,
    t4,
    'ok',
    `Query: ${query.slice(0, 60)}...`,
    `Retrieved ${Math.ceil(effectiveContext.length / 50)} grounding tokens`,
    { 'retrieval.tokens': Math.ceil(effectiveContext.length / 4), 'retrieval.strategy': 'hybrid_bm25_dense' }
  );

  // --- STEP 4: Structured Synthesizer Agent ---
  const t5 = performance.now();
  await new Promise((r) => setTimeout(r, 140 + Math.random() * 80));
  const t6 = performance.now();

  let synthesizedAnswer = '';
  if (isCodeQuery) {
    synthesizedAnswer = `Based on the verified architecture guidelines:
1. Orchestration Layer: Implement a modular multi-agent supervisor graph using stateful checkpointing.
2. Interface Contract: Enforce strict schema validation on all inputs and outputs using Pydantic/Zod.
3. Observability Hook: Emit OpenTelemetry span events for every agent invocation to enable latency and token telemetry.
4. Resilience: Configure circuit breakers and exponential backoff retries with a maximum retry budget of 3 attempts.`;
  } else if (isSecurityQuery) {
    synthesizedAnswer = `In accordance with enterprise data protection standards:
1. Sensitive Data Masking: PII (emails, cards, credentials) must be scrubbed before passing prompt buffers to external foundation models.
2. Prompt Firewall: Real-time heuristic and embedding checks must intercept adversarial delimiter injections.
3. Audit Log: All sanitization events must be recorded in an immutable ledger with unique trace IDs.`;
  } else {
    synthesizedAnswer = `Enterprise AI Analysis:
The system validates incoming requests across multi-agent workflows. The grounding context indicates that microservices adhere to mutual TLS and automated Dead Letter Queue (DLQ) processing. All AI-driven tasks are bound to strict schema constraints, real-time observability telemetry, and automated compliance auditing.`;
  }

  // If query contains raw PII, simulate model inadvertently reflecting it so guardrail can demonstrate sanitization
  if (/@|\d{3}-\d{2}-\d{4}|sk-[a-zA-Z0-9]/.test(query)) {
    synthesizedAnswer += `\n[Context reference: Processed transaction for user record ${query.match(EMAIL_REGEX)?.[0] || 'admin@enterprise.internal'} with session key ${query.match(API_KEY_REGEX)?.[0] || 'sk-test9482018402948294'}]`;
  }

  reasoningSteps.push({
    agentRole: 'structured_synthesizer',
    agentName: 'Synthesizer Pod',
    thought: `Generated context-grounded response adhering to structured output schema. Synthesized ${synthesizedAnswer.length} characters across 4 enterprise directives.`,
    action: 'SYNTHESIZE_STRUCTURED_RESPONSE',
    status: 'completed',
    durationMs: Math.round(t6 - t5),
  });

  createSpan(
    'LLM Structured Output Generation',
    'structured_synthesizer',
    t5,
    t6,
    'ok',
    `Grounding Context (${effectiveContext.length} chars)`,
    synthesizedAnswer.slice(0, 100),
    { 'model.family': 'gpt-4o / claude-3.5-sonnet', 'temperature': 0.2, 'structured_schema': 'EnterpriseAuditSpec' }
  );

  // --- STEP 5: Post-generation Guardrails (PII Redaction, Toxicity, Faithfulness) ---
  const t7 = performance.now();

  // 1. PII Redaction
  const piiResult = redactPII(synthesizedAnswer, settings);
  guardrailChecks.push(piiResult.checkResult);

  // 2. Toxicity Check
  const toxicCheck = scanToxicity(synthesizedAnswer, settings.toxicityThreshold);
  guardrailChecks.push(toxicCheck);

  // 3. Faithfulness / Hallucination Auditor
  const faithCheck = evaluateFaithfulness(synthesizedAnswer, effectiveContext, settings.hallucinationThreshold);
  guardrailChecks.push(faithCheck);

  const t8 = performance.now();

  const isSanitized = piiResult.checkResult.status === 'warning';
  const hasSafetyWarning = toxicCheck.status === 'violated';

  reasoningSteps.push({
    agentRole: 'guardrail_critic',
    agentName: 'Guardrail Critic Pod',
    thought: `Post-generation inspection complete: PII Redaction: ${piiResult.checkResult.status}, Toxicity: ${toxicCheck.status}, Faithfulness: ${(faithCheck.confidence * 100).toFixed(0)}%. ${isSanitized ? 'Applied cryptographic masking to sensitive tokens.' : 'No sensitive data leaked.'}`,
    action: isSanitized ? 'SANITIZE_AND_APPROVE' : 'APPROVE_OUTPUT',
    status: isSanitized ? 'flagged' : 'completed',
    durationMs: Math.round(t8 - t7),
  });

  createSpan(
    'Post-Generation Guardrail & Faithfulness Evaluation',
    'guardrail_critic',
    t7,
    t8,
    isSanitized ? 'flagged' : 'ok',
    synthesizedAnswer.slice(0, 100),
    piiResult.sanitized.slice(0, 100),
    {
      'guardrail.pii_status': piiResult.checkResult.status,
      'guardrail.toxicity': toxicCheck.confidence,
      'guardrail.faithfulness': faithCheck.confidence,
    }
  );

  // --- STEP 6: Governance & Audit Logger ---
  const t9 = performance.now();
  await new Promise((r) => setTimeout(r, 40));
  const t10 = performance.now();

  const finalResponse = piiResult.sanitized;
  const status: 'approved' | 'sanitized' | 'blocked' = hasSafetyWarning
    ? 'blocked'
    : isSanitized
    ? 'sanitized'
    : 'approved';

  reasoningSteps.push({
    agentRole: 'governance_audit',
    agentName: 'Governance & Audit Pod',
    thought: `Emitted OpenTelemetry telemetry spans to collector. Trace ID: ${traceId}. Audit status: ${status.toUpperCase()}.`,
    action: 'DISPATCH_AUDIT_LEDGER',
    status: 'completed',
    durationMs: Math.round(t10 - t9),
  });

  createSpan(
    'OpenTelemetry Audit Ledger Dispatch',
    'governance_audit',
    t9,
    t10,
    'ok',
    `Status=${status}`,
    `TraceId=${traceId}`,
    { 'audit.ledger': 'immutable_telemetry', 'trace.id': traceId }
  );

  const pipelineEndTime = performance.now();
  const totalDurationMs = Math.round(pipelineEndTime - pipelineStartTime);
  const promptTokens = Math.ceil((query.length + effectiveContext.length) / 4);
  const completionTokens = Math.ceil(finalResponse.length / 4);
  const totalTokens = promptTokens + completionTokens;
  const estimatedCostUsd = Number(((promptTokens * 0.000005) + (completionTokens * 0.000015)).toFixed(6));

  return {
    id: generateId('exec'),
    timestamp: new Date().toISOString(),
    userQuery: query,
    groundingContext: effectiveContext,
    finalResponse,
    rawResponse: synthesizedAnswer,
    status,
    escalationRequired: status !== 'approved',
    reasoningSteps,
    guardrailChecks,
    telemetry: {
      traceId,
      totalDurationMs,
      promptTokens,
      completionTokens,
      totalTokens,
      estimatedCostUsd,
      spans,
    },
    metrics: {
      faithfulnessScore: faithCheck.confidence,
      safetyScore: Number((1.0 - toxicCheck.confidence).toFixed(2)),
      latencyP95EstimateMs: Math.round(totalDurationMs * 1.15),
      sanitizationCount: isSanitized ? 1 : 0,
    },
  };
}
