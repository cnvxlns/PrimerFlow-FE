"use client";

import { type ChangeEvent, useMemo, useRef, useState } from "react";
import { SlidersHorizontal } from "lucide-react";
import TextareaAutosize from "react-textarea-autosize";

export default function Step1TemplateEssential() {
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const textareaRef = useRef<HTMLTextAreaElement | null>(null);
    const [sequenceInput, setSequenceInput] = useState("");

    const basePairCount = useMemo(
        () => sequenceInput.replace(/[^A-Za-z]/g, "").length,
        [sequenceInput],
    );

    const focusTextarea = () => textareaRef.current?.focus();

    const appendSequence = (next: string) => {
        const sanitized = next.trim();

        if (!sanitized) {
            focusTextarea();
            return;
        }

        setSequenceInput((prev) => (prev ? `${prev}\n${sanitized}` : sanitized));
        focusTextarea();
    };

    const handleUploadClick = () => fileInputRef.current?.click();

    const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];

        if (!file) return;

        try {
            const text = await file.text();
            appendSequence(text);
        } catch (error) {
            console.error("Failed to read FASTA file", error);
        } finally {
            event.target.value = "";
        }
    };

    const handlePasteClick = async () => {
        if (!navigator.clipboard?.readText) {
            console.error("Clipboard API is not available in this browser.");
            return;
        }

        try {
            const text = await navigator.clipboard.readText();
            appendSequence(text);
        } catch (error) {
            console.error("Failed to read from clipboard", error);
        }
    };

    const handleCleanClick = () => {
        setSequenceInput("");
        focusTextarea();
    };

    return (
        <section className="flex flex-col gap-4">
            <div className="rounded-xl border border-slate-800/70 bg-slate-900/80 px-4 py-3 text-base font-bold text-slate-300">
                Step 1. 템플릿 시퀀스와 기본 설정을 입력하세요.
            </div>

            <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr] items-start">
                <div className="flex flex-col rounded-xl border border-slate-800/70 bg-slate-900/70 overflow-hidden shadow-lg shadow-black/20">
                <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800 bg-[#161920]">
                    <div className="flex items-center gap-2">
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
                            <span className="text-xs text-slate-500 font-mono">{basePairCount} bp</span>
                        </div>
                        <div className="relative flex-1">
                            <TextareaAutosize
                                ref={textareaRef}
                                className="w-full min-h-[200px] resize-none overflow-y-auto rounded-lg border border-slate-800 bg-[#0b1224] text-white p-4 font-mono text-sm leading-relaxed focus:border-blue-500 focus:ring-1 focus:ring-blue-500 placeholder:text-gray-600 transition-colors"
                                placeholder={">Seq1\nATGCGT..."}
                                spellCheck={false}
                                minRows={10}
                                maxRows={20}
                                value={sequenceInput}
                                onChange={(event) => setSequenceInput(event.target.value)}
                            />
                        </div>
                    </label>
                    <div className="flex flex-wrap gap-2 justify-end">
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept=".fa,.fasta,.txt"
                            className="hidden"
                            onChange={handleFileChange}
                        />
                        <button
                            type="button"
                            className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-bold text-slate-300 hover:text-white hover:bg-slate-800 transition-colors border border-transparent hover:border-slate-700"
                            onClick={handleUploadClick}
                        >
                            Upload FASTA
                        </button>
                        <button
                            type="button"
                            className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-bold text-slate-300 hover:text-white hover:bg-slate-800 transition-colors border border-transparent hover:border-slate-700"
                            onClick={handlePasteClick}
                        >
                            Paste
                        </button>
                        <button
                            type="button"
                            className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-bold text-slate-300 hover:text-white hover:bg-slate-800 transition-colors border border-transparent hover:border-slate-700"
                            onClick={handleCleanClick}
                        >
                            Clean
                        </button>
                    </div>
                </div>
            </div>

                <div className="flex flex-col gap-6">
                    <div className="bg-slate-900/80 border border-slate-800 rounded-xl overflow-hidden shadow-sm backdrop-blur">
                    <div className="px-5 py-3 border-b border-slate-800 bg-[#161920]/50 flex items-center gap-2">
                        <SlidersHorizontal className="h-5 w-5 text-primary" aria-hidden="true" />
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
                                    {
                                        label: "Min",
                                        value: 57.0,
                                        tone: "text-slate-200",
                                        border: "border-slate-800",
                                    },
                                    {
                                        label: "Opt",
                                        value: 60.0,
                                        tone: "text-blue-100",
                                        border: "border-blue-500/50",
                                    },
                                    {
                                        label: "Max",
                                        value: 63.0,
                                        tone: "text-slate-200",
                                        border: "border-slate-800",
                                    },
                                ].map((item) => (
                                    <div key={item.label} className="relative">
                                        <span
                                            className={`absolute top-[-1.2em] left-0 text-[10px] ${
                                                item.label === "Opt"
                                                    ? "text-primary font-bold"
                                                    : "text-slate-500"
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
            </div>
        </section>
    );
}
