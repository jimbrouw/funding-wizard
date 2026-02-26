"use client";

import React, { useState } from "react";

type AlertCategory = {
    id: string;
    label: string;
    description: string;
    suffixes: string[];
};

const ALERT_CATEGORIES: AlertCategory[] = [
    {
        id: "open_calls",
        label: "Open calls & commissions",
        description: "Catch new opportunities as they're posted",
        suffixes: [
            "open call", "commission", "call for artists", "call for proposals",
            "call for submissions", "call for applications", "open submission",
            "expression of interest", "EOI", "brief for artists",
        ],
    },
    {
        id: "funding",
        label: "Grants & funding",
        description: "Grant announcements and funding rounds",
        suffixes: [
            "grant", "funding", "bursary", "award", "fund",
            "grant opportunity", "funding opportunity", "micro grant",
            "seed funding", "project grant", "development grant",
            "emergency fund", "hardship fund", "innovation fund",
        ],
    },
    {
        id: "residencies",
        label: "Residencies & fellowships",
        description: "Creative residencies and development programmes",
        suffixes: [
            "artist residency", "fellowship", "creative residency",
            "residency programme", "artist fellowship", "creative fellowship",
            "writer residency", "studio residency", "international residency",
        ],
    },
    {
        id: "competitions",
        label: "Competitions & prizes",
        description: "Awards, prizes, and competitive opportunities",
        suffixes: [
            "art prize", "arts prize", "competition", "creative competition",
            "emerging artist prize", "photography prize", "film prize",
            "short film competition", "arts award", "young artist award",
        ],
    },
    {
        id: "workshops",
        label: "Training & development",
        description: "Workshops, mentoring, and professional development",
        suffixes: [
            "artist workshop", "creative workshop", "mentorship",
            "professional development", "masterclass", "training opportunity",
            "creative mentoring", "skills development",
        ],
    },
    {
        id: "industry",
        label: "Industry news & policy",
        description: "Stay current on sector developments",
        suffixes: [
            "arts funding news", "arts council", "creative industries",
            "arts policy", "cultural strategy", "arts sector",
            "DCMS arts", "cultural funding", "arts investment",
        ],
    },
];

const DISCIPLINE_KEYWORDS: Record<string, { label: string; keywords: string[] }> = {
    visual_arts: {
        label: "Visual Arts",
        keywords: [
            "visual arts", "painting", "sculpture", "photography", "printmaking",
            "installation art", "contemporary art", "fine art", "illustration",
            "ceramics", "textiles", "mixed media art", "drawing", "digital art",
            "conceptual art", "public art", "mural", "gallery",
        ],
    },
    film: {
        label: "Film & Moving Image",
        keywords: [
            "film", "filmmaking", "short film", "documentary", "moving image",
            "cinema", "animation", "screenwriting", "film production",
            "video art", "experimental film", "feature film", "post-production",
            "film festival", "independent film", "narrative film",
        ],
    },
    music: {
        label: "Music & Sound",
        keywords: [
            "music", "composer", "sound art", "live music", "music production",
            "musician", "songwriter", "new music", "contemporary music",
            "electronic music", "classical music", "jazz", "sound design",
            "music composition", "orchestral", "choral", "sound installation",
            "audio art", "experimental music",
        ],
    },
    theatre: {
        label: "Theatre & Performance",
        keywords: [
            "theatre", "drama", "performance", "stage", "playwriting",
            "performing arts", "theatre production", "devised theatre",
            "physical theatre", "puppetry", "circus", "cabaret",
            "spoken word", "comedy", "stand-up", "musical theatre",
            "immersive theatre", "site-specific performance", "fringe",
        ],
    },
    dance: {
        label: "Dance & Movement",
        keywords: [
            "dance", "choreography", "contemporary dance", "ballet",
            "dance artist", "movement", "dance theatre", "dance film",
            "hip hop dance", "street dance", "folk dance", "dance company",
            "dance residency", "dance commission",
        ],
    },
    literature: {
        label: "Literature & Writing",
        keywords: [
            "literature", "creative writing", "poetry", "fiction",
            "writer", "author", "literary", "publishing", "book",
            "storytelling", "narrative", "non-fiction", "playwright",
            "literary magazine", "spoken word poetry", "writer's residency",
        ],
    },
    craft: {
        label: "Craft & Design",
        keywords: [
            "craft", "design", "applied arts", "maker", "craftsperson",
            "furniture design", "jewellery design", "glass art", "woodwork",
            "metalwork", "weaving", "embroidery", "product design",
            "industrial design", "fashion design", "sustainable design",
        ],
    },
    digital: {
        label: "Digital & Tech Arts",
        keywords: [
            "digital art", "new media", "creative technology", "interactive art",
            "VR art", "AR art", "immersive experience", "creative coding",
            "generative art", "AI art", "tech art", "digital culture",
            "games art", "XR", "virtual reality experience",
        ],
    },
    community: {
        label: "Community & Participatory",
        keywords: [
            "community arts", "participatory arts", "socially engaged art",
            "community engagement", "outreach", "co-creation",
            "arts education", "youth arts", "arts and health",
            "disability arts", "inclusive arts", "accessible arts",
            "intergenerational", "placemaking",
        ],
    },
    mixed: {
        label: "Interdisciplinary",
        keywords: [
            "interdisciplinary art", "cross-artform", "multidisciplinary",
            "hybrid arts", "transdisciplinary", "collaborative art",
            "live art", "time-based media", "experimental art",
        ],
    },
};

const EXTRA_KEYWORDS = [
    // Funders & bodies
    "Arts Council England",
    "Arts Council",
    "British Council arts",
    "Wellcome Trust arts",
    "Paul Hamlyn Foundation",
    "Esmée Fairbairn Foundation",
    "Jerwood Arts",
    "Bloomberg Philanthropies arts",
    "Heritage Fund",
    "Lottery funding",
    "National Lottery",
    // Geographic
    "UK arts",
    "England arts",
    "London arts",
    "Manchester arts",
    "Birmingham arts",
    "Bristol arts",
    "Leeds arts",
    "North West arts",
    "South West arts",
    "East Midlands arts",
    "Yorkshire arts",
    // Demographic
    "emerging artist",
    "early career artist",
    "BIPOC artist",
    "disabled artist",
    "women in arts",
    "LGBTQ+ artist",
    "young artist",
    "over 60 artist",
    // Type
    "new work",
    "cultural fund",
    "creative project",
    "R&D funding arts",
    "touring grant",
    "exhibition funding",
    "festival funding",
    "public realm art",
    "arts and health fund",
];

type GeneratedAlert = {
    query: string;
    url: string;
    category: string;
    copied: boolean;
};

export default function GoogleAlertsBuilder() {
    const [selectedDisciplines, setSelectedDisciplines] = useState<string[]>([]);
    const [selectedCategories, setSelectedCategories] = useState<string[]>(["open_calls", "funding"]);
    const [customKeyword, setCustomKeyword] = useState("");
    const [customKeywords, setCustomKeywords] = useState<string[]>([]);
    const [generatedAlerts, setGeneratedAlerts] = useState<GeneratedAlert[]>([]);
    const [showResults, setShowResults] = useState(false);
    const [copiedAll, setCopiedAll] = useState(false);

    const toggleDiscipline = (id: string) => {
        setSelectedDisciplines((prev) =>
            prev.includes(id) ? prev.filter((d) => d !== id) : [...prev, id]
        );
    };

    const toggleCategory = (id: string) => {
        setSelectedCategories((prev) =>
            prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
        );
    };

    const addCustomKeyword = () => {
        const trimmed = customKeyword.trim();
        if (trimmed && !customKeywords.includes(trimmed)) {
            setCustomKeywords((prev) => [...prev, trimmed]);
            setCustomKeyword("");
        }
    };

    const removeCustomKeyword = (kw: string) => {
        setCustomKeywords((prev) => prev.filter((k) => k !== kw));
    };

    const copyToClipboard = async (text: string, index: number) => {
        try {
            await navigator.clipboard.writeText(text);
            setGeneratedAlerts((prev) =>
                prev.map((a, i) => (i === index ? { ...a, copied: true } : a))
            );
            setTimeout(() => {
                setGeneratedAlerts((prev) =>
                    prev.map((a, i) => (i === index ? { ...a, copied: false } : a))
                );
            }, 2000);
        } catch {
            // Fallback
            const el = document.createElement("textarea");
            el.value = text;
            document.body.appendChild(el);
            el.select();
            document.execCommand("copy");
            document.body.removeChild(el);
        }
    };

    const copyAllToClipboard = async () => {
        const allQueries = generatedAlerts.map((a) => a.query).join("\n");
        try {
            await navigator.clipboard.writeText(allQueries);
            setCopiedAll(true);
            setTimeout(() => setCopiedAll(false), 2500);
        } catch {
            const el = document.createElement("textarea");
            el.value = allQueries;
            document.body.appendChild(el);
            el.select();
            document.execCommand("copy");
            document.body.removeChild(el);
            setCopiedAll(true);
            setTimeout(() => setCopiedAll(false), 2500);
        }
    };

    const generateAlerts = () => {
        const alerts: GeneratedAlert[] = [];
        const seen = new Set<string>();

        // Get ALL keywords from selected disciplines
        const baseKeywords: string[] = [];
        selectedDisciplines.forEach((d) => {
            const disc = DISCIPLINE_KEYWORDS[d];
            if (disc) {
                // Use the first 4 keywords from each discipline for breadth
                baseKeywords.push(...disc.keywords.slice(0, 4));
            }
        });

        // Add custom keywords
        baseKeywords.push(...customKeywords);

        // If nothing selected, use generic
        if (baseKeywords.length === 0) {
            baseKeywords.push("arts", "creative", "artist");
        }

        // Generate alerts: each category × each base keyword × each suffix variation
        const activeCats = ALERT_CATEGORIES.filter((c) => selectedCategories.includes(c.id));

        activeCats.forEach((cat) => {
            // Use ALL suffixes per category for maximum coverage
            const suffixesToUse = cat.suffixes;

            baseKeywords.forEach((base) => {
                suffixesToUse.forEach((suffix) => {
                    const query = `"${base}" "${suffix}"`;
                    if (!seen.has(query)) {
                        seen.add(query);
                        const url = `https://www.google.com/alerts#1:1:${encodeURIComponent(query)}`;
                        alerts.push({ query, category: cat.label, url, copied: false });
                    }
                });
            });
        });

        setGeneratedAlerts(alerts);
        setShowResults(true);
    };

    const allDisciplines = Object.entries(DISCIPLINE_KEYWORDS).map(([id, data]) => ({
        id,
        label: data.label,
        preview: data.keywords.slice(0, 3).join(", "),
        count: data.keywords.length,
    }));

    return (
        <div className="space-y-10">
            {/* Step 1: Discipline */}
            <section className="space-y-4">
                <div className="space-y-1">
                    <div className="flex items-center gap-2">
                        <span className="w-7 h-7 bg-slate-900 text-white rounded-lg flex items-center justify-center text-xs font-black">1</span>
                        <h2 className="text-xl font-black text-slate-900">Pick your disciplines</h2>
                    </div>
                    <p className="text-sm text-slate-500 ml-9">Select what you work in. We'll build keywords around these.</p>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 ml-9">
                    {allDisciplines.map((d) => (
                        <button
                            key={d.id}
                            onClick={() => toggleDiscipline(d.id)}
                            className={`px-4 py-4 text-left rounded-2xl border-2 transition-all ${selectedDisciplines.includes(d.id)
                                ? "border-slate-900 bg-slate-900 text-white shadow-lg scale-[1.02]"
                                : "border-slate-100 bg-white text-slate-600 hover:border-slate-200"
                                }`}
                        >
                            <span className="text-sm font-bold block">{d.label}</span>
                            <span className={`text-xs mt-0.5 block leading-relaxed ${selectedDisciplines.includes(d.id) ? "text-slate-300" : "text-slate-400"}`}>
                                {d.preview}
                            </span>
                            <span className={`text-[10px] mt-1 block font-bold ${selectedDisciplines.includes(d.id) ? "text-slate-400" : "text-slate-300"}`}>
                                {d.count} keywords
                            </span>
                        </button>
                    ))}
                </div>
            </section>

            {/* Step 2: Alert Categories */}
            <section className="space-y-4">
                <div className="space-y-1">
                    <div className="flex items-center gap-2">
                        <span className="w-7 h-7 bg-slate-900 text-white rounded-lg flex items-center justify-center text-xs font-black">2</span>
                        <h2 className="text-xl font-black text-slate-900">What are you looking for?</h2>
                    </div>
                    <p className="text-sm text-slate-500 ml-9">Pick the types of opportunities you want delivered to your inbox.</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 ml-9">
                    {ALERT_CATEGORIES.map((cat) => (
                        <button
                            key={cat.id}
                            onClick={() => toggleCategory(cat.id)}
                            className={`p-5 text-left rounded-2xl border-2 transition-all ${selectedCategories.includes(cat.id)
                                ? "border-slate-900 bg-slate-900 text-white shadow-lg scale-[1.01]"
                                : "border-slate-100 bg-white text-slate-600 hover:border-slate-200"
                                }`}
                        >
                            <span className="text-sm font-bold block">{cat.label}</span>
                            <span className={`text-xs mt-1 block leading-relaxed ${selectedCategories.includes(cat.id) ? "text-slate-300" : "text-slate-400"}`}>
                                {cat.description}
                            </span>
                            <span className={`text-[10px] mt-1 block font-bold ${selectedCategories.includes(cat.id) ? "text-slate-400" : "text-slate-300"}`}>
                                {cat.suffixes.length} search terms
                            </span>
                        </button>
                    ))}
                </div>
            </section>

            {/* Step 3: Custom Keywords */}
            <section className="space-y-4">
                <div className="space-y-1">
                    <div className="flex items-center gap-2">
                        <span className="w-7 h-7 bg-slate-900 text-white rounded-lg flex items-center justify-center text-xs font-black">3</span>
                        <h2 className="text-xl font-black text-slate-900">Add your own keywords</h2>
                    </div>
                    <p className="text-sm text-slate-500 ml-9">Optional. Add specific terms — a funder name, a niche, a location.</p>
                </div>
                <div className="ml-9 space-y-4">
                    <div className="flex gap-2">
                        <input
                            type="text"
                            value={customKeyword}
                            onChange={(e) => setCustomKeyword(e.target.value)}
                            onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addCustomKeyword(); } }}
                            placeholder="e.g. 'South West England' or 'Wellcome Trust'"
                            className="flex-1 px-5 py-3 rounded-2xl border-2 border-slate-100 bg-white text-slate-900 font-bold placeholder:text-slate-300 outline-none focus:border-slate-900 transition-all"
                        />
                        <button
                            onClick={addCustomKeyword}
                            className="px-5 py-3 bg-slate-900 text-white font-black rounded-2xl hover:bg-slate-800 transition-all shadow-sm"
                        >
                            Add
                        </button>
                    </div>
                    {customKeywords.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                            {customKeywords.map((kw) => (
                                <span
                                    key={kw}
                                    className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-700 rounded-xl text-sm font-bold"
                                >
                                    {kw}
                                    <button
                                        onClick={() => removeCustomKeyword(kw)}
                                        className="text-slate-400 hover:text-red-500 transition-colors"
                                    >
                                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </span>
                            ))}
                        </div>
                    )}

                    {/* Quick-add suggestions — grouped */}
                    <div className="space-y-3">
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Funders & bodies</p>
                        <div className="flex flex-wrap gap-2">
                            {EXTRA_KEYWORDS.slice(0, 11).filter((kw) => !customKeywords.includes(kw)).map((kw) => (
                                <button
                                    key={kw}
                                    onClick={() => setCustomKeywords((prev) => [...prev, kw])}
                                    className="px-3 py-1.5 bg-white border border-slate-200 text-slate-500 rounded-lg text-xs font-bold hover:border-slate-400 hover:text-slate-700 transition-all"
                                >
                                    + {kw}
                                </button>
                            ))}
                        </div>

                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Regions</p>
                        <div className="flex flex-wrap gap-2">
                            {EXTRA_KEYWORDS.slice(11, 22).filter((kw) => !customKeywords.includes(kw)).map((kw) => (
                                <button
                                    key={kw}
                                    onClick={() => setCustomKeywords((prev) => [...prev, kw])}
                                    className="px-3 py-1.5 bg-white border border-slate-200 text-slate-500 rounded-lg text-xs font-bold hover:border-slate-400 hover:text-slate-700 transition-all"
                                >
                                    + {kw}
                                </button>
                            ))}
                        </div>

                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Demographics</p>
                        <div className="flex flex-wrap gap-2">
                            {EXTRA_KEYWORDS.slice(22, 30).filter((kw) => !customKeywords.includes(kw)).map((kw) => (
                                <button
                                    key={kw}
                                    onClick={() => setCustomKeywords((prev) => [...prev, kw])}
                                    className="px-3 py-1.5 bg-white border border-slate-200 text-slate-500 rounded-lg text-xs font-bold hover:border-slate-400 hover:text-slate-700 transition-all"
                                >
                                    + {kw}
                                </button>
                            ))}
                        </div>

                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Opportunity types</p>
                        <div className="flex flex-wrap gap-2">
                            {EXTRA_KEYWORDS.slice(30).filter((kw) => !customKeywords.includes(kw)).map((kw) => (
                                <button
                                    key={kw}
                                    onClick={() => setCustomKeywords((prev) => [...prev, kw])}
                                    className="px-3 py-1.5 bg-white border border-slate-200 text-slate-500 rounded-lg text-xs font-bold hover:border-slate-400 hover:text-slate-700 transition-all"
                                >
                                    + {kw}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Generate Button */}
            <div className="ml-9">
                <button
                    onClick={generateAlerts}
                    disabled={selectedCategories.length === 0}
                    className={`w-full py-5 rounded-2xl text-lg font-black transition-all ${selectedCategories.length > 0
                        ? "bg-gradient-to-r from-violet-600 to-indigo-600 text-white hover:from-violet-700 hover:to-indigo-700 shadow-xl shadow-violet-200 hover:scale-[1.01] active:scale-[0.99]"
                        : "bg-slate-100 text-slate-400 cursor-not-allowed"
                        }`}
                >
                    Generate my alerts
                </button>
            </div>

            {/* Results */}
            {showResults && generatedAlerts.length > 0 && (
                <section className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="h-px bg-slate-200" />

                    <div className="flex items-start justify-between gap-4">
                        <div className="space-y-2">
                            <h2 className="text-2xl font-black text-slate-900">
                                Your alerts
                                <span className="text-lg text-slate-400 font-bold ml-2">({generatedAlerts.length})</span>
                            </h2>
                            <p className="text-sm text-slate-500 max-w-xl">
                                Click <strong>Copy</strong> to copy the search term to your clipboard, then paste it into Google Alerts. Or click the link icon to open Google Alerts directly.
                            </p>
                        </div>
                        <button
                            onClick={copyAllToClipboard}
                            className={`shrink-0 px-5 py-3 rounded-2xl text-sm font-black transition-all ${copiedAll
                                ? "bg-emerald-500 text-white"
                                : "bg-slate-900 text-white hover:bg-slate-800 shadow-sm"
                                }`}
                        >
                            {copiedAll ? "✓ All copied!" : "Copy all"}
                        </button>
                    </div>

                    <div className="space-y-2">
                        {generatedAlerts.map((alert, i) => (
                            <div
                                key={i}
                                className="group flex items-center gap-3 p-4 bg-white border-2 border-slate-100 rounded-2xl hover:border-slate-200 transition-all"
                            >
                                {/* Alert info */}
                                <div className="min-w-0 flex-1 space-y-0.5">
                                    <p className="text-sm font-black text-slate-900 font-mono truncate">{alert.query}</p>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{alert.category}</p>
                                </div>

                                {/* Copy button */}
                                <button
                                    onClick={() => copyToClipboard(alert.query, i)}
                                    className={`shrink-0 px-4 py-2 rounded-xl text-xs font-black transition-all ${alert.copied
                                        ? "bg-emerald-100 text-emerald-700 border border-emerald-200"
                                        : "bg-slate-100 text-slate-600 hover:bg-slate-200 border border-transparent"
                                        }`}
                                >
                                    {alert.copied ? (
                                        <span className="flex items-center gap-1">
                                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                                            </svg>
                                            Copied
                                        </span>
                                    ) : (
                                        <span className="flex items-center gap-1">
                                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2" />
                                            </svg>
                                            Copy
                                        </span>
                                    )}
                                </button>

                                {/* Open in Google Alerts */}
                                <a
                                    href={alert.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    onClick={() => copyToClipboard(alert.query, i)}
                                    title="Open Google Alerts — keyword also copied to clipboard"
                                    className="shrink-0 w-9 h-9 rounded-xl bg-violet-50 text-violet-600 hover:bg-violet-100 flex items-center justify-center transition-all"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                    </svg>
                                </a>
                            </div>
                        ))}
                    </div>

                    {/* Pro tips */}
                    <div className="p-6 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
                        <h3 className="text-sm font-black text-slate-900">How to use these</h3>
                        <ol className="space-y-2 text-sm text-slate-600 leading-relaxed list-decimal list-inside">
                            <li><strong>Click "Copy"</strong> next to any alert to copy the search term to your clipboard.</li>
                            <li><strong>Open <a href="https://www.google.com/alerts" target="_blank" rel="noopener noreferrer" className="text-violet-600 underline font-bold">Google Alerts</a></strong> and sign in with your Google account.</li>
                            <li><strong>Paste</strong> (Cmd+V) the keyword into the search box and hit "Create Alert".</li>
                            <li>Repeat for as many alerts as you want. <strong>Google allows up to 1,000 alerts</strong> per account.</li>
                        </ol>
                    </div>

                    <div className="p-6 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
                        <h3 className="text-sm font-black text-slate-900">Pro tips</h3>
                        <ul className="space-y-2 text-sm text-slate-600 leading-relaxed">
                            <li className="flex items-start gap-2">
                                <span className="shrink-0 mt-1 w-1.5 h-1.5 bg-violet-500 rounded-full" />
                                <span><strong>Set frequency to "As-it-happens"</strong> for time-sensitive calls, or "Once a day" for general news.</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="shrink-0 mt-1 w-1.5 h-1.5 bg-violet-500 rounded-full" />
                                <span><strong>Start with 10-15 alerts.</strong> Too many = inbox noise. Add more once you know which ones deliver.</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="shrink-0 mt-1 w-1.5 h-1.5 bg-violet-500 rounded-full" />
                                <span><strong>Refine monthly.</strong> Delete alerts that only bring noise. Add new ones when you spot trends.</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="shrink-0 mt-1 w-1.5 h-1.5 bg-violet-500 rounded-full" />
                                <span><strong>Quotes mean exact phrases</strong> (we've done this for you). Without quotes, Google matches words separately.</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="shrink-0 mt-1 w-1.5 h-1.5 bg-violet-500 rounded-full" />
                                <span><strong>Don't just Google for grants.</strong> You'll find expired deadlines and winner announcements. Alerts deliver live leads to you.</span>
                            </li>
                        </ul>
                    </div>
                </section>
            )}
        </div>
    );
}
