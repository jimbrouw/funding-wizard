```md
# skills.md — Vibe Cheque v0.1 (Master Build Spec)

## Purpose
Build a **data-driven web app** that:
1) routes a user to the right funding journey (v0.1: **ACE Project Grants** only, others as placeholders),
2) guides them through a **multiple-choice + short text** wizard,
3) generates **copy-ready draft text** per application section,
4) exports answers + outputs as JSON, and supports copy-to-clipboard.

This is **structure-first**. No accounts, no database, no payments.

---

## Non-negotiables (v0.1)
- **Single route fully implemented:** `ACE Project Grants`
- **Other routes:** `DYCP` and `Other` exist as placeholders (screen + message)
- **All content + logic is JSON-driven** (no hardcoding questions into components)
- **No login / no persistence** (answers live in memory; optional localStorage is allowed but not required)
- **Outputs are generated from user inputs** (AI may rewrite/structure, but must not invent facts)
- **Export button:** downloads `answers.json`
- **Copy button:** copies full outputs to clipboard
- **Accessibility:** readable, simple language, keyboard navigable, clear progress state

---

## Target UX
### Start
- Who are you? (Individual / Collective / Organisation)
- Discipline (Visual arts / Film / Music / Theatre / Mixed)
- Location gate: England? (Yes/No)
- Do you already know your fund? (Yes/No)

### Routing
- If user knows: choose from [ACE Project Grants, DYCP (placeholder), Other (placeholder)]
- If user doesn’t know: short quiz to recommend route
- If not England: show “ACE not eligible” message and stop (v0.1)

### ACE Project Grants Wizard (Stepper)
Steps (IDs):
1. `fit` — readiness + eligibility checks + one-sentence project
2. `plan` — activities, timeline, collaborators, delivery plan
3. `write` — audience, access, outcomes, artistic case, credibility
4. `budget` — costs, income, match funding, justification notes
5. `risk_eval` — risks, mitigations, evaluation, learning
6. `submit` — checklist, attachments, final QA

### Outputs
- A page showing Output Cards:
  - Project summary
  - Need / rationale
  - Activities & timeline
  - Audience & access plan
  - Outcomes & evaluation plan
  - Budget notes & justification
  - Risk register summary
  - Submission checklist
- “Missing info” checklist (derived from required fields)

---

## Tech stack (recommended)
- Next.js (App Router) + TypeScript
- Tailwind CSS
- Minimal state management (React context or Zustand)
- Optional: Zod for validation
- Optional: localStorage persistence toggle

---

## Repo structure (suggested)
```

funding-wizard/
app/
layout.tsx
page.tsx                     # Start
route-picker/page.tsx         # Fund selection + quiz
wizard/[route]/page.tsx       # Stepper
outputs/page.tsx              # Output cards + export/copy
api/
generate/route.ts           # (optional) AI generation endpoint
content/
routes.json                   # route list + quiz logic
ace_project_grants.json       # steps/questions/output templates
src/
components/
Stepper.tsx
QuestionRenderer.tsx
OutputCard.tsx
ProgressBar.tsx
NavButtons.tsx
Callout.tsx
lib/
schema.ts                   # types + zod schemas
engine.ts                   # routing, gating, missing-info logic
export.ts                   # download/copy helpers
prompts.ts                  # AI prompt assembly (if used)
public/
README.md
skills.md

````

---

## Data model (JSON-driven)

### routes.json
Defines available routes + qualifying quiz.

Example shape:
```json
{
  "routes": [
    { "id": "ace_project_grants", "title": "ACE Project Grants", "status": "active" },
    { "id": "ace_dycp", "title": "ACE DYCP", "status": "placeholder" },
    { "id": "other", "title": "Other funder", "status": "placeholder" }
  ],
  "qualifyingQuiz": {
    "id": "route_quiz_v1",
    "questions": [
      {
        "id": "q_goal",
        "type": "choice",
        "label": "What best describes your goal?",
        "choices": [
          { "value": "public_project", "label": "A time-limited project for an audience/public outcome" },
          { "value": "practice_dev", "label": "My own development (skills, networks, research)" }
        ]
      }
    ],
    "recommendations": [
      {
        "if": [{ "questionId": "q_goal", "equals": "public_project" }],
        "routeId": "ace_project_grants"
      },
      {
        "if": [{ "questionId": "q_goal", "equals": "practice_dev" }],
        "routeId": "ace_dycp"
      }
    ]
  }
}
````

### ace_project_grants.json

Defines stepper steps + questions + output templates.

Top-level:

```json
{
  "routeId": "ace_project_grants",
  "title": "ACE Project Grants",
  "steps": [
    { "id": "fit", "title": "Fit & readiness", "intro": "Check eligibility and define the project." },
    { "id": "plan", "title": "Plan delivery", "intro": "Activities, timeline, partners." },
    { "id": "write", "title": "Write the case", "intro": "Audience, access, outcomes." },
    { "id": "budget", "title": "Budget", "intro": "Costs and income with notes." },
    { "id": "risk_eval", "title": "Risk & evaluation", "intro": "Risks, mitigations, evaluation." },
    { "id": "submit", "title": "Submit", "intro": "Final checklist and QA." }
  ],
  "questions": {
    "fit": [ /* array of question objects */ ],
    "plan": [ /* ... */ ],
    "write": [ /* ... */ ],
    "budget": [ /* ... */ ],
    "risk_eval": [ /* ... */ ],
    "submit": [ /* ... */ ]
  },
  "outputs": [ /* output slots with templates */ ]
}
```

### Question object spec

Supported types:

* `choice` (single)
* `multi_choice` (multi)
* `text_short`
* `text_long`
* `number`
* `currency_gbp`
* `date`
* `table` (simple rows; v0.1 optional)

Base fields:

```json
{
  "id": "project_one_sentence",
  "type": "text_short",
  "label": "Describe the project in one sentence.",
  "help": "Plain language. What, for who, where, when.",
  "required": true,
  "tags": ["core"],
  "outputSlots": ["project_summary"],
  "gates": [
    { "ifEmpty": true, "action": "blockNext", "message": "Add a one-sentence description to continue." }
  ]
}
```

Choice example:

```json
{
  "id": "access_priority",
  "type": "multi_choice",
  "label": "Which access needs will you design for?",
  "choices": [
    { "value": "wheelchair", "label": "Wheelchair access / step-free" },
    { "value": "captions", "label": "Captions / transcripts" },
    { "value": "quiet", "label": "Quiet space / low sensory" },
    { "value": "bsl", "label": "BSL interpretation" }
  ],
  "required": true,
  "outputSlots": ["access_plan"]
}
```

---

## Output engine (v0.1)

Outputs are “slots” filled from user answers.

### Output slot object spec

```json
{
  "id": "project_summary",
  "title": "Project summary",
  "type": "paragraph",
  "requiredInputs": ["project_one_sentence", "audience_primary", "activities_core"],
  "template": [
    "Project: {project_one_sentence}",
    "Audience: {audience_primary}",
    "Activities: {activities_core}",
    "Intended outcomes: {outcomes_list}"
  ]
}
```

Rules:

* If any `requiredInputs` missing → slot displays as “incomplete” and appears in Missing Info list
* Slot output defaults to rule-based concatenation using `template`
* Optional AI rewrite button per slot:

  * sends only the slot’s inputs + a short style guide prompt
  * returns a tighter paragraph + bullet variant

### Missing info list (must have)

Compute from:

* all questions with `required: true`
* plus output slots whose `requiredInputs` missing

---

## AI usage (optional in v0.1, but scaffold it)

AI should only:

* rewrite/structure the user’s answers,
* convert bullets into short paragraphs,
* produce variants (plain / slightly formal),
* never add new facts.

### API endpoint

`POST /api/generate`
Body:

```json
{
  "routeId": "ace_project_grants",
  "slotId": "project_summary",
  "answers": { "project_one_sentence": "...", "...": "..." }
}
```

Returns:

```json
{ "text": "..." }
```

### Prompt rules

* UK English
* Plain language, ~12–14 reading age
* No clichés (“why it matters”, “delve”, “robust”, etc.)
* No invented partners, numbers, venues, audiences
* If input is missing, respond with: “Missing: X, Y, Z” (do not guess)

---

## Component contracts

### `<QuestionRenderer />`

Props:

* `question`
* `value`
* `onChange(value)`
* `error` (string | null)

Must support all question types.

### `<Stepper />`

Props:

* `steps[]`
* `currentStepId`
* `onNavigate(stepId)`

Must show progress and allow back navigation.

### `<OutputCard />`

Props:

* `slot`
* `text`
* `status` (complete/incomplete)
* `onRewriteWithAI()` (optional)

### `<NavButtons />`

Props:

* `onBack`
* `onNext`
* `nextDisabled`
* `nextMessage` (optional)

---

## Validation + gating logic

* Required questions block Next.
* Location gate blocks routing into ACE if not England.
* Placeholder routes show a “Not implemented in v0.1” screen + option to export answers.

---

## Acceptance criteria (Definition of Done)

1. User can complete Start → Route Picker → ACE Wizard → Outputs.
2. All wizard steps render from JSON only.
3. Required fields are enforced and visible.
4. Outputs page generates:

   * at least 6 output slots
   * a Missing Info list
5. Export answers as JSON works.
6. Copy all outputs works.
7. No runtime errors on refresh/navigation.
8. Basic accessibility:

   * tab order works
   * labels attached to inputs
   * visible focus styles
9. README includes:

   * setup
   * how to edit content JSON
   * how to add a new route/step/question

---

## v0.1 content minimum (what to actually write in ace_project_grants.json)

Aim for ~10–15 questions per step (60–90 total is enough).

Suggested must-haves:

* Fit: one sentence, who benefits, eligibility confidence, capacity/time
* Plan: activities list, timeline rough, partners/collaborators, locations
* Write: audience primary, access needs, outcomes (3), artist/company track record
* Budget: 8–12 cost lines (even rough), income sources, fee rates note
* Risk/Eval: 5 risks + mitigations, evaluation method (how you’ll know)
* Submit: attachments list, proofreading checklist, final “does this match guidance?” check

---

## v0.2 (explicitly out of scope)

* Login/accounts
* Database persistence
* Multiple funders fully implemented
* Deadline scraping / live fund listings
* Document upload + parsing
* Collaboration/multi-user editing

---

## Working style for the coding agent

* Build the app skeleton first (routes + pages + navigation).
* Then implement the JSON loader + types.
* Then QuestionRenderer (all types).
* Then the Stepper flow with validation.
* Then Outputs + export/copy.
* Only then add optional AI rewrite endpoint.

Keep it shippable. No premature architecture.

```
```
