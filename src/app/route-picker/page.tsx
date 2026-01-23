"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "@/context/AppContext";
import RouteChooser from "@/components/RouteChooser";
import QualifyingQuiz from "@/components/QualifyingQuiz";
import RecommendationCard from "@/components/RecommendationCard";
import { Route, AnswerValue } from "@/lib/schema";

export default function RoutePickerPage() {
    const router = useRouter();
    const { setCurrentRoute } = useApp();
    const [routes, setRoutes] = useState<Route[]>([]);
    const [quizQuestions, setQuizQuestions] = useState<any[]>([]);
    const [showQuiz, setShowQuiz] = useState(false);
    const [quizAnswers, setQuizAnswers] = useState<Record<string, AnswerValue>>({});
    const [recommendation, setRecommendation] = useState<{ id: string; title: string; reason: string } | null>(null);

    useEffect(() => {
        fetch("/api/content?type=routes")
            .then((res) => res.json())
            .then((data) => {
                setRoutes(data.routes);
                setQuizQuestions(data.qualifyingQuiz.questions);
            });
    }, []);

    const handleSelectRoute = (routeId: string) => {
        if (routeId === "quiz") {
            setShowQuiz(true);
            return;
        }

        const route = routes.find((r) => r.id === routeId);
        if (route) {
            if (route.status === "placeholder") {
                router.push(`/placeholder?route=${route.id}`);
            } else {
                setCurrentRoute(route);
                router.push(`/wizard/${route.id}`);
            }
        }
    };

    const handleQuizChange = (id: string, val: AnswerValue) => {
        setQuizAnswers((prev) => ({ ...prev, [id]: val }));
    };

    const handleRecommend = () => {
        // Logic from routes.json recommendations
        // For simplicity, let's hardcode a logical recommendation for now based on the goal
        const goal = quizAnswers["q_goal"];
        if (goal === "public_project") {
            setRecommendation({
                id: "ace_project_grants",
                title: "ACE Project Grants",
                reason: "Since your focus is on a time-limited project for an audience, this is the most appropriate route.",
            });
        } else {
            setRecommendation({
                id: "ace_dycp",
                title: "ACE DYCP",
                reason: "Since you are focused on your own development, Developing Your Creative Practice (DYCP) is likely a better fit.",
            });
        }
    };

    return (
        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <header className="space-y-4">
                <h1 className="text-5xl font-black text-slate-900 tracking-tight">
                    {showQuiz ? "Quick Quiz" : "Choose your funding route"}
                </h1>
                <p className="text-xl text-slate-500 max-w-2xl leading-relaxed">
                    {showQuiz
                        ? "Answer a few questions and we’ll recommend a route."
                        : "Pick a fund, or answer a few questions and we’ll recommend one."}
                </p>
            </header>

            {!showQuiz ? (
                <RouteChooser routes={routes} onSelectRoute={handleSelectRoute} />
            ) : recommendation ? (
                <div className="max-w-xl animate-in fade-in zoom-in-95 duration-500">
                    <RecommendationCard
                        routeTitle={recommendation.title}
                        reason={recommendation.reason}
                        onStart={() => handleSelectRoute(recommendation.id)}
                    />
                    <button
                        onClick={() => { setShowQuiz(false); setRecommendation(null); }}
                        className="mt-8 text-sm font-bold text-slate-400 hover:text-slate-900 transition-colors uppercase tracking-widest"
                    >
                        ← Back to all routes
                    </button>
                </div>
            ) : (
                <div className="space-y-8">
                    <QualifyingQuiz
                        questions={quizQuestions}
                        values={quizAnswers}
                        onChange={handleQuizChange}
                        onRecommend={handleRecommend}
                    />
                    <button
                        onClick={() => setShowQuiz(false)}
                        className="text-sm font-bold text-slate-400 hover:text-slate-900 transition-colors uppercase tracking-widest"
                    >
                        ← Back to all routes
                    </button>
                </div>
            )}
        </div>
    );
}
