"use client";

import React, { useState } from "react";
import Link from "next/link";

/* ── Sample Opportunities (preview of what subscribers get) ── */
const SAMPLE_OPPS = [
    {
        funder: "British Council",
        amount: "£7,000",
        type: "GRANT",
        sector: "Publishing",
        summary:
            "Speaking Volumes and the British Council are offering five grants for diverse-led UK literature organisations to develop international collaboration projects.",
    },
    {
        funder: "Kickstarter",
        amount: "£1,000 – £50,000",
        type: "CROWDFUNDING",
        sector: "Film",
        summary:
            "Long Story Short returns this March, giving short film creators a high-visibility crowdfunding moment with an 89% success rate.",
    },
    {
        funder: "Association of Independent Museums",
        amount: "£1,200 – £10,000",
        type: "GRANT",
        sector: "Museums",
        summary:
            "The AIM Pilgrim Trust Grant Scheme offers small UK museums grants for professional collections care, equipment, or staff training.",
    },
];

const WHAT_YOU_GET = [
    {
        icon: "🎯",
        title: "Curated Opportunities",
        desc: "5–8 hand-picked funding opportunities every fortnight, filtered for relevance and checked for live deadlines.",
    },
    {
        icon: "📖",
        title: "Storytelling Tips",
        desc: "One practical 'show don't tell' tip per issue to strengthen your next application narrative.",
    },
    {
        icon: "🔍",
        title: "Funder Intel",
        desc: "Insider research on who's funding what — board changes, new priorities, patterns from past winners.",
    },
    {
        icon: "⚡",
        title: "Early Alerts",
        desc: "New grants spotted on Instagram, funder websites, and sector newsletters — before you'd find them yourself.",
    },
];

export default function SubscribePage() {
    const [copied, setCopied] = useState(false);

    const handleCopyLink = () => {
        navigator.clipboard.writeText(window.location.href);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="space-y-16">
            {/* Hero */}
            <section className="text-center space-y-6 pt-4">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-emerald-50 text-emerald-700 text-xs font-bold uppercase tracking-widest rounded-full">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    Free · Fortnightly · No spam
                </div>

                <h1 className="text-4xl md:text-5xl font-black text-slate-900 leading-tight max-w-2xl mx-auto">
                    Get curated funding opportunities delivered to your inbox
                </h1>

                <p className="text-lg text-slate-600 max-w-xl mx-auto leading-relaxed">
                    Hand-picked grants, awards, and open calls for artists and
                    creative practitioners. Plus storytelling tips to help you
                    actually win them.
                </p>
            </section>

            {/* ── Beehiiv Embed Placeholder ── */}
            <section className="max-w-lg mx-auto">
                <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-8 text-center space-y-6 shadow-xl">
                    <h2 className="text-2xl font-black text-white">
                        Subscribe for free
                    </h2>
                    <p className="text-slate-400 text-sm">
                        Join artists and creatives getting the best funding
                        opportunities — straight to your inbox, fortnightly.
                    </p>

                    {/*
                     * ═══════════════════════════════════════════════════
                     * REPLACE THIS BLOCK WITH YOUR BEEHIIV EMBED CODE
                     *
                     * 1. Go to beehiiv.com and create a free account
                     * 2. Go to Audience → Subscribe Forms
                     * 3. Create a form, customise it
                     * 4. Click "Get embed code"
                     * 5. Paste the iframe/HTML here
                     * ═══════════════════════════════════════════════════
                     */}
                    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/10 space-y-4">
                        <div className="flex gap-3">
                            <input
                                type="email"
                                placeholder="your@email.com"
                                className="flex-1 px-4 py-3 rounded-xl bg-white text-slate-900 text-sm font-medium placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-emerald-400"
                                disabled
                            />
                            <button
                                className="px-6 py-3 bg-emerald-500 hover:bg-emerald-400 text-white text-sm font-black rounded-xl transition-all shadow-lg shadow-emerald-500/25 cursor-not-allowed opacity-80"
                                disabled
                            >
                                Subscribe
                            </button>
                        </div>
                        <p className="text-amber-300 text-xs font-medium">
                            ⚠️ This is a preview. To activate, connect your
                            Beehiiv account and paste the embed code in{" "}
                            <code className="bg-white/10 px-1.5 py-0.5 rounded text-[11px]">
                                src/app/subscribe/page.tsx
                            </code>
                        </p>
                    </div>
                    {/* ═══ END BEEHIIV PLACEHOLDER ═══ */}

                    <p className="text-slate-500 text-[11px]">
                        Unsubscribe anytime. We never share your email.
                    </p>
                </div>
            </section>

            {/* What You Get */}
            <section className="space-y-8">
                <h2 className="text-2xl font-black text-slate-900 text-center">
                    What you get every fortnight
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {WHAT_YOU_GET.map((item, i) => (
                        <div
                            key={i}
                            className="bg-white rounded-xl border border-slate-200 p-5 space-y-2 hover:shadow-md transition-shadow"
                        >
                            <div className="flex items-center gap-3">
                                <span className="text-2xl">{item.icon}</span>
                                <h3 className="font-bold text-slate-900">
                                    {item.title}
                                </h3>
                            </div>
                            <p className="text-sm text-slate-600 leading-relaxed">
                                {item.desc}
                            </p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Sample Newsletter Preview */}
            <section className="space-y-6">
                <div className="text-center space-y-2">
                    <h2 className="text-2xl font-black text-slate-900">
                        Here&apos;s what a typical issue looks like
                    </h2>
                    <p className="text-slate-500 text-sm">
                        Real examples from recent funding rounds
                    </p>
                </div>

                <div className="space-y-4">
                    {SAMPLE_OPPS.map((opp, i) => (
                        <div
                            key={i}
                            className="bg-white rounded-xl border border-slate-200 p-6 space-y-3 hover:shadow-md transition-shadow"
                        >
                            <div className="flex items-center justify-between flex-wrap gap-2">
                                <div className="flex items-center gap-3">
                                    <span className="text-xs font-black uppercase tracking-wider text-slate-400">
                                        Funder:
                                    </span>
                                    <span className="text-sm font-bold text-slate-900">
                                        {opp.funder}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 text-[11px] font-bold uppercase tracking-wider rounded-full">
                                        {opp.type}
                                    </span>
                                    <span className="px-2.5 py-1 bg-slate-100 text-slate-600 text-[11px] font-bold uppercase tracking-wider rounded-full">
                                        {opp.sector}
                                    </span>
                                </div>
                            </div>
                            <div className="flex items-baseline gap-2">
                                <span className="text-xs font-black uppercase tracking-wider text-slate-400">
                                    Amount:
                                </span>
                                <span className="text-lg font-black text-slate-900">
                                    {opp.amount}
                                </span>
                            </div>
                            <p className="text-sm text-slate-600 leading-relaxed">
                                {opp.summary}
                            </p>
                        </div>
                    ))}
                </div>
            </section>

            {/* CTA + Share */}
            <section className="text-center space-y-6 pb-8">
                <p className="text-slate-500 text-sm">
                    Know someone who'd find this useful?
                </p>
                <button
                    onClick={handleCopyLink}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-bold rounded-xl transition-all"
                >
                    <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2.5"
                            d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                        />
                    </svg>
                    {copied ? "Link copied!" : "Share this page"}
                </button>
                <div className="flex items-center justify-center gap-3 text-xs text-slate-400">
                    <Link
                        href="/storytelling"
                        className="hover:text-slate-600 transition-colors"
                    >
                        Story Builder →
                    </Link>
                    <span>·</span>
                    <Link
                        href="/research"
                        className="hover:text-slate-600 transition-colors"
                    >
                        Research Kit →
                    </Link>
                    <span>·</span>
                    <Link
                        href="/alerts"
                        className="hover:text-slate-600 transition-colors"
                    >
                        Google Alerts →
                    </Link>
                </div>
            </section>
        </div>
    );
}
