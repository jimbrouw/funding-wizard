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
                concreteOutputs: "A public installation, two archive AV workshops, and a plain-English process document.",
                budgetTotal: 18500,
                status: "interrogating",
            },
            {
                id: "11111111-1111-4111-8111-111111111112",
                name: "Archive AV Workshop",
                rawIdea: "A small workshop format for artists working with local archive video and public screening materials.",
                concreteOutputs: "Workshop and short public screening.",
                budgetTotal: null,
                status: "draft",
            },
            {
                id: "11111111-1111-4111-8111-111111111113",
                name: "Midlands Signal Room",
                rawIdea: "A touring listening room for regional broadcast histories and artist-led sound experiments.",
                concreteOutputs: "Touring listening room and facilitated public sessions.",
                budgetTotal: 24000,
                status: "ready_to_draft",
            },
            {
                id: "11111111-1111-4111-8111-111111111114",
                name: "Untitled idea",
                rawIdea: "Early notes for a future creative technology project.",
                concreteOutputs: "",
                budgetTotal: null,
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
            {
                id: "33333333-3333-4333-8333-333333333334",
                projectId: "11111111-1111-4111-8111-111111111112",
                grantId: SEEDED_GRANT_ID,
                relationship: "candidate",
                matchScore: 61,
            },
            {
                id: "33333333-3333-4333-8333-333333333335",
                projectId: "11111111-1111-4111-8111-111111111113",
                grantId: SEEDED_GRANT_ID,
                relationship: "candidate",
                matchScore: 78,
            },
            {
                id: "33333333-3333-4333-8333-333333333336",
                projectId: "11111111-1111-4111-8111-111111111114",
                grantId: SEEDED_GRANT_ID,
                relationship: "candidate",
                matchScore: null,
            },
        ],
        interrogationQuestions: [
            {
                id: "66666666-6666-4666-8666-666666666661",
                projectGrantId: SEEDED_PROJECT_GRANT_ID,
                criterionId: "concrete_output",
                question: "What is the concrete public output?",
                reason: "The funder needs a tangible result, not a theme.",
                required: true,
                status: "answered",
                answer: "A small public installation using CRT monitors, two facilitated archive AV workshops, and a short process document.",
            },
            {
                id: "66666666-6666-4666-8666-666666666662",
                projectGrantId: SEEDED_PROJECT_GRANT_ID,
                criterionId: "match_funding",
                question: "Where is the match funding or in-kind support coming from?",
                reason: "Budget credibility needs named sources or a clear zero-match explanation.",
                required: true,
                status: "answered",
                answer: "The project is planned as a full-cost request with in-kind equipment and volunteer archive support listed separately.",
            },
            {
                id: "66666666-6666-4666-8666-666666666663",
                projectGrantId: SEEDED_PROJECT_GRANT_ID,
                criterionId: "access_costs",
                question: "What is the access cost breakdown?",
                reason: "Access must be costed, not described as a general commitment.",
                required: true,
                status: "open",
                answer: "",
            },
            {
                id: "66666666-6666-4666-8666-666666666664",
                projectGrantId: SEEDED_PROJECT_GRANT_ID,
                criterionId: "timeline_risk",
                question: "What is the main timeline risk and how will you handle it?",
                reason: "Delivery risk needs a plain mitigation.",
                required: true,
                status: "answered",
                answer: "The main risk is equipment failure. The plan includes spare playback kit, a test week, and a simplified workshop fallback.",
            },
            {
                id: "66666666-6666-4666-8666-666666666665",
                projectGrantId: SEEDED_PROJECT_GRANT_ID,
                criterionId: "public_output",
                question: "What proof do you have for \"Public output\"?",
                reason: "The project must produce a clear public-facing result or audience experience.",
                required: true,
                status: "answered",
                answer: "The installation and workshop plan are public-facing outputs with a defined venue, audience format, and documentation route.",
            },
            {
                id: "66666666-6666-4666-8666-666666666666",
                projectGrantId: SEEDED_PROJECT_GRANT_ID,
                criterionId: "delivery_plan",
                question: "What proof do you have for \"Delivery plan\"?",
                reason: "The application must show where and when activities happen and who is responsible.",
                required: true,
                status: "answered",
                answer: "The project has named production roles, a draft six-week build period, and a workshop delivery window.",
            },
            {
                id: "66666666-6666-4666-8666-666666666667",
                projectGrantId: SEEDED_PROJECT_GRANT_ID,
                criterionId: "budget_access",
                question: "What proof do you have for \"Budget and access\"?",
                reason: "Costs, access needs, and match funding must be explained with specific figures.",
                required: true,
                status: "open",
                answer: "",
            },
            {
                id: "66666666-6666-4666-8666-666666666668",
                projectGrantId: SEEDED_PROJECT_GRANT_ID,
                criterionId: "audience_benefit",
                question: "What proof do you have for audience benefit?",
                reason: "The applicant must identify who benefits and how they know those people will be reached.",
                required: true,
                status: "open",
                answer: "",
            },
        ],
        draftSections: [],
    };
}
