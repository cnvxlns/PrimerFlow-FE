"use client";

import { MapPin } from "lucide-react";

export default function Step3BindingLocation() {
    return (
        <section className="flex flex-col gap-4">
            <div className="rounded-xl border border-slate-800/70 bg-slate-900/80 px-4 py-3 text-base font-bold text-slate-300">
                Step 3. 결합 위치(검색 범위)와 구조 관련 옵션을 설정하세요.
            </div>
            <div className="rounded-2xl border border-slate-800/70 bg-slate-900/80 backdrop-blur">
                <div className="px-5 py-3 border-b border-slate-800 bg-[#161920]/50 flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-primary" aria-hidden="true" />
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
    );
}
