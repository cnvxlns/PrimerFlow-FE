"use client";

import { useState } from "react";
import { analyzeGenome, type AnalyzeRequest, type AnalyzeResponse } from "@/services/analysisService";
import { useViewStore } from "@/store/useViewStore";
import { demoGenome } from "@/lib/mocks/demoGenome";
import Step1TemplateEssential from "@/components/steps/Step1TemplateEssential";
import Step2PrimerProperties from "@/components/steps/Step2PrimerProperties";
import Step3BindingLocation from "@/components/steps/Step3BindingLocation";
import Step4SpecificityPreview from "@/components/steps/Step4SpecificityPreview";
import WizardFooterNav from "@/components/ui/WizardFooterNav";
import WizardHeader from "@/components/ui/WizardHeader";

export default function Home() {
    const viewState = useViewStore((state) => state.viewState);
    const setViewState = useViewStore((state) => state.setViewState);
    const resetViewState = useViewStore((state) => state.resetViewState);

    const minScale = 0.1;
    const maxScale = 50;
    const zoomStep = 1.2;

    const clampScale = (scale: number) => Math.min(maxScale, Math.max(minScale, scale));
    const handleZoomIn = () =>
        setViewState({ ...viewState, scale: clampScale(viewState.scale * zoomStep) });
    const handleZoomOut = () =>
        setViewState({ ...viewState, scale: clampScale(viewState.scale / zoomStep) });

    // 더미 genome 데이터
    const genome = demoGenome;

    const steps = [
        { id: 1, label: "Template & Essential" },
        { id: 2, label: "Primer Properties" },
        { id: 3, label: "Binding Location" },
        { id: 4, label: "Specificity & Preview" },
    ] as const;

    const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
    const [isLoading, setIsLoading] = useState(false);
    const [apiResult, setApiResult] = useState<AnalyzeResponse | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const totalSteps = steps.length;
    const handleStepChange = (next: number) => {
        const clamped = Math.min(Math.max(next, 1), totalSteps) as 1 | 2 | 3 | 4;
        setStep(clamped);
    };
    const handleNext = () => handleStepChange(step + 1);
    const handleBack = () => handleStepChange(step - 1);
    const isLastStep = step === totalSteps;

    const trackCount = genome.tracks.length;
    const featureCount = genome.tracks.reduce(
        (count, track) => count + track.features.length,
        0,
    );

    const handleGeneratePrimers = async () => {
        const payload: AnalyzeRequest = {
            target_sequence: "ATGCGTACGTAGCTAGCTAGCTAGCTAATGCGTACGTAGCTAGCTAGCTAGCTA",
            species: "Homo sapiens",
            analysis_type: "primer_generation",
            notes: "UI mock request while backend is offline",
        };

        setIsLoading(true);
        setErrorMessage(null);

        try {
            const result = await analyzeGenome(payload);
            setApiResult(result);
        } catch (error) {
            const message =
                error instanceof Error ? error.message : "Failed to generate primers.";
            setErrorMessage(message);
            setApiResult(null);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="relative min-h-screen overflow-hidden bg-[#070d18] text-slate-100">
            <div className="pointer-events-none absolute inset-0 opacity-70">
                <div className="absolute -left-10 -top-10 h-64 w-64 rounded-full bg-blue-600/20 blur-[120px]" />
                <div className="absolute right-0 top-10 h-72 w-72 rounded-full bg-indigo-500/10 blur-[120px]" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,#1a2542_0%,transparent_35%),radial-gradient(circle_at_80%_20%,#122040_0%,transparent_30%)]" />
            </div>

            <main className="relative mx-auto flex w-full max-w-6xl flex-col gap-8 px-6 py-10 lg:px-10">
                <WizardHeader
                    genomeLength={genome.length}
                    trackCount={trackCount}
                    featureCount={featureCount}
                    steps={steps}
                    step={step}
                    onStepChange={handleStepChange}
                />

                {step === 1 && <Step1TemplateEssential />}

                {step === 2 && <Step2PrimerProperties />}

                {step === 3 && <Step3BindingLocation />}

                {step === 4 && (
                    <Step4SpecificityPreview
                        genome={genome}
                        viewState={viewState}
                        onViewStateChange={setViewState}
                        onZoomIn={handleZoomIn}
                        onZoomOut={handleZoomOut}
                        onResetView={resetViewState}
                    />
                )}
                <WizardFooterNav
                    step={step}
                    isLastStep={isLastStep}
                    onBack={handleBack}
                    onNext={handleNext}
                    onGenerate={handleGeneratePrimers}
                    isGenerating={isLoading}
                />

                {isLastStep && (apiResult || errorMessage) && (
                    <div className="mt-4">
                        {errorMessage && (
                            <div className="rounded bg-red-100 px-4 py-2 text-sm font-semibold text-red-700">
                                {errorMessage}
                            </div>
                        )}
                        {apiResult && (
                            <pre className="bg-gray-100 p-4 rounded mt-4 overflow-auto text-sm text-slate-900">
                                {JSON.stringify(apiResult, null, 2)}
                            </pre>
                        )}
                    </div>
                )}
            </main>
        </div>
    );
}
