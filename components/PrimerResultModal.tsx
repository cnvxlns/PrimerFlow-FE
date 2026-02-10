"use client";

import { type RefObject, useEffect, useMemo, useRef, useState } from "react";
import GenomeCanvas from "./canvas/GenomeCanvas";
import { createFocusedPrimerViewState } from "@/lib/algorithms/focusViewState";
import type {
  GenomeCanvasViewState,
  GenomeData,
  PrimerDesignResponseUI,
} from "@/types";

interface PrimerResultModalProps {
    isOpen: boolean;
    apiResult: PrimerDesignResponseUI | null;
    genome: GenomeData | null;
    onClose: () => void;
}

const MIN_SCALE = 0.1;
const MAX_SCALE = 50;
const ZOOM_STEP = 1.2;
const CANVAS_PADDING_X = 20;

interface PrimerResultCanvasPanelProps {
    apiResult: PrimerDesignResponseUI | null;
    genome: GenomeData;
    onClose: () => void;
    initialViewState: GenomeCanvasViewState;
    canvasShellRef: RefObject<HTMLDivElement | null>;
}

const clampScaleValue = (scale: number) => Math.min(MAX_SCALE, Math.max(MIN_SCALE, scale));

function PrimerResultCanvasPanel({
    apiResult,
    genome,
    onClose,
    initialViewState,
    canvasShellRef,
}: PrimerResultCanvasPanelProps) {
    const [viewState, setViewState] = useState<GenomeCanvasViewState>(initialViewState);

    const handleZoomIn = () =>
        setViewState((prev) => ({
            ...prev,
            scale: clampScaleValue(prev.scale * ZOOM_STEP),
        }));

    const handleZoomOut = () =>
        setViewState((prev) => ({
            ...prev,
            scale: clampScaleValue(prev.scale / ZOOM_STEP),
        }));

    const handleReset = () => setViewState(initialViewState);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4 py-6">
            <div className="relative w-full max-w-6xl overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/95 shadow-2xl shadow-black/30">
                <div className="flex items-center justify-between border-b border-slate-800 px-6 py-4">
                    <div>
                        <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
                            Primer Design Results
                        </p>
                        <h2 className="text-xl font-semibold text-white">Primer Design Results</h2>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-full border border-slate-700 bg-slate-800 px-3 py-1.5 text-sm font-semibold text-slate-200 transition hover:border-blue-500 hover:text-white"
                    >
                        Close
                    </button>
                </div>

                <div className="flex flex-col gap-4 px-6 py-5">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                        <div className="flex items-center gap-2">
                            <span className="rounded-full border border-slate-800 bg-slate-900/80 px-3 py-1 text-sm text-slate-200">
                                Zoom {viewState.scale.toFixed(2)}x
                            </span>
                            <button
                                type="button"
                                aria-label="Zoom out"
                                onClick={handleZoomOut}
                                className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-800 bg-slate-900/80 text-lg font-semibold transition hover:border-blue-500/60 hover:bg-blue-600/70 hover:text-white"
                            >
                                -
                            </button>
                            <button
                                type="button"
                                aria-label="Zoom in"
                                onClick={handleZoomIn}
                                className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-800 bg-slate-900/80 text-lg font-semibold transition hover:border-blue-500/60 hover:bg-blue-600/70 hover:text-white"
                            >
                                +
                            </button>
                            <button
                                type="button"
                                onClick={handleReset}
                                className="rounded-full border border-slate-800 bg-slate-900/80 px-3 py-2 text-sm font-semibold text-slate-200 transition hover:border-blue-500/60 hover:text-white"
                            >
                                Reset view
                            </button>
                        </div>
                        <div className="text-xs text-slate-400">
                            Result: {apiResult?.result} | Score: {apiResult?.score}
                        </div>
                    </div>

                    <div
                        ref={canvasShellRef}
                        className="relative overflow-hidden rounded-2xl border border-slate-800 bg-gradient-to-br from-slate-900 via-[#0a1428] to-[#0c1223] p-4"
                    >
                        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,#1e2b4c,transparent_40%),radial-gradient(circle_at_80%_30%,#0f1b34,transparent_45%)] opacity-60" />
                        <GenomeCanvas
                            genome={genome}
                            viewState={viewState}
                            onViewStateChange={setViewState}
                            className="w-full"
                            style={{ height: "430px" }}
                            onDraw={(ctx, _canvas, renderState) => {
                                const { data, viewport, viewState: canvasViewState } = renderState;
                                if (!data) return;

                                const dpr = viewport.devicePixelRatio || 1;
                                ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

                                ctx.fillStyle = "#0c1222";
                                ctx.fillRect(0, 0, viewport.width, viewport.height);

                                const paddingX = CANVAS_PADDING_X;
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
                                    canvasViewState.offsetX +
                                    (bp / safeLength) * canvasWidth * canvasViewState.scale;
                                const toScreenWidth = (start: number, end: number) =>
                                    Math.max(
                                        2,
                                        ((end - start) / safeLength) *
                                            canvasWidth *
                                            canvasViewState.scale,
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

                                let y = trackStartY + canvasViewState.offsetY;

                                const tracks = Array.isArray(data.tracks) ? data.tracks : [];

                                tracks.forEach((track) => {
                                    const trackHeight = (track.height ?? 18) * layoutScale;

                                    ctx.fillStyle = "#a5b4d8";
                                    ctx.font = `${12 * layoutScale}px ui-sans-serif, system-ui`;
                                    const trackLabel = track.name ?? track.id ?? "Track";
                                    ctx.fillText(trackLabel, paddingX, y - 10 * layoutScale);

                                    ctx.strokeStyle = "#23324a";
                                    ctx.beginPath();
                                    ctx.moveTo(paddingX, y + trackHeight / 2);
                                    ctx.lineTo(viewport.width - paddingX, y + trackHeight / 2);
                                    ctx.stroke();

                                    const features = Array.isArray(track.features)
                                        ? track.features
                                        : [];

                                    features.forEach((feature) => {
                                        const start = Number(feature.start ?? feature.start_bp ?? 0);
                                        const end = Number(feature.end ?? feature.end_bp ?? start);
                                        const x = bpToX(start);
                                        const width = toScreenWidth(start, end);
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

                                        const label =
                                            feature.label ||
                                            feature.id ||
                                            feature.name ||
                                            "";

                                        if (label) {
                                            const labelPaddingX = 6 * layoutScale;
                                            const labelPaddingY = 3 * layoutScale;
                                            ctx.font = `600 ${11 * layoutScale}px ui-sans-serif, system-ui`;
                                            const metrics = ctx.measureText(label);
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
                                            ctx.fillText(label, labelX + labelPaddingX, labelY + 12 * layoutScale);
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
    );
}

const createInitialViewState = (): GenomeCanvasViewState => ({
    scale: 1,
    offsetX: 0,
    offsetY: 0,
});

export default function PrimerResultModal({
    isOpen,
    apiResult,
    genome,
    onClose,
}: PrimerResultModalProps) {
    const canvasShellRef = useRef<HTMLDivElement | null>(null);
    const [canvasWidth, setCanvasWidth] = useState(() =>
        typeof window === "undefined" ? 960 : Math.max(320, Math.floor(window.innerWidth * 0.72)),
    );

    useEffect(() => {
        if (!isOpen) return;

        const { body, documentElement } = document;
        const previousBodyOverflow = body.style.overflow;
        const previousBodyPaddingRight = body.style.paddingRight;
        const previousBodyOverscrollBehavior = body.style.overscrollBehavior;
        const previousHtmlOverflow = documentElement.style.overflow;
        const previousHtmlOverscrollBehavior = documentElement.style.overscrollBehavior;

        const scrollbarWidth = window.innerWidth - documentElement.clientWidth;
        body.style.overflow = "hidden";
        body.style.overscrollBehavior = "none";
        documentElement.style.overflow = "hidden";
        documentElement.style.overscrollBehavior = "none";

        if (scrollbarWidth > 0) {
            body.style.paddingRight = `${scrollbarWidth}px`;
        }

        return () => {
            body.style.overflow = previousBodyOverflow;
            body.style.paddingRight = previousBodyPaddingRight;
            body.style.overscrollBehavior = previousBodyOverscrollBehavior;
            documentElement.style.overflow = previousHtmlOverflow;
            documentElement.style.overscrollBehavior = previousHtmlOverscrollBehavior;
        };
    }, [isOpen]);

    useEffect(() => {
        if (!isOpen) return;

        const element = canvasShellRef.current;
        if (!element) return;

        const updateCanvasWidth = () => {
            setCanvasWidth(element.clientWidth);
        };

        updateCanvasWidth();

        const resizeObserver = new ResizeObserver(() => {
            updateCanvasWidth();
        });

        resizeObserver.observe(element);

        return () => {
            resizeObserver.disconnect();
        };
    }, [isOpen]);

    const fittedInitialViewState = useMemo(() => {
        if (!genome) return createInitialViewState();

        return createFocusedPrimerViewState({
            genome,
            viewportWidth: canvasWidth,
            minScale: MIN_SCALE,
            maxScale: MAX_SCALE,
            paddingX: CANVAS_PADDING_X,
        });
    }, [canvasWidth, genome]);

    if (!isOpen || !genome) return null;

    const featureCount = genome.tracks.reduce(
        (count, track) => count + (Array.isArray(track.features) ? track.features.length : 0),
        0,
    );

    const viewStateKey = `${genome.length}-${genome.tracks.length}-${featureCount}-${Math.round(canvasWidth)}`;

    return (
        <PrimerResultCanvasPanel
            key={viewStateKey}
            apiResult={apiResult}
            genome={genome}
            onClose={onClose}
            initialViewState={fittedInitialViewState}
            canvasShellRef={canvasShellRef}
        />
    );
}
