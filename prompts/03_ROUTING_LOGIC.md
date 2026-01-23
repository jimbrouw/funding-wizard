TASK: Implement routing + eligibility logic.

GOAL:
Deterministically route users to the correct funding path.

RULES:
- England gate blocks ACE routes
- “I already know the fund” bypasses quiz
- Quiz logic comes only from routes.json

DO NOT:
- Add heuristics
- Add AI decision-making

OUTPUT:
- Routing function
- Clear explanation UI for why a route was chosen
