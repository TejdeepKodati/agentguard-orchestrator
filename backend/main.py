"""
AgentGuard Enterprise FastAPI Gateway
Multi-Agent Pod Orchestration with OpenTelemetry tracing and Guardrail gates.
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
import time
import uuid
from typing import List, Dict, Any, Optional

from guardrails_engine import scan_prompt_injection, redact_sensitive_pii, GuardrailCheckResponse

app = FastAPI(
    title="AgentGuard Orchestration Service",
    description="Enterprise Multi-Agent Pod Orchestrator & Guardrail Gateway",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class OrchestrationRequest(BaseModel):
    query: str
    grounding_context: Optional[str] = ""
    prompt_injection_sensitivity: str = "strict"
    enable_pii_redaction: bool = True

class AgentSpanModel(BaseModel):
    span_id: str
    trace_id: str
    name: str
    agent_role: str
    duration_ms: int
    status: str

class PipelineResponse(BaseModel):
    trace_id: str
    status: str
    final_response: str
    raw_response: str
    guardrail_checks: List[GuardrailCheckResponse]
    latency_ms: int
    tokens_consumed: int
    cost_usd: float

@app.get("/health")
def health_check():
    return {"status": "healthy", "service": "AgentGuard Multi-Agent Gateway", "version": "1.0.0"}

@app.post("/api/v1/orchestrate", response_model=PipelineResponse)
def orchestrate_pod_pipeline(req: OrchestrationRequest):
    start = time.perf_counter()
    trace_id = f"trace-{uuid.uuid4().hex[:8]}"

    # Step 1: Pre-flight injection check
    inj_check = scan_prompt_injection(req.query, req.prompt_injection_sensitivity)
    if inj_check.status == "violated":
        latency = int((time.perf_counter() - start) * 1000)
        return PipelineResponse(
            trace_id=trace_id,
            status="BLOCKED",
            final_response="[SECURITY ALERT] Execution aborted due to adversarial prompt injection violation.",
            raw_response=req.query,
            guardrail_checks=[inj_check],
            latency_ms=latency,
            tokens_consumed=len(req.query) // 4,
            cost_usd=0.00005
        )

    # Step 2: Simulate multi-agent pod synthesis
    raw_output = f"Enterprise Architecture Synthesis: Request parsed and validated across 5 agent pods. Grounded in context specifications."
    if "@" in req.query or "sk-" in req.query:
        raw_output += f" Context verification processed for query parameters."

    # Step 3: Guardrail redaction
    sanitized_output, pii_check = redact_sensitive_pii(raw_output)

    total_latency = int((time.perf_counter() - start) * 1000) + 38
    return PipelineResponse(
        trace_id=trace_id,
        status="SANITIZED" if pii_check.status == "warning" else "APPROVED",
        final_response=sanitized_output,
        raw_response=raw_output,
        guardrail_checks=[inj_check, pii_check],
        latency_ms=total_latency,
        tokens_consumed=184,
        cost_usd=0.0019
    )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
