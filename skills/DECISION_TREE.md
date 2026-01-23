# DECISION_TREE.md

**Status: CONTRACT**

## Routing Logic

### Initial Gating
```
IF user location != "England" OR user has_no_uk_bank_account == true
THEN
    BLOCK: Route Selection
    REDIRECT: "Eligibility Block" Screen
    OFFER: "Export current answers"
```

### Route Picker Quiz
```
IF goal == "practice_development" OR goal == "research"
THEN
    RECOMMEND: "ACE Developing Your Creative Practice (DYCP)"
    STATUS: Placeholder (v0.1)

IF goal == "public_facing_project" OR goal == "event"
THEN
    RECOMMEND: "ACE Project Grants"
    STATUS: Active (v0.1)

IF goal == "unknown" OR "not_sure"
THEN
    REDIRECT: Question designed to find "Public Output" vs "Self Development"
```

## Question Gating (Step-Level)
- Every Step in the stepper has a `required_count`.
- If `required_count` for Current Step is not met, the "Next" button is disabled.
- Display context-specific error messages (e.g., "Please describe your project location to continue").
