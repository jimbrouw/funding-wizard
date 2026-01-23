export type RouteStatus = "active" | "placeholder";

export type Route = {
  id: string;
  title: string;
  status: RouteStatus;
};

export type Step = {
  id: string;
  title: string;
  intro?: string;
};

export type ChoiceOption = { value: string; label: string };

export type QuestionBase = {
  id: string;
  type: string;
  label: string;
  help?: string;
  required?: boolean;
  tags?: string[];
  outputSlots?: string[];
};

export type ChoiceQuestion = QuestionBase & {
  type: "choice" | "multi_choice";
  choices: ChoiceOption[];
};

export type TextQuestion = QuestionBase & {
  type: "text_short" | "text_long";
  placeholder?: string;
  maxChars?: number;
};

export type NumberQuestion = QuestionBase & {
  type: "number" | "currency_gbp";
  min?: number;
  max?: number;
};

export type DateQuestion = QuestionBase & {
  type: "date";
};

export type TableQuestion = QuestionBase & {
  type: "table";
  columns: {
    key: string;
    label: string;
    type: "text" | "number" | "currency_gbp" | "date"
  }[];
  minRows?: number;
  maxRows?: number;
};

export type Question =
  | ChoiceQuestion
  | TextQuestion
  | NumberQuestion
  | DateQuestion
  | TableQuestion;

export type AnswerValue =
  | string
  | number
  | string[]
  | Record<string, any>[]
  | null;

export type Answers = Record<string, AnswerValue>;

export type OutputSlot = {
  id: string;
  title: string;
  type: "paragraph" | "bullets" | "table";
  grantiumFieldId?: string;   // paste target id
  maxChars?: number;          // character limit
  requiredInputs?: string[];  // question ids required to produce output
  template?: string[];        // rule-based assembly lines
  sourceSteps?: string[];     // used for “Edit inputs” navigation
};

export type OutputStatus = "complete" | "incomplete" | "over_limit";

export type MissingItem =
  | { kind: "question"; stepId: string; questionId: string; label: string }
  | { kind: "output"; slotId: string; title: string; missingInputs: string[] };
