# COMPONENT_PROPS.md — Vibe Cheque v0.1 (contracts)

## Principles
- Components are dumb. Data + rules live in `/content` and `src/lib`.
- No component should hardcode fund logic, question text, or output text.
- Props use stable IDs (`routeId`, `stepId`, `questionId`, `slotId`).

---

## Types (shared)
### Route
```ts
type Route = {
  id: string;
  title: string;
  status: "active" | "placeholder";
};
```

### Step

```ts
type Step = {
  id: string;
  title: string;
  intro?: string;
};
```

### QuestionChoice

```ts
type QuestionChoice = {
  value: string;
  label: string;
};
```

### Question

```ts
type Question =
  | {
      id: string;
      type: "choice";
      label: string;
      help?: string;
      required?: boolean;
      choices: QuestionChoice[];
      outputSlots?: string[];
    }
  | {
      id: string;
      type: "multi_choice";
      label: string;
      help?: string;
      required?: boolean;
      choices: QuestionChoice[];
      outputSlots?: string[];
    }
  | {
      id: string;
      type: "text_short" | "text_long";
      label: string;
      help?: string;
      required?: boolean;
      maxChars?: number;
      outputSlots?: string[];
    }
  | {
      id: string;
      type: "number" | "currency_gbp";
      label: string;
      help?: string;
      required?: boolean;
      min?: number;
      max?: number;
      outputSlots?: string[];
    };
```

### OutputSlot

```ts
type OutputSlot = {
  id: string;
  title: string;
  category?: string; // e.g. "Grantium paste map"
  grantiumFieldId?: string; // e.g. "project_summary_300"
  maxChars?: number;
  maxWords?: number;
  requiredInputs?: string[]; // question IDs
  template?: string[]; // rule-based assembly lines
  tableId?: string; // for table outputs
};
```

### Answers

```ts
type Answers = Record<string, unknown>;
```

### OutputState

```ts
type OutputState = {
  slotId: string;
  status: "complete" | "incomplete";
  text: string; // may be empty if incomplete
  missingInputs?: string[];
  currentLength?: number; // chars or words
};
```

---

## Component contracts

## `<AppShell />`

Wraps all pages with header/footer/actions.

**Props**

```ts
type AppShellProps = {
  children: React.ReactNode;
  canExport: boolean;
  onExportAnswers: () => void;
  canCopyOutputs: boolean;
  onCopyOutputs: () => void;
};
```

**Rules**

* Must not import content JSON directly.
* Buttons reflect disabled states from props.

---

## `<ProfileForm />`

Collects profile values used for eligibility/routing.

**Props**

```ts
type ProfileFormProps = {
  value: {
    applicantType?: "individual" | "collective" | "organisation";
    discipline?: string;
    location?: "england" | "not_england";
    knowsFund?: "yes" | "not_sure";
  };
  onChange: (next: ProfileFormProps["value"]) => void;
  onSubmit: () => void;
  errors?: Partial<Record<keyof ProfileFormProps["value"], string>>;
};
```

---

## `<RouteChooser />`

Shows direct route buttons (active + placeholders).

**Props**

```ts
type RouteChooserProps = {
  routes: Route[];
  onSelectRoute: (routeId: string) => void;
};
```

---

## `<QualifyingQuiz />`

Renders quiz questions from JSON and returns answers.

**Props**

```ts
type QualifyingQuizProps = {
  questions: Question[];
  value: Answers;
  onChange: (next: Answers) => void;
  onRecommend: () => void;
  recommendation?: { routeId: string; reason: string } | null;
};
```

---

## `<Stepper />`

Displays step navigation.

**Props**

```ts
type StepperProps = {
  steps: Step[];
  currentStepId: string;
  onNavigate: (stepId: string) => void;
};
```

**Rules**

* No validation logic inside Stepper.
* Stepper is purely presentational.

---

## `<ProgressBar />`

**Props**

```ts
type ProgressBarProps = {
  currentIndex: number; // 0-based
  total: number;
};
```

---

## `<QuestionRenderer />`

Renders one question.

**Props**

```ts
type QuestionRendererProps = {
  question: Question;
  value: unknown;
  onChange: (next: unknown) => void;
  error?: string | null;
};
```

**Rules**

* Must render based on `question.type` only.
* Must render label/help and error container.
* Must be accessible (label-for / aria-describedby).

---

## `<QuestionGroup />`

Renders all questions for a step.

**Props**

```ts
type QuestionGroupProps = {
  stepId: string;
  questions: Question[];
  answers: Answers;
  errors: Record<string, string | null>;
  onAnswerChange: (questionId: string, value: unknown) => void;
};
```

---

## `<OutputsMiniPreview />`

Shows a small list of affected output slots.

**Props**

```ts
type OutputsMiniPreviewProps = {
  slots: OutputSlot[];
  outputs: OutputState[];
  onOpenOutputs: () => void;
};
```

**Rules**

* Must display `grantiumFieldId` + `maxChars` where present.

---

## `<NavButtons />`

Back/Next buttons for the wizard.

**Props**

```ts
type NavButtonsProps = {
  onBack: () => void;
  onNext: () => void;
  nextDisabled: boolean;
  nextHint?: string;
};
```

---

## `<MissingInfoList />`

Lists missing required answers and incomplete output slots.

**Props**

```ts
type MissingInfoListProps = {
  missingQuestions: Array<{ stepId: string; questionId: string; label: string }>;
  missingSlots: Array<{ slotId: string; title: string; missingInputs: string[] }>;
  onGoToQuestion: (stepId: string, questionId: string) => void;
  onGoToSlotInputs: (slotId: string) => void;
};
```

---

## `<OutputCard />`

Shows a single generated output and paste mapping.

**Props**

```ts
type OutputCardProps = {
  slot: OutputSlot;
  output: OutputState;
  onCopy: () => void;
  onEditInputs: () => void;
  onRewrite?: () => void; // optional if AI enabled
  onCondense?: () => void; // optional if over limit
};
```

**Rules**

* Must show:

  * Paste target (grantiumFieldId)
  * Limit (maxChars/maxWords)
  * Current length
  * Status
* Buttons must be disabled when status is incomplete.

---

## `<TableCard />`

Renders a table output and copy-as-CSV.

**Props**

```ts
type TableCardProps = {
  title: string;
  pasteTarget?: string;
  rows: Array<Record<string, string | number>>;
  onCopyCsv: () => void;
};
```

---

## Utility contracts (non-UI)

### `engine.ts`

Must expose:

* `validateStep(questions, answers) -> { errors, isValid }`
* `computeOutputs(slots, answers) -> OutputState[]`
* `computeMissingInfo(questionsByStep, slots, answers, outputs) -> { missingQuestions, missingSlots }`
* `recommendRoute(profile, quizAnswers, routesJson) -> { routeId, reason }`

### `export.ts`

Must expose:

* `downloadJson(filename, obj)`
* `copyToClipboard(text)`

---

## Done criteria for contracts

* No component imports `content/*.json` directly except page-level loaders.
* All strings for question labels/help come from JSON or WIREFRAME_COPY only.
* Output cards always show paste target + limit when present.
