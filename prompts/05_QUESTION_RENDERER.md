TASK: Build QuestionRenderer component.

GOAL:
Render any question defined in JSON.

SUPPORTED TYPES:
- choice
- multi_choice
- text_short
- text_long
- number
- currency_gbp

RULES:
- Labels and help text required
- No visual logic in JSON
- Renderer handles all UI decisions

DO NOT:
- Add custom cases per question
- Hardcode styles per type

OUTPUT:
- Reusable QuestionRenderer
- Example questions rendered from JSON
