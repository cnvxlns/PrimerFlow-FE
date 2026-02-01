"use client";

import GenomeCanvas from "@/components/canvas/GenomeCanvas";
import { createBpScale } from "@/lib/math/coords";
import type { GenomeCanvasViewState, GenomeData } from "@/types";
import { ShieldCheck } from "lucide-react";

type Step4SpecificityPreviewProps = {
    genome: GenomeData;
    viewState: GenomeCanvasViewState;
    onViewStateChange: (nextViewState: GenomeCanvasViewState) => void;
    onZoomIn: () => void;
    onZoomOut: () => void;
    onResetView: () => void;
};

const drawRoundedRect = (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    width: number,
    height: number,
    radius: number,
) => {
    const r = Math.min(radius, width / 2, height / 2);
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + width, y, x + width, y + height, r);
    ctx.arcTo(x + width, y + height, x, y + height, r);
    ctx.arcTo(x, y + height, x, y, r);
    ctx.arcTo(x, y, x + width, y, r);
    ctx.closePath();
};

export default function Step4SpecificityPreview({
    genome,
    viewState,
    onViewStateChange,
    onZoomIn,
    onZoomOut,
    onResetView,
}: Step4SpecificityPreviewProps) {
    return (
        <section className="flex flex-col gap-4">
            <div className="rounded-xl border border-slate-800/70 bg-slate-900/80 px-4 py-3 text-base font-bold text-slate-300">
                Step 4. 특이성 검사를 설정하고 캔버스에서 결과를 미리보기 하세요.
            </div>
            <div className="grid gap-6 xl:grid-cols-12">
                <div className="xl:col-span-5 rounded-2xl border border-slate-800/70 bg-slate-900/80 backdrop-blur">
                    <div className="px-5 py-3 border-b border-slate-800 bg-[#161920]/50 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <ShieldCheck className="h-5 w-5 text-primary" aria-hidden="true" />
                            <h3 className="text-white text-sm font-bold uppercase tracking-wider">
                                Specificity
                            </h3>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input defaultChecked className="sr-only peer" type="checkbox" />
                            <div className="w-9 h-5 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-400 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-500"></div>
                            <span className="ml-2 text-xs font-medium text-slate-400">
                                Enable Check
                            </span>
                        </label>
                    </div>
                    <div className="p-5 flex flex-col gap-4">
                        <div className="flex flex-col md:flex-row gap-6">
                            <div className="flex-1 flex flex-col gap-3">
                                {[
                                    {
                                        label: "Splice Variant Handling",
                                        desc: "Avoid non-specific variants",
                                    },
                                    { label: "SNP Exclusion", desc: "Avoid primers on known SNPs" },
                                    {
                                        label: "Mispriming Library",
                                        desc: "Check against repeat library",
                                    },
                                ].map((item) => (
                                    <label
                                        key={item.label}
                                        className="flex items-center gap-2 cursor-pointer group"
                                    >
                                        <input
                                            className="w-4 h-4 rounded border-slate-700 bg-[#0b1224] text-blue-500 focus:ring-offset-[#0b1224] focus:ring-blue-500"
                                            type="checkbox"
                                        />
                                        <div className="flex flex-col">
                                            <span className="text-sm font-medium text-white group-hover:text-primary transition-colors">
                                                {item.label}
                                            </span>
                                            <span className="text-xs text-slate-400">
                                                {item.desc}
                                            </span>
                                        </div>
                                    </label>
                                ))}
                            </div>
                            <div className="flex-1 border-l border-slate-800 pl-0 md:pl-6 pt-4 md:pt-0 border-t md:border-t-0 mt-2 md:mt-0">
                                <label className="text-xs font-bold text-slate-400 mb-1.5 block">
                                    3&apos; End Mismatch Strictness
                                </label>
                                <p className="text-[11px] text-slate-500 mb-2">
                                    Number of mismatches allowed within 5bp of 3&apos; end.
                                </p>
                                <input
                                    className="w-full bg-[#0b1224] border border-slate-800 rounded-lg py-2 px-3 text-white text-sm focus:border-blue-500 focus:ring-0"
                                    max={5}
                                    min={0}
                                    type="number"
                                    defaultValue={1}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="xl:col-span-7 rounded-2xl border border-slate-800/70 bg-slate-900/80 shadow-2xl shadow-black/30 backdrop-blur">
                    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 px-5 py-4">
                        <div>
                            <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
                                Genome timeline
                            </p>
                            <h2
                                className="text-xl font-semibold text-white"
                                style={{ fontFamily: "var(--font-display)" }}
                            >
                                Canvas preview with live zoom
                            </h2>
                        </div>
                        <div className="flex flex-wrap items-center gap-2">
                            <span className="rounded-full border border-slate-800 bg-slate-900/80 px-3 py-1 text-sm text-slate-200">
                                Zoom {viewState.scale.toFixed(2)}x
                            </span>
                            <button
                                type="button"
                                aria-label="Zoom out"
                                onClick={onZoomOut}
                                className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-800 bg-slate-900/80 text-lg font-semibold transition hover:border-blue-500/60 hover:bg-blue-600/70 hover:text-white"
                            >
                                -
                            </button>
                            <button
                                type="button"
                                aria-label="Zoom in"
                                onClick={onZoomIn}
                                className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-800 bg-slate-900/80 text-lg font-semibold transition hover:border-blue-500/60 hover:bg-blue-600/70 hover:text-white"
                            >
                                +
                            </button>
                            <button
                                type="button"
                                onClick={onResetView}
                                className="rounded-full border border-slate-800 bg-slate-900/80 px-3 py-2 text-sm font-semibold text-slate-200 transition hover:border-blue-500/60 hover:text-white"
                            >
                                Reset view
                            </button>
                        </div>
                    </div>
                    <div className="relative overflow-hidden rounded-2xl border border-slate-800 bg-gradient-to-br from-slate-900 via-[#0a1428] to-[#0c1223] p-4">
                        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,#1e2b4c,transparent_40%),radial-gradient(circle_at_80%_30%,#0f1b34,transparent_45%)] opacity-60" />
                        <GenomeCanvas
                            genome={genome}
                            viewState={viewState}
                            onViewStateChange={onViewStateChange}
                            className="w-full"
                            style={{ height: "450px" }}
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

                                const bpScale = createBpScale(
                                    data.length,
                                    viewport.width - paddingX * 2,
                                    0,
                                );

                                const toScreenX = (bp: number) =>
                                    paddingX +
                                    viewState.offsetX +
                                    bpScale.bpToX(bp) * viewState.scale;

                                const toScreenWidth = (start: number, end: number) => {
                                    const rawWidth =
                                        bpScale.spanToWidth(start, end, 0) *
                                        viewState.scale;
                                    return Math.max(2, rawWidth);
                                };

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
                                    const x =
                                        paddingX +
                                        i * ((viewport.width - paddingX * 2) / 10);
                                    ctx.beginPath();
                                    ctx.moveTo(x, trackStartY - 16 * layoutScale);
                                    ctx.lineTo(x, viewport.height - 20);
                                    ctx.stroke();
                                }

                                let y = trackStartY + viewState.offsetY;

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
                                    ctx.lineTo(
                                        viewport.width - paddingX,
                                        y + trackHeight / 2,
                                    );
                                    ctx.stroke();

                                    const features = Array.isArray(track.features)
                                        ? track.features
                                        : [];

                                    features.forEach((feature) => {
                                        const start = Number(feature.start ?? feature.start_bp ?? 0);
                                        const end = Number(feature.end ?? feature.end_bp ?? start);
                                        const x = toScreenX(start);
                                        const width = toScreenWidth(start, end);
                                        const radius = Math.min(6, trackHeight / 2);

                                        ctx.fillStyle = feature.color ?? "#38bdf8";
                                        drawRoundedRect(
                                            ctx,
                                            x,
                                            y,
                                            width,
                                            trackHeight,
                                            radius,
                                        );
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
                                            const labelWidth =
                                                metrics.width + labelPaddingX * 2;
                                            const labelHeight =
                                                16 * layoutScale + labelPaddingY;
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
                                                label,
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

            <div className="rounded-2xl border border-slate-800/70 bg-slate-900/80 p-5 shadow-xl shadow-black/30">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
                            Quality notes
                        </p>
                        <h4
                            className="text-lg font-semibold text-white"
                            style={{ fontFamily: "var(--font-display)" }}
                        >
                            Quick health check
                        </h4>
                    </div>
                    <span className="rounded-full border border-emerald-500/30 bg-emerald-500/15 px-3 py-1 text-xs font-semibold text-emerald-100">
                        Stable
                    </span>
                </div>
                <ul className="mt-4 space-y-3 text-sm text-slate-300">
                    <li className="flex items-start gap-2">
                        <span className="mt-1 h-2 w-2 rounded-full bg-emerald-400" />
                        Primer candidates are spaced to avoid overlap with target amplicon.
                    </li>
                    <li className="flex items-start gap-2">
                        <span className="mt-1 h-2 w-2 rounded-full bg-blue-400" />
                        Zoom 상태와 오프셋은 결과 단계에서만 노출됩니다.
                    </li>
                    <li className="flex items-start gap-2">
                        <span className="mt-1 h-2 w-2 rounded-full bg-amber-400" />
                        단계 전환은 상단 스텝 원형 인디케이터와 하단 버튼으로 진행합니다.
                    </li>
                </ul>
            </div>
        </section>
    );
}
