"use client";

import { useState } from "react";
import GenomeCanvas from "@/components/canvas/GenomeCanvas";
import { createBpScale } from "@/lib/math/coords"; // 만약 이 파일이 없다면 아래 주석 참고
import { useViewStore } from "@/store/useViewStore";
import type { GenomeData } from "@/lib/types/Genome";

/**
 * 둥근 사각형 그리기 유틸리티
 */
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

    // 더미 데이터
    const genome: GenomeData = {
        length: 12000,
        tracks: [
            {
                id: "track-1",
                name: "Primer 후보군",
                height: 28,
                features: [
                    { id: "f1", start: 400, end: 1200, label: "P-01", color: "#2563eb" },
                    { id: "f2", start: 1800, end: 2600, label: "P-02", color: "#0ea5e9" },
                    { id: "f3", start: 3200, end: 4300, label: "P-03", color: "#22c55e" },
                ],
            },
            {
                id: "track-2",
                name: "Target 구간",
                height: 18,
                features: [
                    { id: "t1", start: 1500, end: 5200, label: "Amplicon", color: "#f97316" },
                ],
            },
        ],
    };

    const steps = [
        { id: 1, label: "Template & Essential" },
        { id: 2, label: "Primer Properties" },
        { id: 3, label: "Binding Location" },
        { id: 4, label: "Specificity & Preview" },
    ] as const;

    const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
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

    return (
        <div className="relative min-h-screen overflow-hidden bg-[#070d18] text-slate-100">
            <div className="pointer-events-none absolute inset-0 opacity-70">
                <div className="absolute -left-10 -top-10 h-64 w-64 rounded-full bg-blue-600/20 blur-[120px]" />
                <div className="absolute right-0 top-10 h-72 w-72 rounded-full bg-indigo-500/10 blur-[120px]" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,#1a2542_0%,transparent_35%),radial-gradient(circle_at_80%_20%,#122040_0%,transparent_30%)]" />
            </div>

            <main className="relative mx-auto flex w-full max-w-6xl flex-col gap-8 px-6 py-10 lg:px-10">
                <header className="flex flex-col gap-4">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex items-center gap-3">
                            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-500/15 text-sm font-semibold uppercase tracking-[0.14em] text-blue-100 ring-1 ring-blue-500/30">
                                PF
                            </div>
                            <div className="flex flex-col">
                                <span className="text-xs uppercase tracking-[0.24em] text-slate-400">
                                    Primerflow Lab
                                </span>
                                <h1
                                    className="text-3xl font-semibold text-white md:text-4xl"
                                    style={{ fontFamily: "var(--font-display)" }}
                                >
                                    Primer Design Input
                                </h1>
                                <p className="text-sm text-slate-400">
                                    demodesign 흐름을 따라 입력 -&gt; 특성 -&gt; 위치 -&gt; 특이성/미리보기 순으로 진행합니다.
                                </p>
                            </div>
                        </div>
                        <div className="flex flex-wrap items-center gap-2 text-sm">
                            <span className="rounded-full border border-slate-800 bg-slate-900/70 px-3 py-1 text-slate-200">
                                {genome.length.toLocaleString()} bp genome
                            </span>
                            <span className="rounded-full border border-blue-500/30 bg-blue-500/15 px-3 py-1 text-blue-100">
                                {trackCount} tracks
                            </span>
                            <span className="rounded-full border border-emerald-500/30 bg-emerald-500/15 px-3 py-1 text-emerald-100">
                                {featureCount} features
                            </span>
                        </div>
                    </div>

                    <div className="relative w-full">
                        <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-[2px] bg-slate-800 z-0" />
                        <div className="grid grid-cols-4 gap-4">
                            {steps.map((item) => {
                                const status =
                                    item.id === step ? "active" : item.id < step ? "done" : "upcoming";
                                const isUnlocked = item.id <= step;
                                const circle =
                                    status === "active"
                                        ? "bg-blue-600 border-blue-400 text-white shadow-lg shadow-blue-900/40"
                                        : status === "done"
                                          ? "bg-blue-500 border-blue-500 text-white"
                                          : "bg-slate-900 border-slate-800 text-slate-500";
                                return (
                                    <div key={item.id} className="flex flex-col items-center gap-2">
                                        <button
                                            type="button"
                                            onClick={() => isUnlocked && handleStepChange(item.id)}
                                            className={`relative z-10 flex h-11 w-11 items-center justify-center rounded-full border text-sm font-bold transition ${
                                                isUnlocked ? circle : `${circle} cursor-not-allowed opacity-60`
                                            }`}
                                        >
                                            {item.id}
                                        </button>
                                        <span className="text-[11px] uppercase tracking-wide text-slate-400 text-center">
                                            {item.label}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </header>

                {step === 1 && (
                    <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr] items-start">
                        <div className="flex flex-col rounded-xl border border-slate-800/70 bg-slate-900/70 overflow-hidden shadow-lg shadow-black/20">
                            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800 bg-[#161920]">
                                <div className="flex items-center gap-2">
                                    <span className="text-primary">*</span>
                                    <h3 className="text-white text-lg font-bold">PCR Template Sequence</h3>
                                </div>
                                <span className="text-xs font-mono text-slate-400 bg-slate-800 px-2 py-1 rounded">
                                    FASTA / Raw
                                </span>
                            </div>
                            <div className="p-5 flex-1 flex flex-col gap-4">
                                <label className="flex flex-col flex-1 h-full">
                                    <div className="flex justify-between items-end mb-2">
                                        <span className="text-sm font-medium text-slate-400">
                                            Sequence Input (5&apos; -&gt; 3&apos;)
                                        </span>
                                        <span className="text-xs text-slate-500 font-mono">0 bp</span>
                                    </div>
                                    <div className="relative flex-1 min-h-[360px]">
                                        <textarea
                                            className="w-full h-full resize-none rounded-lg border border-slate-800 bg-[#0b1224] text-white p-4 font-mono text-sm leading-relaxed focus:border-blue-500 focus:ring-1 focus:ring-blue-500 placeholder:text-gray-600 transition-colors"
                                            placeholder=">Seq1
ATGCGT..."
                                            spellCheck={false}
                                        />
                                        <div className="absolute bottom-4 right-4 flex items-center gap-1.5 text-xs font-bold text-slate-400 bg-slate-800/80 px-2 py-1 rounded border border-slate-700">
                                            <span className="text-[14px]">info</span>
                                            Waiting for input...
                                        </div>
                                    </div>
                                </label>
                                <div className="flex flex-wrap gap-2 justify-end">
                                    <button className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-bold text-slate-300 hover:text-white hover:bg-slate-800 transition-colors border border-transparent hover:border-slate-700">
                                        Upload FASTA
                                    </button>
                                    <button className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-bold text-slate-300 hover:text-white hover:bg-slate-800 transition-colors border border-transparent hover:border-slate-700">
                                        Paste
                                    </button>
                                    <button className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-bold text-slate-300 hover:text-white hover:bg-slate-800 transition-colors border border-transparent hover:border-slate-700">
                                        Clean
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col gap-6">
                            <div className="bg-slate-900/80 border border-slate-800 rounded-xl overflow-hidden shadow-sm backdrop-blur">
                                <div className="px-5 py-3 border-b border-slate-800 bg-[#161920]/50 flex items-center gap-2">
                                    <span className="material-icons text-primary text-[20px]">tune</span>
                                    <h3 className="text-white text-sm font-bold uppercase tracking-wider">
                                        Essential Settings
                                    </h3>
                                </div>
                                <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="col-span-1 md:col-span-2">
                                        <label className="text-xs font-bold text-slate-400 mb-1.5 block">
                                            Target Organism (Database)
                                        </label>
                                        <div className="relative">
                                            <select className="w-full appearance-none bg-[#0b1224] border border-slate-800 rounded-lg py-2 pl-3 pr-10 text-white text-sm focus:border-blue-500 focus:ring-0">
                                                <option value="human">Homo sapiens (Human) - hg38</option>
                                                <option value="mouse">Mus musculus (Mouse) - mm10</option>
                                                <option value="rat">Rattus norvegicus (Rat) - rn6</option>
                                                <option value="custom">Custom Database...</option>
                                            </select>
                                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-500">
                                                v
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-span-1">
                                        <label className="text-xs font-bold text-slate-400 mb-1.5 block">
                                            PCR Product Size (bp)
                                        </label>
                                        <div className="flex items-center gap-2">
                                            <input
                                                className="w-full bg-[#0b1224] border border-slate-800 rounded-lg py-2 px-3 text-white text-sm focus:border-blue-500 focus:ring-0"
                                                placeholder="Min"
                                                type="number"
                                                defaultValue={100}
                                            />
                                            <span className="text-slate-500">-</span>
                                            <input
                                                className="w-full bg-[#0b1224] border border-slate-800 rounded-lg py-2 px-3 text-white text-sm focus:border-blue-500 focus:ring-0"
                                                placeholder="Max"
                                                type="number"
                                                defaultValue={300}
                                            />
                                        </div>
                                    </div>
                                    <div className="col-span-1 md:col-span-2">
                                        <label className="text-xs font-bold text-slate-400 mb-1.5 block">
                                            Primer Tm (C)
                                        </label>
                                        <div className="grid grid-cols-3 gap-3">
                                            {[
                                                { label: "Min", value: 57.0, tone: "text-slate-200", border: "border-slate-800" },
                                                { label: "Opt", value: 60.0, tone: "text-blue-100", border: "border-blue-500/50" },
                                                { label: "Max", value: 63.0, tone: "text-slate-200", border: "border-slate-800" },
                                            ].map((item) => (
                                                <div key={item.label} className="relative">
                                                    <span
                                                        className={`absolute top-[-1.2em] left-0 text-[10px] ${
                                                            item.label === "Opt" ? "text-primary font-bold" : "text-slate-500"
                                                        }`}
                                                    >
                                                        {item.label}
                                                    </span>
                                                    <input
                                                        className={`w-full bg-[#0b1224] border ${item.border} rounded-lg py-2 px-3 text-sm ${item.tone} focus:border-blue-500 focus:ring-0`}
                                                        type="number"
                                                        defaultValue={item.value}
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                )}

                {step === 2 && (
                    <section className="flex flex-col gap-4">
                        <div className="rounded-xl border border-slate-800/70 bg-slate-900/80 px-4 py-3 text-sm text-slate-300">
                            Step 2. 프라이머 물성(*는 이전 단계)과 클램프/폴리X/농도를 설정하세요.
                        </div>
                        <div className="rounded-2xl border border-slate-800/70 bg-slate-900/80 backdrop-blur">
                            <div className="px-5 py-3 border-b border-slate-800 bg-[#161920]/50 flex items-center gap-2">
                                <span className="material-icons text-primary text-[20px]">science</span>
                                <h3 className="text-white text-sm font-bold uppercase tracking-wider">
                                    Primer Properties
                                </h3>
                            </div>
                            <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="col-span-1">
                                    <label className="text-xs font-bold text-slate-400 mb-1.5 block">
                                        Primer GC Content (%)
                                    </label>
                                    <div className="flex items-center gap-2">
                                        <input
                                            className="w-full bg-[#0b1224] border border-slate-800 rounded-lg py-2 px-3 text-white text-sm focus:border-blue-500 focus:ring-0"
                                            placeholder="Min"
                                            type="number"
                                            defaultValue={40}
                                        />
                                        <span className="text-slate-500">-</span>
                                        <input
                                            className="w-full bg-[#0b1224] border border-slate-800 rounded-lg py-2 px-3 text-white text-sm focus:border-blue-500 focus:ring-0"
                                            placeholder="Max"
                                            type="number"
                                            defaultValue={60}
                                        />
                                    </div>
                                </div>
                                <div className="col-span-1">
                                    <label className="text-xs font-bold text-slate-400 mb-1.5 block">
                                        Max Tm Difference (C)
                                    </label>
                                    <input
                                        className="w-full bg-[#0b1224] border border-slate-800 rounded-lg py-2 px-3 text-white text-sm focus:border-blue-500 focus:ring-0"
                                        step="0.1"
                                        type="number"
                                        defaultValue={1.0}
                                    />
                                </div>
                                <div className="col-span-1">
                                    <label className="text-xs font-bold text-slate-400 mb-1.5 block">
                                        Max Poly-X Run
                                    </label>
                                    <input
                                        className="w-full bg-[#0b1224] border border-slate-800 rounded-lg py-2 px-3 text-white text-sm focus:border-blue-500 focus:ring-0"
                                        type="number"
                                        defaultValue={5}
                                    />
                                </div>
                                <div className="col-span-1">
                                    <label className="text-xs font-bold text-slate-400 mb-1.5 block">
                                        Concentration (nM)
                                    </label>
                                    <input
                                        className="w-full bg-[#0b1224] border border-slate-800 rounded-lg py-2 px-3 text-white text-sm focus:border-blue-500 focus:ring-0"
                                        type="number"
                                        defaultValue={50}
                                    />
                                </div>
                                <div className="col-span-1 md:col-span-2 flex items-center justify-between bg-[#0b1224] p-3 rounded-lg border border-slate-800">
                                    <div className="flex flex-col">
                                        <span className="text-sm font-bold text-white">GC Clamp Requirement</span>
                                        <span className="text-xs text-slate-400">Enforce G/C at 3&apos; end</span>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input defaultChecked className="sr-only peer" type="checkbox" />
                                        <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-400 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
                                    </label>
                                </div>
                            </div>
                        </div>
                    </section>
                )}

                {step === 3 && (
                    <section className="flex flex-col gap-6">
                        <div className="rounded-2xl border border-slate-800/70 bg-slate-900/80 backdrop-blur">
                            <div className="px-5 py-3 border-b border-slate-800 bg-[#161920]/50 flex items-center gap-2">
                                <span className="material-icons text-primary text-[20px]">location_on</span>
                                <h3 className="text-white text-sm font-bold uppercase tracking-wider">
                                    Binding Location & Structure
                                </h3>
                            </div>
                            <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="col-span-1 md:col-span-2">
                                    <label className="text-xs font-bold text-slate-400 mb-1.5 block">
                                        Search Range (Position)
                                    </label>
                                    <div className="flex items-center gap-2">
                                        <div className="relative w-full">
                                            <span className="absolute inset-y-0 left-3 flex items-center text-slate-500 text-xs">
                                                From
                                            </span>
                                            <input
                                                className="w-full bg-[#0b1224] border border-slate-800 rounded-lg py-2 pl-12 pr-3 text-white text-sm focus:border-blue-500 focus:ring-0"
                                                type="number"
                                                defaultValue={1}
                                            />
                                        </div>
                                        <span className="text-slate-500">-</span>
                                        <div className="relative w-full">
                                            <span className="absolute inset-y-0 left-3 flex items-center text-slate-500 text-xs">
                                                To
                                            </span>
                                            <input
                                                className="w-full bg-[#0b1224] border border-slate-800 rounded-lg py-2 pl-8 pr-3 text-white text-sm focus:border-blue-500 focus:ring-0"
                                                placeholder="End"
                                                type="number"
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="col-span-1">
                                    <label className="text-xs font-bold text-slate-400 mb-1.5 block">
                                        Exon Junction Span
                                    </label>
                                    <div className="relative">
                                        <select className="w-full appearance-none bg-[#0b1224] border border-slate-800 rounded-lg py-2 pl-3 pr-10 text-white text-sm focus:border-blue-500 focus:ring-0">
                                            <option value="no_pref">No Preference</option>
                                            <option value="span_junction">Must Span Junction</option>
                                            <option value="flank_junction">Flank Junction</option>
                                        </select>
                                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-500">
                                            v
                                        </div>
                                    </div>
                                </div>
                                <div className="col-span-1 flex items-end h-full pb-2">
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            className="w-4 h-4 rounded border-slate-700 bg-[#0b1224] text-blue-500 focus:ring-offset-[#0b1224] focus:ring-blue-500"
                                            type="checkbox"
                                        />
                                        <span className="text-sm font-medium text-white">Intron Inclusion</span>
                                    </label>
                                </div>
                                <div className="col-span-1 md:col-span-2">
                                    <label className="text-xs font-bold text-slate-400 mb-1.5 block opacity-70">
                                        Intron Size Range
                                    </label>
                                    <div className="flex items-center gap-2 opacity-70">
                                        <input
                                            className="w-full bg-[#0b1224] border border-slate-800 rounded-lg py-2 px-3 text-white text-sm focus:border-blue-500 focus:ring-0"
                                            placeholder="Min"
                                            type="number"
                                            defaultValue={50}
                                        />
                                        <span className="text-slate-500">-</span>
                                        <input
                                            className="w-full bg-[#0b1224] border border-slate-800 rounded-lg py-2 px-3 text-white text-sm focus:border-blue-500 focus:ring-0"
                                            placeholder="Max"
                                            type="number"
                                            defaultValue={5000}
                                        />
                                    </div>
                                </div>
                                <div className="col-span-1 md:col-span-2">
                                    <label className="text-xs font-bold text-slate-400 mb-1.5 block">
                                        Restriction Enzymes
                                    </label>
                                    <div className="w-full bg-[#0b1224] border border-slate-800 rounded-lg p-2 flex flex-wrap gap-2 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 transition-all">
                                        {["EcoRI", "BamHI", "HindIII"].map((site) => (
                                            <span
                                                key={site}
                                                className="inline-flex items-center gap-1 bg-blue-500/15 text-blue-100 text-xs font-bold px-2 py-1 rounded border border-blue-500/30"
                                            >
                                                {site}
                                            </span>
                                        ))}
                                        <input
                                            className="bg-transparent border-none p-1 text-sm text-white focus:ring-0 placeholder:text-gray-600 min-w-[120px] flex-1"
                                            placeholder="Type enzyme & press Enter..."
                                            type="text"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                )}

                {step === 4 && (
                    <section className="flex flex-col gap-6">
                        <div className="grid gap-6 xl:grid-cols-12">
                            <div className="xl:col-span-5 rounded-2xl border border-slate-800/70 bg-slate-900/80 backdrop-blur">
                                <div className="px-5 py-3 border-b border-slate-800 bg-[#161920]/50 flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <span className="material-icons text-primary text-[20px]">verified_user</span>
                                        <h3 className="text-white text-sm font-bold uppercase tracking-wider">
                                            Specificity
                                        </h3>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input defaultChecked className="sr-only peer" type="checkbox" />
                                        <div className="w-9 h-5 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-400 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-500"></div>
                                        <span className="ml-2 text-xs font-medium text-slate-400">Enable Check</span>
                                    </label>
                                </div>
                                <div className="p-5 flex flex-col gap-4">
                                    <div className="flex flex-col md:flex-row gap-6">
                                        <div className="flex-1 flex flex-col gap-3">
                                            {[
                                                { label: "Splice Variant Handling", desc: "Avoid non-specific variants" },
                                                { label: "SNP Exclusion", desc: "Avoid primers on known SNPs" },
                                                { label: "Mispriming Library", desc: "Check against repeat library" },
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
                                                        <span className="text-xs text-slate-400">{item.desc}</span>
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
                                            onClick={resetViewState}
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
                                        onViewStateChange={setViewState}
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
                                            ctx.fillText(
                                                `Genome length`,
                                                paddingX,
                                                headerY - 6 * layoutScale,
                                            );

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

                                            data.tracks.forEach((track) => {
                                                const trackHeight = (track.height ?? 18) * layoutScale;

                                                ctx.fillStyle = "#a5b4d8";
                                                ctx.font = `${12 * layoutScale}px ui-sans-serif, system-ui`;
                                                ctx.fillText(
                                                    track.name ?? track.id,
                                                    paddingX,
                                                    y - 10 * layoutScale,
                                                );

                                                ctx.strokeStyle = "#23324a";
                                                ctx.beginPath();
                                                ctx.moveTo(paddingX, y + trackHeight / 2);
                                                ctx.lineTo(
                                                    viewport.width - paddingX,
                                                    y + trackHeight / 2,
                                                );
                                                ctx.stroke();

                                                track.features.forEach((feature) => {
                                                    const x = toScreenX(feature.start);
                                                    const width = toScreenWidth(
                                                        feature.start,
                                                        feature.end,
                                                    );
                                                    const radius = Math.min(6, trackHeight / 2);

                                                    ctx.fillStyle = feature.color ?? "#38bdf8";
                                                    drawRoundedRect(ctx, x, y, width, trackHeight, radius);
                                                    ctx.fill();

                                                    if (feature.label) {
                                                        const labelPaddingX = 6 * layoutScale;
                                                        const labelPaddingY = 3 * layoutScale;
                                                        ctx.font = `600 ${11 * layoutScale}px ui-sans-serif, system-ui`;
                                                        const metrics = ctx.measureText(feature.label);
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
                )}

                <div className="sticky bottom-6 z-10 flex items-center justify-between">
                    <button
                        type="button"
                        onClick={handleBack}
                        className={`flex h-12 items-center justify-center gap-2 rounded-xl px-6 text-base font-bold transition ${
                            step === 1
                                ? "pointer-events-none opacity-0"
                                : "bg-slate-800/80 text-white hover:bg-slate-800"
                        }`}
                    >
                        <span className="material-icons text-white text-[20px]">arrow_back</span>
                        <span>Back</span>
                    </button>
                    {!isLastStep && (
                        <button
                            type="button"
                            onClick={handleNext}
                            className="group relative overflow-hidden rounded-xl bg-blue-600 h-12 px-6 text-center transition-all hover:bg-blue-500 shadow-lg shadow-blue-900/30 hover:shadow-blue-700/40 hover:-translate-y-1"
                        >
                            <div className="relative z-10 flex items-center justify-center gap-3">
                                <span className="text-base font-bold text-white tracking-wide">Next</span>
                                <span className="material-icons text-white text-[20px]">arrow_forward</span>
                            </div>
                            <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:animate-[shimmer_1.5s_infinite]" />
                        </button>
                    )}
                    {isLastStep && (
                        <button
                            type="button"
                            className="group relative overflow-hidden rounded-xl bg-blue-600 h-12 px-6 text-center transition-all hover:bg-blue-500 shadow-lg shadow-blue-900/30 hover:shadow-blue-700/40 hover:-translate-y-1"
                        >
                            <div className="relative z-10 flex items-center justify-center gap-3">
                                <span className="text-white text-[20px]">DNA</span>
                                <span className="text-base font-bold text-white tracking-wide">
                                    Generate Primers
                                </span>
                            </div>
                            <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:animate-[shimmer_1.5s_infinite]" />
                        </button>
                    )}
                </div>
            </main>
        </div>
    );
}
