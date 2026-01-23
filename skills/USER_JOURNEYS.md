# USER_JOURNEYS.md

**Status: CONTRACT**

## Journey 1: First-time ACE applicant
*The user needs guidance on which fund to pick and how to answer.*
1. **Start Screen** → User enters basic info (Individual, England, etc.).
2. **Qualifying Quiz** → User answers questions about project goals.
3. **Route Recommendation** → AI suggests ACE Project Grants.
4. **ACE PG Stepper** → User follows the 6-step wizard (Fit, Plan, Write, Budget, Risk, Submit).
5. **Outputs Screen** → User reviews drafted sections and missing info.
6. **Export/Copy** → User copies text for Grantium or downloads `answers.json`.

## Journey 2: Knows fund already
*The user wants to skip the quiz and get straight to the writing.*
1. **Start Screen** → User enters basic info.
2. **Route Picker** → User skips the "Help me choose" quiz and picks "ACE Project Grants" directly.
3. **ACE PG Stepper** → User proceeds through the wizard.
4. **Outputs Screen** → Final review and export.

## Journey 3: Not eligible
*The user identifies early as someone ACE won't fund.*
1. **Start Screen** → User selects "Location: Scotland" or "Organisation" (if targeting Individual-only fund).
2. **Eligibility Gating** → Logic detects mismatch.
3. **Block Screen** → App shows "ACE (England) not eligible" message.
4. **Alternative Route** → User is offered the choice to "Export answers anyway" or view placeholder links for other funders.
