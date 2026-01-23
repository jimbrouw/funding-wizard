# WIREFRAME_COPY.md — Funding Wizard v0.1 (microcopy pack)

## Global
### Header
- App name: **Funding Wizard**
- Buttons:
  - **Export JSON**
  - **Copy outputs**

### Footer
- Text: **Not official guidance. You are responsible for what you submit.**
- Text: **Version 0.1**

### Common UI copy
- Required label: **Required**
- Optional label: **Optional**
- Save (optional): **Save snapshot**
- Back: **Back**
- Next: **Next**
- Continue: **Continue**
- Continue anyway: **Continue anyway**
- Go fix: **Go fix this**
- Copy: **Copy**
- Copied state: **Copied**
- Export: **Export**
- Edit inputs: **Edit inputs**
- Rewrite (AI): **Rewrite (AI)**
- Condense to limit: **Condense to limit**

### Common help text patterns
- “Short is fine. Bullet points are fine.”
- “If you don’t know, write ‘Not sure’ rather than guessing.”
- “Don’t inflate numbers. Conservative estimates are fine.”

---

## Page: Start / Profile (`/`)
### H1
- **Start your application**

### Intro (2 lines)
- **Answer a few questions to pick the right route.**
- **This version supports Arts Council England routes only.**

### Card title
- **Profile**

### Q1
- Label: **Who are you applying as?**
- Options:
  - **Individual**
  - **Collective**
  - **Organisation**
- Help: **Pick the closest match. You can refine later.**

### Q2
- Label: **Main discipline**
- Options:
  - **Visual arts**
  - **Film**
  - **Music**
  - **Theatre**
  - **Mixed**
  - **Other**
- Help: **This affects what examples and wording we suggest.**

### Q3
- Label: **Where are you based?**
- Options:
  - **England**
  - **Not England**
- Help: **ACE National Lottery routes are for England.**

### Q4
- Label: **Do you already know the fund?**
- Options:
  - **Yes**
  - **Not sure**
- Help: **If you’re not sure, we’ll route you with a short quiz.**

### Primary CTA button (dynamic)
- If England + Yes: **Choose fund**
- If England + Not sure: **Find the right fund**
- If Not England: **See options**

### Validation messages
- Missing Q1: **Choose who you’re applying as.**
- Missing Q2: **Choose a discipline.**
- Missing Q3: **Choose a location.**
- Missing Q4: **Choose Yes or Not sure.**

---

## Page: Not eligible (`/not-eligible`)
### H1
- **This version only supports Arts Council England routes**

### Body
- **You can still use the question set as planning, but routing and paste targets are ACE-focused.**
- **If you want, export your answers and continue in another format.**

### Buttons
- **Export my answers (JSON)**
- **Back**

---

## Page: Route picker (`/route-picker`)
### H1
- **Choose your funding route**

### Card A title
- **I know the fund**

Buttons:
- **ACE Project Grants**
- **ACE DYCP (not in v0.1)**
- **Other funder (not in v0.1)**

Placeholder message:
- **This route isn’t built yet. Export your answers or pick ACE Project Grants.**

### Card B title
- **Help me choose**

### Quiz intro
- **Answer a couple of questions. We’ll recommend a route.**

### Quiz questions (v0.1 set)
Q1 label:
- **What best describes your goal?**
Options:
- **A time-limited project for an audience or public outcome**
- **My own development (skills, networks, research)**

Q2 label:
- **Is there a clear public-facing output?**
Options:
- **Yes**
- **No**
- **Not sure**

Q3 label:
- **Are you mainly applying as an individual?**
Options:
- **Yes**
- **No**

Button:
- **Recommend a route**

Recommendation panel:
- Title: **Recommended route**
- Explanation prefix: **Because:**
- CTA: **Start this route**

---

## Wizard stepper shared copy (`/wizard/ace_project_grants`)
### Top banner
- Route label: **Route**
- “ACE Project Grants”

### Step header
- “Step {n} of {total}”
- Step title from JSON
- Step intro from JSON

### Right sidebar: Outputs preview
Title:
- **Paste targets preview**
Subtitle:
- **These are the fields you’ll paste into later.**

Per item:
- **Paste target:** `{grantiumFieldId}`
- **Limit:** `{maxChars} characters`
- Status:
  - **Complete**
  - **Missing info**

### Validation summary banner (when blocked)
- **Fix {count} required answers to continue.**

### Back/Next area
- Next disabled text (tooltip or small text):
  - **Answer the required questions to continue.**

---

## Review page (`/review`)
### H1
- **Check what’s missing**

### Intro
- **This is a quick gap check before you generate drafts.**

### Section A title
- **Required answers missing**

Empty state:
- **No required answers missing.**

### Section B title
- **Draft sections missing info**

Empty state:
- **All draft sections have enough inputs.**

Buttons:
- **Go fix missing answers**
- **Continue anyway**

Warning (if continuing):
- **Some outputs will be incomplete.**

---

## Outputs page (`/outputs`)
### H1
- **Your draft outputs**

### Intro
- **Each card shows where to paste in Grantium and the character limit.**

### Action buttons
- **Copy all outputs**
- **Export answers JSON**
- **Export outputs JSON**

### Output card header copy
- **Paste target**
- **Limit**
- **Current length**
- Status:
  - **Complete**
  - **Incomplete**

Incomplete helper:
- **Missing information. Use “Edit inputs” to complete this section.**

Buttons:
- **Copy**
- **Rewrite (AI)**
- **Condense to limit**
- **Edit inputs**

Rewrite tooltip/help:
- **Rewrites for clarity only. No new facts added.**

Condense tooltip/help:
- **Trims to the limit without changing meaning.**

Tables section title
- **Tables**

Table helper:
- **Copy as CSV if you want to paste into spreadsheets.**

---

## Placeholder route page (`/wizard/placeholder`)
### H1
- **Not implemented in v0.1**

Body:
- **This route is planned, but not built yet.**
- **Choose ACE Project Grants or export your answers.**

Buttons:
- **Back to route picker**
- **Export answers JSON**
