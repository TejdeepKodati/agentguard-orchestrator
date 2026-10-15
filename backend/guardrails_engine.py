"""
AgentGuard Python Backend Guardrail Engine
Adversarial Prompt Injection Scanner, PII Redactor, and Grounding Evaluator.
"""

import re
import time
from typing import Dict, Any, List, Tuple
from pydantic import BaseModel, Field

class GuardrailCheckResponse(BaseModel):
    rule_id: str
    rule_name: str
    category: str
    status: str  # passed | warning | violated
    confidence: float
    details: str
    redacted_text: str | None = None
    interventions: List[str] = Field(default_factory=list)
    latency_ms: int

EMAIL_PATTERN = re.compile(r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,7}\b')
PHONE_PATTERN = re.compile(r'\b(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}\b')
CARD_PATTERN = re.compile(r'\b(?:\d{4}[-\s]?){3}\d{4}\b')
SSN_PATTERN = re.compile(r'\b\d{3}-\d{2}-\d{4}\b')
API_KEY_PATTERN = re.compile(r'\b(?:sk-[a-zA-Z0-9]{20,48}|AKIA[0-9A-Z]{16}|ghp_[a-zA-Z0-9]{36})\b', re.IGNORECASE)

INJECTION_PATTERNS = [
    re.compile(r'ignore\s+(all\s+)?(previous|prior|above)\s+instructions', re.IGNORECASE),
    re.compile(r'disregard\s+(the\s+)?system\s+prompt', re.IGNORECASE),
    re.compile(r'you\s+are\s+now\s+in\s+DAN\s+mode', re.IGNORECASE),
    re.compile(r'bypass\s+(safety|content)\s+filters?', re.IGNORECASE),
    re.compile(r'reveal\s+(your\s+)?(system\s+prompt|initial\s+instructions)', re.IGNORECASE),
]

def scan_prompt_injection(prompt: str, sensitivity: str = "strict") -> GuardrailCheckResponse:
    start_time = time.perf_counter()
    violations = []
    confidence = 0.0

    for pattern in INJECTION_PATTERNS:
        if pattern.search(prompt):
            violations.append(f"Matched pattern: {pattern.pattern}")
            confidence += 0.5

    threshold = 0.35 if sensitivity == "strict" else 0.45
    status = "violated" if confidence >= threshold else "passed"
    latency_ms = int((time.perf_counter() - start_time) * 1000)

    return GuardrailCheckResponse(
        rule_id="RULE-INJECT-01",
        rule_name="Prompt Injection & Jailbreak Firewall",
        category="prompt_injection",
        status=status,
        confidence=min(1.0, confidence),
        details="Adversarial prompt injection pattern detected." if violations else "Clean prompt.",
        interventions=["Input Blocked", "Security Alert Dispatched"] if violations else [],
        latency_ms=latency_ms
    )

def redact_sensitive_pii(text: str) -> Tuple[str, GuardrailCheckResponse]:
    start_time = time.perf_counter()
    sanitized = text
    findings = []

    if API_KEY_PATTERN.search(sanitized):
        sanitized = API_KEY_PATTERN.sub("[REDACTED_API_KEY]", sanitized)
        findings.append("Secret API Key")
    if CARD_PATTERN.search(sanitized):
        sanitized = CARD_PATTERN.sub("[REDACTED_PAYMENT_CARD]", sanitized)
        findings.append("Credit Card Number")
    if SSN_PATTERN.search(sanitized):
        sanitized = SSN_PATTERN.sub("[REDACTED_SSN]", sanitized)
        findings.append("SSN")
    if EMAIL_PATTERN.search(sanitized):
        sanitized = EMAIL_PATTERN.sub("[REDACTED_EMAIL]", sanitized)
        findings.append("Email Address")
    if PHONE_PATTERN.search(sanitized):
        sanitized = PHONE_PATTERN.sub("[REDACTED_PHONE]", sanitized)
        findings.append("Phone Number")

    status = "warning" if findings else "passed"
    latency_ms = int((time.perf_counter() - start_time) * 1000)

    check = GuardrailCheckResponse(
        rule_id="RULE-PII-02",
        rule_name="Sensitive Data (PII & Secrets) Redaction",
        category="pii_leakage",
        status=status,
        confidence=0.98 if findings else 0.0,
        details=f"Redacted sensitive tokens: {', '.join(findings)}" if findings else "Zero PII detected.",
        redacted_text=sanitized,
        interventions=[f"Masked {len(findings)} token(s)"] if findings else [],
        latency_ms=latency_ms
    )
    return sanitized, check
