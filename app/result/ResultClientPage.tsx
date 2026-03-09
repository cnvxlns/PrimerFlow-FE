"use client";

import { useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import PrimerResultModal from "@/components/PrimerResultModal";
import { loadPrimerResultFromStorage } from "@/lib/storage/primerResultStorage";
import type { GenomeData, PrimerDesignResponseUI } from "@/types";

const toGenomeDataFromResponse = (
  response: PrimerDesignResponseUI | null,
): GenomeData | null => {
  if (!response?.genome) return null;

  const length =
    response.genome.length ??
    response.genome.length_bp ??
    response.genome.sequence?.length ??
    0;

  return {
    length,
    tracks: response.genome.tracks ?? [],
  };
};

export default function ResultClientPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const resultKey = searchParams.get("resultKey");

  const { apiResult, errorMessage } = useMemo(() => {
    if (!resultKey) {
      return {
        apiResult: null as PrimerDesignResponseUI | null,
        errorMessage: null as string | null,
      };
    }

    const restoredResult = loadPrimerResultFromStorage(resultKey);
    if (!restoredResult) {
      return {
        apiResult: null as PrimerDesignResponseUI | null,
        errorMessage: "결과 데이터를 찾을 수 없습니다. 메인 페이지에서 다시 실행해 주세요.",
      };
    }

    return {
      apiResult: restoredResult,
      errorMessage: null as string | null,
    };
  }, [resultKey]);

  const resultGenome = useMemo(
    () => toGenomeDataFromResponse(apiResult),
    [apiResult],
  );

  const closeTab = () => {
    window.close();
    router.push("/");
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#070d18] text-slate-100">
      {!resultKey && (
        <main className="relative mx-auto flex min-h-screen w-full max-w-3xl items-center justify-center px-6 py-10 text-center">
          <div className="space-y-3 rounded-2xl border border-slate-800 bg-slate-900/80 p-8">
            <p className="text-sm uppercase tracking-[0.18em] text-slate-400">
              Primer Design
            </p>
            <h1 className="text-2xl font-semibold text-white">
              결과를 준비 중입니다.
            </h1>
            <p className="text-sm text-slate-300">
              메인 탭에서 분석이 완료되면 이 페이지가 자동으로 업데이트됩니다.
            </p>
          </div>
        </main>
      )}

      {resultKey && errorMessage && (
        <main className="relative mx-auto flex min-h-screen w-full max-w-3xl items-center justify-center px-6 py-10 text-center">
          <div className="space-y-4 rounded-2xl border border-red-500/40 bg-slate-900/80 p-8">
            <h1 className="text-2xl font-semibold text-white">결과 로딩 실패</h1>
            <p className="text-sm text-red-200">{errorMessage}</p>
            <button
              type="button"
              onClick={() => router.push("/")}
              className="rounded-full border border-slate-700 bg-slate-800 px-4 py-2 text-sm font-semibold text-slate-100 transition hover:border-blue-500 hover:text-white"
            >
              메인으로 이동
            </button>
          </div>
        </main>
      )}

      {resultKey && apiResult && resultGenome && (
        <main className="relative mx-auto w-full px-6 py-10 lg:px-10">
          <PrimerResultModal
            apiResult={apiResult}
            genome={resultGenome}
            onClose={closeTab}
          />
        </main>
      )}
    </div>
  );
}
