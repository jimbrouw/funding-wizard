"use client";

import React from "react";

export type ProfileFormValues = {
    applicantType: "individual" | "collective" | "organisation" | "";
    discipline: "visual_arts" | "film" | "music" | "theatre" | "mixed" | "other" | "";
    location: "england" | "not_england" | "";
    knowsFund: "yes" | "not_sure" | "";
};

type ProfileFormProps = {
    value: ProfileFormValues;
    onChange: (next: ProfileFormValues) => void;
    onSubmit: () => void;
    error?: string | null;
};

export default function ProfileForm({
    value,
    onChange,
    onSubmit,
    error,
}: ProfileFormProps) {
    const handleChange = (field: keyof ProfileFormValues, val: any) => {
        onChange({ ...value, [field]: val });
    };

    const isFormValid = value.applicantType && value.discipline && value.location && value.knowsFund;

    const getPrimaryButtonText = () => {
        if (value.location === "not_england") return "See options";
        if (value.location === "england") {
            if (value.knowsFund === "yes") return "Choose fund";
            if (value.knowsFund === "not_sure") return "Help me choose";
        }
        return "Next";
    };

    return (
        <div className="space-y-12 max-w-2xl">
            <div className="space-y-8">
                {/* Q1 */}
                <section className="space-y-4">
                    <div className="space-y-1">
                        <h2 className="text-xl font-black text-slate-900">Who are you applying as?</h2>
                        <p className="text-sm text-slate-500">Choose the option that matches the applicant name on the form.</p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        {[
                            { id: "individual", label: "Individual" },
                            { id: "collective", label: "Collective" },
                            { id: "organisation", label: "Organisation" },
                        ].map((opt) => (
                            <button
                                key={opt.id}
                                onClick={() => handleChange("applicantType", opt.id)}
                                className={`px-4 py-4 text-sm font-bold rounded-2xl border-2 transition-all ${value.applicantType === opt.id
                                        ? "border-slate-900 bg-slate-900 text-white shadow-lg scale-[1.02]"
                                        : "border-slate-100 bg-white text-slate-600 hover:border-slate-200"
                                    }`}
                            >
                                {opt.label}
                            </button>
                        ))}
                    </div>
                </section>

                {/* Q2 */}
                <section className="space-y-4">
                    <div className="space-y-1">
                        <h2 className="text-xl font-black text-slate-900">What are you working in?</h2>
                        <p className="text-sm text-slate-500">Pick the closest fit. You can still describe mixed work later.</p>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {[
                            { id: "visual_arts", label: "Visual arts" },
                            { id: "film", label: "Film" },
                            { id: "music", label: "Music" },
                            { id: "theatre", label: "Theatre" },
                            { id: "mixed", label: "Mixed" },
                            { id: "other", label: "Other" },
                        ].map((opt) => (
                            <button
                                key={opt.id}
                                onClick={() => handleChange("discipline", opt.id)}
                                className={`px-4 py-4 text-sm font-bold rounded-2xl border-2 transition-all ${value.discipline === opt.id
                                        ? "border-slate-900 bg-slate-900 text-white shadow-lg scale-[1.02]"
                                        : "border-slate-100 bg-white text-slate-600 hover:border-slate-200"
                                    }`}
                            >
                                {opt.label}
                            </button>
                        ))}
                    </div>
                </section>

                {/* Q3 */}
                <section className="space-y-4">
                    <div className="space-y-1">
                        <h2 className="text-xl font-black text-slate-900">Where are you based?</h2>
                        <p className="text-sm text-slate-500">This version supports Arts Council England routes only.</p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {[
                            { id: "england", label: "England" },
                            { id: "not_england", label: "Not England" },
                        ].map((opt) => (
                            <button
                                key={opt.id}
                                onClick={() => handleChange("location", opt.id)}
                                className={`px-4 py-4 text-sm font-bold rounded-2xl border-2 transition-all ${value.location === opt.id
                                        ? "border-slate-900 bg-slate-900 text-white shadow-lg scale-[1.02]"
                                        : "border-slate-100 bg-white text-slate-600 hover:border-slate-200"
                                    }`}
                            >
                                {opt.label}
                            </button>
                        ))}
                    </div>
                </section>

                {/* Q4 */}
                <section className="space-y-4">
                    <div className="space-y-1">
                        <h2 className="text-xl font-black text-slate-900">Do you already know the fund you’re applying for?</h2>
                        <p className="text-sm text-slate-500">If you’re not sure, we’ll recommend a route.</p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {[
                            { id: "yes", label: "Yes, I know the fund" },
                            { id: "not_sure", label: "Not sure" },
                        ].map((opt) => (
                            <button
                                key={opt.id}
                                onClick={() => handleChange("knowsFund", opt.id)}
                                className={`px-4 py-4 text-sm font-bold rounded-2xl border-2 transition-all ${value.knowsFund === opt.id
                                        ? "border-slate-900 bg-slate-900 text-white shadow-lg scale-[1.02]"
                                        : "border-slate-100 bg-white text-slate-600 hover:border-slate-200"
                                    }`}
                            >
                                {opt.label}
                            </button>
                        ))}
                    </div>
                </section>
            </div>

            {error && (
                <div className="p-4 bg-red-50 border border-red-100 rounded-2xl text-red-600 text-sm font-bold">
                    {error}
                </div>
            )}

            <button
                onClick={onSubmit}
                disabled={!isFormValid}
                className={`w-full py-5 rounded-2xl text-lg font-black transition-all ${isFormValid
                        ? "bg-slate-900 text-white hover:bg-slate-800 hover:scale-[1.01] active:scale-[0.99] shadow-xl shadow-slate-200"
                        : "bg-slate-100 text-slate-400 cursor-not-allowed"
                    }`}
            >
                {getPrimaryButtonText()}
            </button>
        </div>
    );
}
