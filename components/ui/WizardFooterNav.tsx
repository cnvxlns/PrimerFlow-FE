"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

type WizardFooterNavProps = {
    step: number;
    isLastStep: boolean;
    onBack: () => void;
    onNext: () => void;
};

export default function WizardFooterNav({
    step,
    isLastStep,
    onBack,
    onNext,
}: WizardFooterNavProps) {
    return (
        <div className="sticky bottom-6 z-10 flex items-center justify-between">
            <button
                type="button"
                onClick={onBack}
                className={`flex h-12 items-center justify-center gap-2 rounded-xl px-6 text-base font-bold transition ${
                    step === 1
                        ? "pointer-events-none opacity-0"
                        : "bg-slate-800/80 text-white hover:bg-slate-800"
                }`}
            >
                <ChevronLeft className="h-5 w-5 text-white" aria-hidden="true" />
                <span>Back</span>
            </button>

            {!isLastStep && (
                <button
                    type="button"
                    onClick={onNext}
                    className="group relative h-12 overflow-hidden rounded-xl bg-blue-600 px-6 text-center shadow-lg shadow-blue-900/30 transition-all hover:bg-blue-500 hover:shadow-blue-700/40 hover:-translate-y-1"
                >
                    <div className="relative z-10 flex items-center justify-center gap-3">
                        <span className="text-base font-bold tracking-wide text-white">Next</span>
                        <ChevronRight className="h-5 w-5 text-white" aria-hidden="true" />
                    </div>
                    <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:animate-[shimmer_1.5s_infinite]" />
                </button>
            )}

            {isLastStep && (
                <button
                    type="button"
                    className="group relative h-12 overflow-hidden rounded-xl bg-blue-600 px-6 text-center shadow-lg shadow-blue-900/30 transition-all hover:bg-blue-500 hover:shadow-blue-700/40 hover:-translate-y-1"
                >
                    <div className="relative z-10 flex items-center justify-center gap-3">
                        <span className="text-base font-bold tracking-wide text-white">
                            Generate Primers
                        </span>
                    </div>
                    <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:animate-[shimmer_1.5s_infinite]" />
                </button>
            )}
        </div>
    );
}
