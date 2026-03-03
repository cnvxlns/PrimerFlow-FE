"use client";

import { usePrimerDesign } from "@/hooks/usePrimerDesign";
import type { PrimerDesignRequest } from "@/types";

export default function PrimerDesignTrigger() {
  const { mutate, isPending, error, isSuccess } = usePrimerDesign();

  const handleDesignClick = () => {
    const payload: PrimerDesignRequest = {
      basic: {
        templateSequence: "ATGCATGCATGCATGC",
        targetOrganism: "E. coli",
        productSize: { min: 100, max: 300 },
        primerTm: { min: 55, opt: 60, max: 65 },
      },
      properties: {
        gcContent: { min: 40, max: 60 },
        maxTmDifference: 3,
        gcClamp: true,
        maxPolyX: 4,
        concentration: 50,
      },
      specificity: {
        checkEnabled: true,
        spliceVariantHandling: false,
        snpExclusion: false,
        misprimingLibrary: false,
      },
      position: {
        searchRange: { from: 1, to: 500 },
        exonJunctionSpan: "none",
        intronInclusion: false,
        restrictionEnzymes: [],
      },
    };

    mutate(payload);
  };

  return (
    <div className="p-4 border rounded shadow-sm">
      <h3 className="text-lg font-bold mb-2">Smoke Test</h3>

      <button
        onClick={handleDesignClick}
        disabled={isPending}
        className={`px-4 py-2 rounded text-white font-semibold transition-colors ${
          isPending ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
        }`}
      >
        {isPending ? (
          <span className="flex items-center gap-2">
            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
              ></path>
            </svg>
            설계 요청 중...
          </span>
        ) : (
          "프라이머 설계 시작 (Test)"
        )}
      </button>

      {error && (
        <div className="mt-3 p-2 bg-red-100 text-red-700 rounded text-sm">
          ❌ 에러 발생: {error.message}
          <br />
          (백엔드가 켜져 있는지, 포트가 맞는지 확인하세요)
        </div>
      )}

      {isSuccess && (
        <div className="mt-3 p-2 bg-green-100 text-green-700 rounded text-sm">
          ✅ 설계 요청 성공! (콘솔이나 결과창을 확인하세요)
        </div>
      )}
    </div>
  );
}
