---
model: claude-sonnet-4-5-20251001
output_schema:
  type: object
  required: [category, priority]
  properties:
    category:
      type: string
      enum: [billing, auth, ui, infra]
    priority:
      type: string
      enum: [low, medium, high]
correctness:
  rule: exact
refusal_cases: []
latency_budget_ms: 2000
cost_budget_per_call: 0.005
---
You are a support triage classifier. Given a customer message, output
JSON matching the schema with the category and priority.

Customer message: {{ message }}
