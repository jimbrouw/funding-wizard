"use client";

import React from "react";
import GoogleAlertsBuilder from "@/components/GoogleAlertsBuilder";

export default function AlertsPage() {
    return (
        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <header className="space-y-4">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-violet-500 to-indigo-600 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-violet-200">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                        </svg>
                    </div>
                    <div>
                        <h1 className="text-4xl font-black text-slate-900 tracking-tight">
                            Grant Alerts
                        </h1>
                        <p className="text-sm font-bold text-slate-400">
                            Stop Googling for grants. Let them come to you.
                        </p>
                    </div>
                </div>
                <p className="text-lg text-slate-500 max-w-2xl leading-relaxed">
                    Build personalised Google Alerts that scour the internet for funding opportunities and deliver leads straight to your inbox.
                </p>
            </header>

            {/* Warning box */}
            <div className="flex items-start gap-4 p-5 bg-amber-50/60 border border-amber-100 rounded-2xl">
                <span className="shrink-0 mt-0.5 text-amber-500">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                </span>
                <div className="text-sm text-amber-800 leading-relaxed">
                    <strong>Why not just Google?</strong> Google search shows expired grants and winner announcements — neither helps you find open opportunities. Google Alerts monitors the web continuously and delivers new results as they appear.
                </div>
            </div>

            <GoogleAlertsBuilder />
        </div>
    );
}
