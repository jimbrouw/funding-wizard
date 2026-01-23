"use client";

import React, { use, useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useApp } from "@/context/AppContext";
import { Step, Question, OutputSlot, Answers, AnswerValue } from "@/lib/schema";
import { validateStepQuestions, computeOutput } from "@/lib/engine";
import Stepper, { ProgressBar } from "@/components/Stepper";
import QuestionGroup from "@/components/QuestionGroup";
import NavButtons from "@/components/NavButtons";
import OutputsMiniPreview from "@/components/OutputsMiniPreview";

function WizardContent({ routeId }: { routeId: string }) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { answers, setAnswer } = useApp();

    const [loading, setLoading] = useState(true);
    const [routeData, setRouteData] = useState<{
        title: string;
        steps: Step[];
        questions: Record<string, Question[]>;
        outputs: OutputSlot[];
    } | null>(null);

    const stepId = searchParams.get("step") || "";

    useEffect(() => {
        fetch(`/api/content?type=wizard&id=${routeId}`)
            .then((res) => res.json())
            .then((data) => {
                setRouteData(data);
                if (!stepId && data.steps.length > 0) {
                    router.replace(`/wizard/${routeId}?step=${data.steps[0].id}`);
                }
                setLoading(false);
            });
    }, [routeId]);

    if (loading || !routeData) {
        return (
            <div className="flex items-center justify-center min-h-[50vh]">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-slate-200 border-t-slate-900 rounded-full animate-spin" />
                    <p className="text-sm font-black text-slate-400 uppercase tracking-widest">Loading Wizard...</p>
                </div>
            </div>
        );
    }

    const currentStepIndex = routeData.steps.findIndex((s) => s.id === stepId);
    const currentStep = routeData.steps[currentStepIndex > -1 ? currentStepIndex : 0];

    // Filter questions based on conditions
    const allCurrentStepQuestions = routeData.questions[currentStep.id] || [];
    const visibleQuestions = allCurrentStepQuestions.filter((q) => {
        if (!(q as any).condition) return true;
        const cond = (q as any).condition;
        const val = answers[cond.questionId];
        if (cond.equals !== undefined) return val === cond.equals;
        if (cond.includes !== undefined) return Array.isArray(val) && val.includes(cond.includes);
        return true;
    });

    const errors = validateStepQuestions(visibleQuestions, answers);
    const isValid = Object.values(errors).every((e) => e === null);
    const missingCount = Object.values(errors).filter((e) => e !== null).length;

    const handleNext = () => {
        if (currentStepIndex < routeData.steps.length - 1) {
            const nextStep = routeData.steps[currentStepIndex + 1];
            router.push(`/wizard/${routeId}?step=${nextStep.id}`);
        } else {
            router.push("/review");
        }
    };

    const handleBack = () => {
        if (currentStepIndex > 0) {
            const prevStep = routeData.steps[currentStepIndex - 1];
            router.push(`/wizard/${routeId}?step=${prevStep.id}`);
        } else {
            router.push("/route-picker");
        }
    };

    const computedOutputs = routeData.outputs.map((slot) => ({
        slotId: slot.id,
        ...computeOutput(slot, answers),
    }));

    // Filter outputs affected by THIS step's questions
    const currentQuestionIds = visibleQuestions.map(q => q.id);
    const affectedOutputs = routeData.outputs.filter(slot =>
        slot.requiredInputs?.some(id => currentQuestionIds.includes(id))
    );

    return (
        <div className="space-y-12 animate-in fade-in duration-700">
            <header className="space-y-6">
                <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                        {routeData.title}
                    </span>
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                        Step {currentStepIndex + 1} of {routeData.steps.length}
                    </span>
                </div>
                <Stepper
                    steps={routeData.steps}
                    currentStepId={currentStep.id}
                    onNavigate={(id) => router.push(`/wizard/${routeId}?step=${id}`)}
                />
                <ProgressBar currentIndex={currentStepIndex} total={routeData.steps.length} />
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
                <div className="lg:col-span-8 space-y-12">
                    {currentStep.intro && (
                        <p className="text-2xl font-bold text-slate-900 leading-tight">
                            {currentStep.intro}
                        </p>
                    )}

                    {missingCount > 0 && (
                        <div className="p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3 text-red-600 text-sm font-bold animate-pulse">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
                            </svg>
                            Fix {missingCount} required answer{missingCount > 1 ? "s" : ""} to continue.
                        </div>
                    )}

                    <QuestionGroup
                        questions={visibleQuestions}
                        values={answers}
                        errors={errors}
                        onChange={setAnswer}
                    />

                    <NavButtons
                        onBack={handleBack}
                        onNext={handleNext}
                        nextDisabled={!isValid}
                        nextMessage={missingCount > 0 ? `Fix ${missingCount} errors` : ""}
                    />
                </div>

                <aside className="lg:col-span-4 sticky top-24">
                    <OutputsMiniPreview
                        slots={affectedOutputs.length > 0 ? affectedOutputs : routeData.outputs.slice(0, 3)}
                        computed={computedOutputs}
                        onOpenOutputs={() => router.push("/outputs")}
                    />
                </aside>
            </div>
        </div>
    );
}

export default function Wizard({ params }: { params: Promise<{ route: string }> }) {
    const { route } = use(params);

    return (
        <Suspense fallback={<div>Loading...</div>}>
            <WizardContent routeId={route} />
        </Suspense>
    );
}
