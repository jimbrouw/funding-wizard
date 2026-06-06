import { GrantEngineState } from "./types";

export const SEEDED_PROJECT_ID = "11111111-1111-4111-8111-111111111111";
export const SEEDED_GRANT_ID = "22222222-2222-4222-8222-222222222222";
export const SEEDED_PROJECT_GRANT_ID = "33333333-3333-4333-8333-333333333333";

export function createSeedState(): GrantEngineState {
    return {
        projects: [
            {
                id: SEEDED_PROJECT_ID,
                name: "CRT Memory Lab",
                rawIdea:
                    "A hands-on AV heritage project using CRT monitors, archive video, and workshops with Nottingham residents to build a small public installation.",
                concreteOutputs: "",
                budgetTotal: 18500,
                status: "draft",
            },
        ],
        grants: [
            {
                id: SEEDED_GRANT_ID,
                funderName: "Arts Council England",
                title: "National Lottery Project Grants",
                grantUrl: "https://www.artscouncil.org.uk/projectgrants",
                deadline: "2026-09-30",
                maxAmount: 30000,
                matchSummary:
                    "Likely fit for a time-limited public arts project with workshops, access costs, and clear audience outputs.",
                historicalFocus:
                    "Manual placeholder: public engagement, artist development, access planning, and credible delivery partnerships.",
                requirementsText:
                    "Requires a clear public-facing artistic or cultural project, defined activities, budget, timetable, access planning, audience benefit, and evidence that the applicant can deliver.",
                assessmentCriteria: [
                    {
                        id: "public_output",
                        label: "Public output",
                        detail: "The project must produce a clear public-facing result or audience experience.",
                    },
                    {
                        id: "delivery_plan",
                        label: "Delivery plan",
                        detail: "The application must show where and when activities happen and who is responsible.",
                    },
                    {
                        id: "budget_access",
                        label: "Budget and access",
                        detail: "Costs, access needs, and match funding must be explained with specific figures.",
                    },
                    {
                        id: "audience_benefit",
                        label: "Audience benefit",
                        detail: "The applicant must identify who benefits and how they know those people will be reached.",
                    },
                ],
                status: "active",
            },
        ],
        masterDataAssets: [
            {
                id: "44444444-4444-4444-8444-444444444444",
                assetType: "equipment_inventory",
                title: "AV equipment inventory",
                content:
                    "Available equipment includes CRT monitors, media players, cabling, small PA, projection screens, and portable video playback kit.",
            },
            {
                id: "55555555-5555-4555-8555-555555555555",
                assetType: "access_rider",
                title: "Access cost baseline",
                content:
                    "Access budget normally includes BSL or captioning when public talks are delivered, step-free venue checks, travel support, and documentation in plain English.",
            },
        ],
        projectGrants: [
            {
                id: SEEDED_PROJECT_GRANT_ID,
                projectId: SEEDED_PROJECT_ID,
                grantId: SEEDED_GRANT_ID,
                relationship: "selected",
                matchScore: 82,
            },
        ],
        interrogationQuestions: [],
        draftSections: [],
    };
}
