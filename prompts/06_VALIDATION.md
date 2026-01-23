TASK: Implement validation and gating.

GOAL:
Prevent users progressing with missing required information.

RULES:
- required: true blocks navigation
- Validation rules come from JSON only
- Errors must be specific

DO NOT:
- Infer importance
- Auto-fill values

OUTPUT:
- Validation logic
- Disabled navigation when blocked
