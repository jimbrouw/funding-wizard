TASK: Build JSON content loading system.

GOAL:
Prove that routes and questions can be driven entirely by JSON.

INPUT:
- /content/routes.json (create if missing)

REQUIREMENTS:
- Load routes at runtime or build time
- Render available routes on screen
- No route names hardcoded in components

DO NOT:
- Embed logic in JSX
- Add business rules yet

OUTPUT:
- Content loader utility
- Example render of routes.json
