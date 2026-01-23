# QUESTION_DESIGN_RULES.md

**Status: CONTRACT**

## Input Strategy
- **Multiple Choice:** Use when the funder has pre-defined categories or when the structure of an answer is fixed (e.g., "Primary Artform").
- **Short Text:** Use for specific, concrete details (e.g., "Project Title", "Lead Partner Name").
- **Long Text:** Use for narrative sections (e.g., "Artistic Case").

## Field Constraints
| Type | Rule |
| :--- | :--- |
| `text_short` | Max 50 words. Validates for plain language. |
| `text_long` | Max 400 words. Enforces paragraph/bullet structure. |
| `currency` | Only GBP (£). Blocks non-numeric input. |
| `date` | Standard UK format (DD/MM/YYYY). |

## Mandatory Fields
- Fields marked `required: true` in JSON must be answered before a user can proceed to the next step.
- Required fields map directly to "Critical Missing Info" on the Output screen.

## No Gap Filling
- If a user skips an optional field, the AI must NOT "guess" the content.
- AI is forbidden from adding "common sense" details that aren't in the user's input.
