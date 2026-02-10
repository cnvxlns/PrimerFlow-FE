"use client";

import { useRef, useState } from "react";
import PrimerResultModal from "@/components/PrimerResultModal";
import {
    analyzeGenome,
    type AnalyzeRequestInput,
} from "@/services/analysisService";
import { demoGenome } from "@/lib/mocks/demoGenome";
import type { GenomeData, PrimerDesignResponseUI } from "@/types";
import { useViewStore } from "@/store/useViewStore";
import Step1TemplateEssential from "@/components/steps/Step1TemplateEssential";
import Step2PrimerProperties from "@/components/steps/Step2PrimerProperties";
import Step3BindingLocation from "@/components/steps/Step3BindingLocation";
import Step4SpecificityPreview from "@/components/steps/Step4SpecificityPreview";
import WizardFooterNav from "@/components/ui/WizardFooterNav";
import WizardHeader from "@/components/ui/WizardHeader";

const isGenomeFeature = (feature: any) =>
    feature &&
    typeof feature.start === "number" &&
    typeof feature.end === "number" &&
    feature.start <= feature.end;

const isGenomeData = (data: any): data is GenomeData =>
    data &&
    typeof data.length === "number" &&
    Array.isArray(data.tracks) &&
    data.tracks.every(
        (track: any) =>
            track &&
            typeof track.id === "string" &&
            Array.isArray(track.features) &&
            track.features.every(isGenomeFeature),
    );

const toGenomeDataFromResponse = (response: PrimerDesignResponseUI | null): GenomeData | null => {
    if (!response?.genome) return null;
    const g = response.genome as any;
    const length =
        g.length ??
        g.length_bp ??
        g.sequence?.length ??
        0;
    const tracks = Array.isArray(g.tracks) ? g.tracks : [];
    return { length, tracks };
};

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

    const sequenceInputRef = useRef("");
    const [resultGenome, setResultGenome] = useState<GenomeData | null>(null);

    const steps = [
        { id: 1, label: "Template & Essential" },
        { id: 2, label: "Primer Properties" },
        { id: 3, label: "Binding Location" },
        { id: 4, label: "Specificity & Preview" },
    ] as const;

    const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
    const [isLoading, setIsLoading] = useState(false);
    const [apiResult, setApiResult] = useState<PrimerDesignResponseUI | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const totalSteps = steps.length;
    const handleStepChange = (next: number) => {
        const clamped = Math.min(Math.max(next, 1), totalSteps) as 1 | 2 | 3 | 4;
        setStep(clamped);
    };
    const handleNext = () => handleStepChange(step + 1);
    const handleBack = () => handleStepChange(step - 1);
    const isLastStep = step === totalSteps;

    const previewGenome = demoGenome;
    const trackCount = previewGenome.tracks.length;
    const featureCount = previewGenome.tracks.reduce(
        (count, track) => count + track.features.length,
        0,
    );

    const handleGenerate = async () => {
        const inputSequence = sequenceInputRef.current;
        const targetSeq =
            inputSequence && inputSequence.trim().length > 0
                ? inputSequence.trim()
                : "ATGCGTACGTAGCTAGCTAGCTAGCTAATGCGTACGTAGCTAGCTAGCTAGCTA";
        const payload: AnalyzeRequestInput = {
            target_sequence: targetSeq,
            species: "Homo sapiens",
            analysis_type: "primer_generation",
            notes: "UI mock request while backend is offline",
            product_size_min: 100,
            product_size_max: 300,
            tm_min: 57,
            tm_opt: 60,
            tm_max: 63,
            gc_content_min: 40,
            gc_content_max: 60,
            max_tm_difference: 1,
            gc_clamp: true,
            max_poly_x: 5,
            concentration: 50,
            check_enabled: true,
            splice_variant_handling: false,
            snp_handling: false,
            mispriming_library: false,
            end_mismatch_region_size: 5,
            end_mismatch_min_mismatch: 1,
            search_start: 1,
        };

        setIsLoading(true);
        setErrorMessage(null);

        try {
            const result = await analyzeGenome(payload);
            setApiResult(result);
            const genomeFromApi = toGenomeDataFromResponse(result);
            setResultGenome(genomeFromApi ?? null);
            setIsModalOpen(true);
        } catch (error) {
            const message =
                error instanceof Error ? error.message : "Failed to generate primers.";
            setErrorMessage(message);
            setApiResult(null);
            setResultGenome(null);
            setIsModalOpen(false);
            // Surface the error for visibility during development.
            console.error("Generate Primers failed", error);
            alert(message);
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
                    genomeLength={previewGenome.length}
                    trackCount={trackCount}
                    featureCount={featureCount}
                    steps={steps}
                    step={step}
                    onStepChange={handleStepChange}
                />

                {step === 1 && (
                    <Step1TemplateEssential
                        sequenceRef={sequenceInputRef}
                    />
                )}

                {step === 2 && <Step2PrimerProperties />}

                {step === 3 && <Step3BindingLocation />}

                {step === 4 && (
                    <Step4SpecificityPreview
                        genome={previewGenome}
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
                    onGenerate={handleGenerate}
                    isGenerating={isLoading}
                />

                {isLastStep && errorMessage && (
                    <div className="mt-4 rounded bg-red-100 px-4 py-2 text-sm font-semibold text-red-700">
                        {errorMessage}
                    </div>
                )}
            </main>

            <PrimerResultModal
                isOpen={isModalOpen}
                apiResult={apiResult}
                genome={resultGenome}
                onClose={() => setIsModalOpen(false)}
            />
        </div>
    );
}
