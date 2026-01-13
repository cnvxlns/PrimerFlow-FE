"use client";

type WizardStep = {
    id: number;
    label: string;
};

type WizardHeaderProps = {
    genomeLength: number;
    trackCount: number;
    featureCount: number;
    steps: readonly WizardStep[];
    step: number;
    onStepChange: (nextStep: number) => void;
};

export default function WizardHeader({
    genomeLength,
    trackCount,
    featureCount,
    steps,
    step,
    onStepChange,
}: WizardHeaderProps) {
    return (
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
                        <p className="text-sm text-slate-400 font-semibold">
                            demodesign 흐름을 따라 입력 -&gt; 특성 -&gt; 위치 -&gt; 특이성/미리보기 순으로 진행합니다.
                        </p>
                    </div>
                </div>
                <div className="flex flex-wrap items-center gap-2 text-sm">
                    <span className="rounded-full border border-slate-800 bg-slate-900/70 px-3 py-1 text-slate-200">
                        {genomeLength.toLocaleString()} bp genome
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
                <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 z-0 h-[2px] bg-slate-800" />
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
                                    onClick={() => isUnlocked && onStepChange(item.id)}
                                    className={`relative z-10 flex h-11 w-11 items-center justify-center rounded-full border text-sm font-bold transition ${
                                        isUnlocked
                                            ? circle
                                            : `${circle} cursor-not-allowed opacity-60`
                                    }`}
                                >
                                    {item.id}
                                </button>
                                <span className="text-[11px] text-center uppercase tracking-wide text-slate-400">
                                    {item.label}
                                </span>
                            </div>
                        );
                    })}
                </div>
            </div>
        </header>
    );
}
