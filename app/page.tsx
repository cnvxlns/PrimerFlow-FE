"use client";

import { useState } from "react";
import { analyzeGenome, type AnalyzeRequest, type AnalyzeResponse } from "@/services/analysisService";
import { useViewStore } from "@/store/useViewStore";
import { demoGenome } from "@/lib/mocks/demoGenome";
import GenomeCanvas from "@/components/canvas/GenomeCanvas";
import type { GenomeCanvasViewState, GenomeData } from "@/lib/types/Genome";
import Step1TemplateEssential from "@/components/steps/Step1TemplateEssential";
import Step2PrimerProperties from "@/components/steps/Step2PrimerProperties";
import Step3BindingLocation from "@/components/steps/Step3BindingLocation";
import Step4SpecificityPreview from "@/components/steps/Step4SpecificityPreview";
import WizardFooterNav from "@/components/ui/WizardFooterNav";
import WizardHeader from "@/components/ui/WizardHeader";

const clampScaleValue = (scale: number, minScale: number, maxScale: number) =>
    Math.min(maxScale, Math.max(minScale, scale));

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

const toGenomeDataFromResponse = (
    response: AnalyzeResponse | null,
    fallback: GenomeData,
): GenomeData => {
    if (!response) return fallback;
    const details = response.details;
    if (details && typeof details === "object") {
        const candidate = (details as any).genome ?? details;
        if (isGenomeData(candidate)) {
            return candidate;
        }
    }
    return fallback;
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
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [resultGenome, setResultGenome] = useState<GenomeData | null>(null);
    const [modalViewState, setModalViewState] = useState<GenomeCanvasViewState>({
        scale: 1,
        offsetX: 0,
        offsetY: 0,
    });
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

    const resetModalView = () =>
        setModalViewState({
            scale: 1,
            offsetX: 0,
            offsetY: 0,
        });

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
            const genomeFromApi = toGenomeDataFromResponse(result, demoGenome);
            setResultGenome(genomeFromApi);
            resetModalView();
            setIsModalOpen(true);
        } catch (error) {
            const message =
                error instanceof Error ? error.message : "Failed to generate primers.";
            setErrorMessage(message);
            setApiResult(null);
            setResultGenome(null);
            setIsModalOpen(false);
        } finally {
            setIsLoading(false);
        }
    };

    const handleModalZoomIn = () =>
        setModalViewState((prev) => ({
            ...prev,
            scale: clampScaleValue(prev.scale * zoomStep, minScale, maxScale),
        }));

    const handleModalZoomOut = () =>
        setModalViewState((prev) => ({
            ...prev,
            scale: clampScaleValue(prev.scale / zoomStep, minScale, maxScale),
        }));

    const handleModalReset = () => resetModalView();

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

                {isLastStep && errorMessage && (
                    <div className="mt-4 rounded bg-red-100 px-4 py-2 text-sm font-semibold text-red-700">
                        {errorMessage}
                    </div>
                )}
            </main>

            {isModalOpen && resultGenome && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4 py-6">
                    <div className="relative w-full max-w-6xl overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/95 shadow-2xl shadow-black/30">
                        <div className="flex items-center justify-between border-b border-slate-800 px-6 py-4">
                            <div>
                                <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
                                    Primer Design Results
                                </p>
                                <h2 className="text-xl font-semibold text-white">
                                    Primer Design Results
                                </h2>
                            </div>
                            <button
                                type="button"
                                onClick={() => setIsModalOpen(false)}
                                className="rounded-full border border-slate-700 bg-slate-800 px-3 py-1.5 text-sm font-semibold text-slate-200 transition hover:border-blue-500 hover:text-white"
                            >
                                Close
                            </button>
                        </div>

                        <div className="flex flex-col gap-4 px-6 py-5">
                            <div className="flex flex-wrap items-center justify-between gap-3">
                                <div className="flex items-center gap-2">
                                    <span className="rounded-full border border-slate-800 bg-slate-900/80 px-3 py-1 text-sm text-slate-200">
                                        Zoom {modalViewState.scale.toFixed(2)}x
                                    </span>
                                    <button
                                        type="button"
                                        aria-label="Zoom out"
                                        onClick={handleModalZoomOut}
                                        className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-800 bg-slate-900/80 text-lg font-semibold transition hover:border-blue-500/60 hover:bg-blue-600/70 hover:text-white"
                                    >
                                        -
                                    </button>
                                    <button
                                        type="button"
                                        aria-label="Zoom in"
                                        onClick={handleModalZoomIn}
                                        className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-800 bg-slate-900/80 text-lg font-semibold transition hover:border-blue-500/60 hover:bg-blue-600/70 hover:text-white"
                                    >
                                        +
                                    </button>
                                    <button
                                        type="button"
                                        onClick={handleModalReset}
                                        className="rounded-full border border-slate-800 bg-slate-900/80 px-3 py-2 text-sm font-semibold text-slate-200 transition hover:border-blue-500/60 hover:text-white"
                                    >
                                        Reset view
                                    </button>
                                </div>
                                <div className="text-xs text-slate-400">
                                    Result: {apiResult?.result} | Score: {apiResult?.score}
                                </div>
                            </div>

                            <div className="relative overflow-hidden rounded-2xl border border-slate-800 bg-gradient-to-br from-slate-900 via-[#0a1428] to-[#0c1223] p-4">
                                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,#1e2b4c,transparent_40%),radial-gradient(circle_at_80%_30%,#0f1b34,transparent_45%)] opacity-60" />
                                <GenomeCanvas
                                    genome={resultGenome}
                                    viewState={modalViewState}
                                    onViewStateChange={setModalViewState}
                                    className="w-full"
                                    style={{ height: "430px" }}
                                    onDraw={(ctx, _canvas, renderState) => {
                                        const { data, viewport, viewState } = renderState;
                                        if (!data) return;

                                        const dpr = viewport.devicePixelRatio || 1;
                                        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

                                        ctx.fillStyle = "#0c1222";
                                        ctx.fillRect(0, 0, viewport.width, viewport.height);

                                        const paddingX = 20;
                                        const layoutScale = Math.min(
                                            1.4,
                                            Math.max(1, viewport.height / 400),
                                        );

                                        const headerY = 28 * layoutScale;
                                        const trackStartY = 64 * layoutScale;
                                        const trackGap = 28 * layoutScale;

                                        const canvasWidth = viewport.width - paddingX * 2;
                                        const safeLength = Math.max(data.length, 1);
                                        const bpToX = (bp: number) =>
                                            paddingX +
                                            viewState.offsetX +
                                            (bp / safeLength) * canvasWidth * viewState.scale;
                                        const toScreenWidth = (start: number, end: number) =>
                                            Math.max(
                                                2,
                                                ((end - start) / safeLength) *
                                                    canvasWidth *
                                                    viewState.scale,
                                            );

                                        ctx.fillStyle = "#e2e8f0";
                                        ctx.font = `600 ${14 * layoutScale}px ui-sans-serif, system-ui`;
                                        ctx.fillText(`Genome length`, paddingX, headerY - 6 * layoutScale);

                                        ctx.fillStyle = "#9fb3d4";
                                        ctx.font = `${12 * layoutScale}px ui-sans-serif, system-ui`;
                                        ctx.fillText(
                                            `${data.length.toLocaleString()} bp`,
                                            paddingX,
                                            headerY + 10 * layoutScale,
                                        );

                                        ctx.strokeStyle = "#1f2b3f";
                                        ctx.lineWidth = 1;
                                        for (let i = 0; i <= 10; i += 1) {
                                            const x = paddingX + i * (canvasWidth / 10);
                                            ctx.beginPath();
                                            ctx.moveTo(x, trackStartY - 16 * layoutScale);
                                            ctx.lineTo(x, viewport.height - 20);
                                            ctx.stroke();
                                        }

                                        let y = trackStartY + viewState.offsetY;

                                        data.tracks.forEach((track) => {
                                            const trackHeight = (track.height ?? 18) * layoutScale;

                                            ctx.fillStyle = "#a5b4d8";
                                            ctx.font = `${12 * layoutScale}px ui-sans-serif, system-ui`;
                                            ctx.fillText(track.name ?? track.id, paddingX, y - 10 * layoutScale);

                                            ctx.strokeStyle = "#23324a";
                                            ctx.beginPath();
                                            ctx.moveTo(paddingX, y + trackHeight / 2);
                                            ctx.lineTo(viewport.width - paddingX, y + trackHeight / 2);
                                            ctx.stroke();

                                            track.features.forEach((feature) => {
                                                const x = bpToX(feature.start);
                                                const width = toScreenWidth(feature.start, feature.end);
                                                const radius = Math.min(6, trackHeight / 2);

                                                ctx.fillStyle = feature.color ?? "#38bdf8";
                                                const drawRoundedRect = (
                                                    context: CanvasRenderingContext2D,
                                                    rx: number,
                                                    ry: number,
                                                    w: number,
                                                    h: number,
                                                    r: number,
                                                ) => {
                                                    const radiusVal = Math.min(r, w / 2, h / 2);
                                                    context.beginPath();
                                                    context.moveTo(rx + radiusVal, ry);
                                                    context.arcTo(rx + w, ry, rx + w, ry + h, radiusVal);
                                                    context.arcTo(rx + w, ry + h, rx, ry + h, radiusVal);
                                                    context.arcTo(rx, ry + h, rx, ry, radiusVal);
                                                    context.arcTo(rx, ry, rx + w, ry, radiusVal);
                                                    context.closePath();
                                                };

                                                drawRoundedRect(ctx, x, y, width, trackHeight, radius);
                                                ctx.fill();

                                                if (feature.label) {
                                                    const labelPaddingX = 6 * layoutScale;
                                                    const labelPaddingY = 3 * layoutScale;
                                                    ctx.font = `600 ${11 * layoutScale}px ui-sans-serif, system-ui`;
                                                    const metrics = ctx.measureText(feature.label);
                                                    const labelWidth = metrics.width + labelPaddingX * 2;
                                                    const labelHeight = 16 * layoutScale + labelPaddingY;
                                                    const labelX = x + 6 * layoutScale;
                                                    const labelY = y + trackHeight + 6 * layoutScale;

                                                    ctx.fillStyle = "rgba(15,23,42,0.9)";
                                                    ctx.strokeStyle = "#1f2b3f";
                                                    drawRoundedRect(
                                                        ctx,
                                                        labelX,
                                                        labelY,
                                                        labelWidth,
                                                        labelHeight,
                                                        6 * layoutScale,
                                                    );
                                                    ctx.fill();
                                                    ctx.stroke();

                                                    ctx.fillStyle = "#e2e8f0";
                                                    ctx.fillText(
                                                        feature.label,
                                                        labelX + labelPaddingX,
                                                        labelY + 12 * layoutScale,
                                                    );
                                                }
                                            });

                                            y += trackHeight + trackGap;
                                        });
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
