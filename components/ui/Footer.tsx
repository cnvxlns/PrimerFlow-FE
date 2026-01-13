"use client";

export default function SiteFooter() {
    const year = new Date().getFullYear();

    return (
        <footer className="border-t border-slate-800/70 bg-[#050a14] text-slate-300">
            <div className="mx-auto flex w-full max-w-6xl flex-col gap-3 px-6 py-6 text-sm lg:px-10">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-baseline gap-2">
                        <span
                            className="text-base font-semibold text-white"
                            style={{ fontFamily: "var(--font-display)" }}
                        >
                            PrimerFlow
                        </span>
                        <span className="text-xs text-slate-500">Primer Design Workbench</span>
                    </div>

                    {/* <nav className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-slate-400">
                        <a className="hover:text-white transition-colors" href="#">
                            Docs
                        </a>
                        <a className="hover:text-white transition-colors" href="#">
                            API
                        </a>
                        <a className="hover:text-white transition-colors" href="#">
                            Contact
                        </a>
                    </nav> */}
                </div>

                <div className="flex flex-col gap-1 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
                    <span>© {year} SeqLab. All rights reserved.</span>
                </div>
            </div>
        </footer>
    );
}
