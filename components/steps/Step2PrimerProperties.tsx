"use client";

import { FlaskConical } from "lucide-react";

export default function Step2PrimerProperties() {
    return (
        <section className="flex flex-col gap-4">
            <div className="rounded-xl border border-slate-800/70 bg-slate-900/80 px-4 py-3 text-base font-bold text-slate-300">
                Step 2. 프라이머 물성과 클램프/폴리X/농도를 설정하세요.
            </div>
            <div className="rounded-2xl border border-slate-800/70 bg-slate-900/80 backdrop-blur">
                <div className="px-5 py-3 border-b border-slate-800 bg-[#161920]/50 flex items-center gap-2">
                    <FlaskConical className="h-5 w-5 text-primary" aria-hidden="true" />
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
    );
}
