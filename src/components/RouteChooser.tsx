"use client";

import React from "react";
import { Route } from "@/lib/schema";

type RouteChooserProps = {
    routes: Route[];
    onSelectRoute: (routeId: string) => void;
};

export default function RouteChooser({ routes, onSelectRoute }: RouteChooserProps) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
                <h2 className="text-sm font-black uppercase tracking-widest text-slate-400">Available Funds</h2>
                {routes.map((route) => (
                    <button
                        key={route.id}
                        onClick={() => route.status === "active" && onSelectRoute(route.id)}
                        disabled={route.status !== "active"}
                        className={`w-full p-6 text-left rounded-3xl border-2 transition-all group ${route.status === "active"
                                ? "border-slate-100 bg-white hover:border-slate-900 hover:shadow-xl hover:-translate-y-1"
                                : "border-slate-50 bg-slate-50/50 opacity-60 cursor-not-allowed"
                            }`}
                    >
                        <div className="flex justify-between items-start mb-2">
                            <h3 className={`text-xl font-black ${route.status === "active" ? "text-slate-900" : "text-slate-400"}`}>
                                {route.title}
                            </h3>
                            {route.status === "active" ? (
                                <div className="px-2 py-1 bg-emerald-100 text-emerald-700 text-[10px] font-black uppercase tracking-widest rounded-md">
                                    Active
                                </div>
                            ) : (
                                <div className="px-2 py-1 bg-slate-200 text-slate-500 text-[10px] font-black uppercase tracking-widest rounded-md">
                                    Coming Soon
                                </div>
                            )}
                        </div>
                        <p className="text-sm text-slate-500">
                            {route.status === "active"
                                ? "Full wizard available with output generation."
                                : "This route is planned for a future update."}
                        </p>
                        {route.status === "active" && (
                            <div className="mt-6 flex items-center gap-2 text-slate-900 font-bold text-sm">
                                <span>Start Application</span>
                                <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                </svg>
                            </div>
                        )}
                    </button>
                ))}
            </div>

            <div className="p-8 rounded-3xl bg-slate-900 text-white flex flex-col justify-center gap-6">
                <div className="space-y-2">
                    <h2 className="text-2xl font-black">Not sure?</h2>
                    <p className="text-slate-400 text-sm leading-relaxed">
                        Answer a few questions about your goals and we'll recommend the best Arts Council route for you.
                    </p>
                </div>
                <button
                    onClick={() => onSelectRoute("quiz")}
                    className="w-full py-4 px-6 bg-white text-slate-900 rounded-2xl font-black text-sm hover:bg-slate-100 transition-colors flex items-center justify-between"
                >
                    <span>Take the Quiz</span>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                </button>
            </div>
        </div>
    );
}
