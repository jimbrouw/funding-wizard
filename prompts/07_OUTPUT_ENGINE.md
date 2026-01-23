TASK: Build rule-based output engine.

GOAL:
Generate draft sections without AI.

INPUT:
- Output templates from ace_project_grants.json

RULES:
- Outputs are assembled from user answers
- Missing inputs = mark output incomplete
- No prose generation beyond templates

DO NOT:
- Call AI
- Improve writing quality

OUTPUT:
- OutputCard component
- Live-updating outputs
