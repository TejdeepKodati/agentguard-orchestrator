# AgentGuard Orchestrator

**Enterprise Multi-Agent AI Governance, Safety Guardrails & OpenTelemetry Observability Platform**

AgentGuard is a production-grade multi-agent coordination platform engineered to enforce deterministic safety gates, adversarial prompt injection firewalls, cryptographic PII redaction, context grounding verification, and distributed OpenTelemetry tracing across enterprise generative AI workflows.

---

## Key Highlights & Capabilities

- **Frontier Pod Multi-Agent Mesh**: Coordinates 5 specialized agent pods via a stateful Directed Acyclic Graph (DAG):
  1. **Triage & Intent Planner Pod**: Deconstructs user tasks, classifies operational intent, and extracts constraints.
  2. **Context Retrieval Pod**: Ingests enterprise knowledge chunks and performs vector similarity search and context window pruning.
  3. **Structured Synthesizer Pod**: Enforces schema contracts (Pydantic / Zod) to output typed, deterministic payloads.
  4. **Guardrail & Safety Critic Pod**: Evaluates inputs and outputs against safety policies, toxicity, and hallucination drift.
  5. **Governance & Audit Dispatcher**: Records immutable audit spans and dispatches compliance alerts.
- **Defense-in-Depth AI Guardrails**:
  - **Adversarial Prompt Injection Firewall**: Scans for system prompt overrides, DAN roleplay attacks, delimiter injections, and Base64-obfuscated commands.
  - **Cryptographic Sensitive Data (PII) Redactor**: Detects and redacts credit cards (Luhn algorithm), Social Security Numbers, emails, phone numbers, and bearer credentials (JWT, AWS AKIA keys, API tokens).
  - **Context Grounding & Hallucination Auditor**: Verifies factual claims against grounding documents, computing a quantitative Faithfulness index.
  - **Toxicity & Policy Filter**: Flags malware generation directives, exploit vectors, and safety policy non-compliance.
- **OpenTelemetry & AgentOps Observability**:
  - Distributed trace generation compliant with W3C TraceContext standards.
  - Granular span-level latency waterfalls tracking each agent's execution lifecycle.
  - Token tracking (prompt tokens vs. completion tokens) and real-time financial cost attribution.
  - JSON trace export for upstream APM ingestion (Jaeger, Prometheus, Datadog).

---

## Architecture Topology

```
                   +------------------------+
                   |  Incoming User Prompt  |
                   +-----------+------------+
                               |
                               v
               +--------------------------------+
               |  Pre-Flight Injection Firewall |  ---> [Violated] --> Quarantine & Terminate
               +---------------+----------------+
                               | [Passed]
                               v
               +--------------------------------+
               |   Triage & Intent Planner Pod  |
               +---------------+----------------+
                               |
                               v
               +--------------------------------+
               |   Context Grounding Retriever  |
               +---------------+----------------+
                               |
                               v
               +--------------------------------+
               |  Structured Synthesizer Pod    |
               +---------------+----------------+
                               |
                               v
               +--------------------------------+
               |    Guardrail Critic & PII Gate |  ---> [PII Found] --> Redact & Mask Tokens
               +---------------+----------------+
                               |
                               v
               +--------------------------------+
               |   OpenTelemetry Audit Ledger   |  ---> [W3C Spans Exported]
               +---------------+----------------+
                               |
                               v
                   +------------------------+
                   | Certified Safe Output  |
                   +------------------------+
```

---

## Tech Stack

- **Frontend & Orchestration Core**: Next.js 14 (App Router), React 18, TypeScript, Tailwind CSS, Lucide Icons.
- **Observability**: OpenTelemetry standard trace models, custom span profilers, latency distribution calculators.
- **Backend Service (Optional)**: Python 3.12, FastAPI, Pydantic v2, Uvicorn.
- **Security & Validation**: Regex heuristics, Luhn validation, token frequency overlap, Zod schema contracts.

---

## Getting Started

### Prerequisites
- Node.js >= 18.17.0
- npm >= 9.0.0
- (Optional) Python >= 3.10 for running the backend microservice

### Installation

1. Clone repository:
```bash
git clone https://github.com/TejdeepKodati/agentguard-orchestrator.git
cd agentguard-orchestrator
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

4. Build for production:
```bash
npm run build
npm start
```

---

## Running the Python FastAPI Backend (Optional)

If you wish to run the standalone Python microservice gateway:

```bash
cd backend
python -m venv venv
# Windows:
venv\Scripts\activate
# Linux/macOS:
source venv/bin/activate

pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

The OpenAPI documentation will be accessible at `http://localhost:8000/docs`.

---

## Test Scenarios & Benchmarks

The platform includes 4 pre-configured test scenarios accessible in the interactive workbench:

1. **Compliant Enterprise Spec**: Clean architectural query testing multi-agent decomposition and full span latency recording.
2. **Adversarial Injection Attempt**: Tests the pre-flight prompt firewall against jailbreak probes ("Ignore previous instructions", DAN mode).
3. **Sensitive PII & Secret Leakage**: Stresses the PII redactor with simulated credit cards, JWT tokens, and emails.
4. **Hallucination Stress-Test**: Submits ungrounded queries to verify context grounding calculation and faithfulness scoring.

---

## License

MIT License. Designed and built with high engineering standards by Tejdeep.
