TASK: Add controlled AI rewrite (Gemini Pro 3).

GOAL:
Allow optional rewriting of completed outputs.

INPUT SENT TO AI:
- Output template
- User-provided answers only
- Word limit
- Style rules

RULES:
- Block call if required inputs missing
- If missing → AI must return missing list
- AI may not add information

OUTPUT:
- /api/generate endpoint
- Rewrite button per OutputCard
