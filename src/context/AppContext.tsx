"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { Answers, AnswerValue, Route } from "@/lib/schema";
import { ProfileFormValues } from "@/components/ProfileForm";

interface AppContextType {
    profile: ProfileFormValues;
    setProfile: (profile: ProfileFormValues) => void;
    answers: Answers;
    setAnswer: (id: string, value: AnswerValue) => void;
    clearAnswers: () => void;
    currentRoute: Route | null;
    setCurrentRoute: (route: Route | null) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const DEFAULT_PROFILE: ProfileFormValues = {
    applicantType: "",
    discipline: "",
    location: "",
    knowsFund: "",
};

export function AppProvider({ children }: { children: React.ReactNode }) {
    const [profile, setProfile] = useState<ProfileFormValues>(DEFAULT_PROFILE);
    const [answers, setAnswers] = useState<Answers>(() => {
        // Try to load from localStorage if available
        if (typeof window !== "undefined") {
            const saved = localStorage.getItem("funding_wizard_answers");
            return saved ? JSON.parse(saved) : {};
        }
        return {};
    });
    const [currentRoute, setCurrentRoute] = useState<Route | null>(null);

    useEffect(() => {
        localStorage.setItem("funding_wizard_answers", JSON.stringify(answers));
    }, [answers]);

    useEffect(() => {
        localStorage.setItem("funding_wizard_profile", JSON.stringify(profile));
    }, [profile]);

    useEffect(() => {
        if (typeof window !== "undefined") {
            const savedProfile = localStorage.getItem("funding_wizard_profile");
            if (savedProfile) setProfile(JSON.parse(savedProfile));
        }
    }, []);

    const setAnswer = (id: string, value: AnswerValue) => {
        setAnswers((prev) => ({ ...prev, [id]: value }));
    };

    const clearAnswers = () => {
        setAnswers({});
        setProfile(DEFAULT_PROFILE);
        localStorage.removeItem("funding_wizard_answers");
        localStorage.removeItem("funding_wizard_profile");
    };

    return (
        <AppContext.Provider
            value={{
                profile,
                setProfile,
                answers,
                setAnswer,
                clearAnswers,
                currentRoute,
                setCurrentRoute,
            }}
        >
            {children}
        </AppContext.Provider>
    );
}

export function useApp() {
    const context = useContext(AppContext);
    if (context === undefined) {
        throw new Error("useApp must be used within an AppProvider");
    }
    return context;
}
