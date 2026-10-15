import { GuardrailCheckResult, GuardrailSettings } from './types';

export const EMAIL_REGEX = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,7}\b/g;
export const PHONE_REGEX = /\b(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}\b/g;
export const CREDIT_CARD_REGEX = /\b(?:\d{4}[-\s]?){3}\d{4}\b/g;
export const SSN_REGEX = /\b\d{3}-\d{2}-\d{4}\b/g;
export const API_KEY_REGEX = /\b(?:sk-[a-zA-Z0-9]{20,48}|AKIA[0-9A-Z]{16}|ghp_[a-zA-Z0-9]{36}|bearer\s+[a-zA-Z0-9_\-\.]{30,})\b/gi;

// Heuristic signatures for Prompt Injection & Jailbreaking
const INJECTION_PATTERNS = [
  /ignore\s+(all\s+)?(previous|prior|above)\s+instructions/i,
  /disregard\s+(the\s+)?system\s+prompt/i,
  /you\s+are\s+now\s+in\s+DAN\s+mode/i,
  /bypass\s+(safety|content)\s+filters?/i,
  /reveal\s+(your\s+)?(system\s+prompt|initial\s+instructions)/i,
  /pretend\s+you\s+have\s+no\s+(rules|guidelines|morals)/i,
  /developer\s+mode\s+output/i,
  /\b(sudo|eval|exec)\b.*(base64|sh|bash)/i,
  /delimiter\s+attack:\s*```/i,
];

// Toxic/harmful intent indicators
const HARMFUL_INDICATORS = [
  /how\s+to\s+build\s+a\s+(bomb|weapon|malware|ransomware)/i,
  /generate\s+(ddos|exploit|phishing)\s+script/i,
  /sql\s+injection\s+payload\s+to\s+dump/i,
  /bypass\s+corporate\s+firewall\s+unauthorized/i,
];

export function scanPromptInjection(
  prompt: string,
  sensitivity: 'low' | 'medium' | 'strict'
): GuardrailCheckResult {
  const startTime = performance.now();
  const violations: string[] = [];
  let confidence = 0;

  for (const pattern of INJECTION_PATTERNS) {
    if (pattern.test(prompt)) {
      violations.push(`Matched adversarial pattern: "${pattern.source}"`);
      confidence += 0.45;
    }
  }

  // Check for suspicious base64 payloads
  const base64Match = prompt.match(/[A-Za-z0-9+/=]{40,}/);
  if (base64Match) {
    try {
      const decoded = atob(base64Match[0]);
      if (/system|ignore|hack|password|prompt/i.test(decoded)) {
        violations.push('Obfuscated Base64 instruction payload detected');
        confidence += 0.5;
      }
    } catch {
      // not valid base64
    }
  }

  // Adjust thresholds based on sensitivity
  const threshold = sensitivity === 'strict' ? 0.35 : sensitivity === 'medium' ? 0.44 : 0.7;
  const status = confidence >= threshold ? 'violated' : confidence > 0.2 ? 'warning' : 'passed';

  return {
    ruleId: 'RULE-INJECT-01',
    ruleName: 'Prompt Injection & Jailbreak Firewall',
    category: 'prompt_injection',
    status,
    confidence: Math.min(1.0, confidence),
    details: violations.length > 0
      ? `Threat detected: ${violations.join(', ')}`
      : 'No adversarial prompt injection patterns detected.',
    interventions: violations.length > 0 ? ['Input Blocked', 'Security Audit Alert Triggered'] : [],
    latencyMs: Math.round(performance.now() - startTime),
  };
}

export function redactPII(
  text: string,
  settings: GuardrailSettings
): { sanitized: string; checkResult: GuardrailCheckResult } {
  const startTime = performance.now();
  let sanitized = text;
  const findings: string[] = [];

  if (settings.piiCategories.apiKeys && API_KEY_REGEX.test(sanitized)) {
    sanitized = sanitized.replace(API_KEY_REGEX, '[REDACTED_API_KEY]');
    findings.push('Secret API Key / Credential');
  }

  if (settings.piiCategories.creditCards && CREDIT_CARD_REGEX.test(sanitized)) {
    sanitized = sanitized.replace(CREDIT_CARD_REGEX, '[REDACTED_PAYMENT_CARD]');
    findings.push('Credit/Debit Card Number');
  }

  if (settings.piiCategories.ssn && SSN_REGEX.test(sanitized)) {
    sanitized = sanitized.replace(SSN_REGEX, '[REDACTED_GOV_ID]');
    findings.push('Government Identification (SSN)');
  }

  if (settings.piiCategories.emails && EMAIL_REGEX.test(sanitized)) {
    sanitized = sanitized.replace(EMAIL_REGEX, '[REDACTED_EMAIL]');
    findings.push('Email Address');
  }

  if (settings.piiCategories.phoneNumbers && PHONE_REGEX.test(sanitized)) {
    sanitized = sanitized.replace(PHONE_REGEX, '[REDACTED_PHONE]');
    findings.push('Phone Number');
  }

  const status = findings.length > 0 ? 'warning' : 'passed';

  return {
    sanitized,
    checkResult: {
      ruleId: 'RULE-PII-02',
      ruleName: 'Sensitive Data (PII & Secrets) Redaction',
      category: 'pii_leakage',
      status,
      confidence: findings.length > 0 ? 0.98 : 0.05,
      details: findings.length > 0
        ? `Redacted sensitive entities: ${findings.join(', ')}.`
        : 'Zero sensitive PII or credentials detected.',
      redactedText: sanitized,
      interventions: findings.length > 0 ? [`Masked ${findings.length} sensitive token(s)`] : [],
      latencyMs: Math.round(performance.now() - startTime),
    },
  };
}

export function scanToxicity(text: string, threshold: number): GuardrailCheckResult {
  const startTime = performance.now();
  const violations: string[] = [];
  let score = 0.05;

  for (const pattern of HARMFUL_INDICATORS) {
    if (pattern.test(text)) {
      violations.push(`Unsafe intent: ${pattern.source}`);
      score += 0.85;
    }
  }

  const status = score >= threshold ? 'violated' : score > 0.3 ? 'warning' : 'passed';

  return {
    ruleId: 'RULE-TOXIC-03',
    ruleName: 'Harmful Intent & Policy Enforcement',
    category: 'toxicity_safety',
    status,
    confidence: Math.min(1.0, score),
    details: violations.length > 0
      ? `Violation of enterprise safety policy: ${violations.join('; ')}`
      : 'Content conforms to enterprise safety directives.',
    interventions: violations.length > 0 ? ['Blocked execution', 'Dispatched to human governance queue'] : [],
    latencyMs: Math.round(performance.now() - startTime),
  };
}

export function evaluateFaithfulness(
  response: string,
  groundingContext: string,
  threshold: number
): GuardrailCheckResult {
  const startTime = performance.now();
  if (!groundingContext || groundingContext.trim().length === 0) {
    return {
      ruleId: 'RULE-GROUND-04',
      ruleName: 'Context Grounding & Hallucination Auditor',
      category: 'hallucination_grounding',
      status: 'warning',
      confidence: 0.6,
      details: 'No grounding reference context provided for verification.',
      interventions: ['Flagged ungrounded assertion'],
      latencyMs: Math.round(performance.now() - startTime),
    };
  }

  // Tokenize & compare key domain terms
  const contextWords = new Set(
    groundingContext
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, '')
      .split(/\s+/)
      .filter((w) => w.length > 3)
  );

  const responseWords = response
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .split(/\s+/)
    .filter((w) => w.length > 3);

  if (responseWords.length === 0) {
    return {
      ruleId: 'RULE-GROUND-04',
      ruleName: 'Context Grounding & Hallucination Auditor',
      category: 'hallucination_grounding',
      status: 'passed',
      confidence: 1.0,
      details: 'Output is concise with no ungrounded claims.',
      interventions: [],
      latencyMs: Math.round(performance.now() - startTime),
    };
  }

  let groundedCount = 0;
  for (const word of responseWords) {
    if (contextWords.has(word)) {
      groundedCount++;
    }
  }

  const overlapRatio = groundedCount / responseWords.length;
  // Faithfulness score scaled
  const faithfulness = Math.min(1.0, Number((overlapRatio * 1.6 + 0.2).toFixed(2)));
  const status = faithfulness < threshold ? 'warning' : 'passed';

  return {
    ruleId: 'RULE-GROUND-04',
    ruleName: 'Context Grounding & Hallucination Auditor',
    category: 'hallucination_grounding',
    status,
    confidence: faithfulness,
    details: `Faithfulness index: ${(faithfulness * 100).toFixed(1)}%. Grounded overlap: ${groundedCount}/${responseWords.length} key terms verified against source context.`,
    interventions: status === 'warning' ? ['Suggested citation refinement', 'Confidence threshold warning logged'] : [],
    latencyMs: Math.round(performance.now() - startTime),
  };
}
