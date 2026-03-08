import type { PrimerDesignResponseUI } from "@/types";

type PrimerResultStorageEnvelope = {
  createdAt: string;
  apiResult: PrimerDesignResponseUI;
};

const PRIMER_RESULT_STORAGE_PREFIX = "primerflow:result:";

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null;

const createStorageKey = () =>
  `${PRIMER_RESULT_STORAGE_PREFIX}${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;

export const savePrimerResultToStorage = (apiResult: PrimerDesignResponseUI): string => {
  if (typeof window === "undefined") {
    throw new Error("Primer result can only be stored in a browser environment.");
  }

  const key = createStorageKey();
  const payload: PrimerResultStorageEnvelope = {
    createdAt: new Date().toISOString(),
    apiResult,
  };
  window.localStorage.setItem(key, JSON.stringify(payload));
  return key;
};

export const loadPrimerResultFromStorage = (
  key: string,
): PrimerDesignResponseUI | null => {
  if (typeof window === "undefined") return null;

  const rawValue = window.localStorage.getItem(key);
  if (!rawValue) return null;

  try {
    const parsedValue: unknown = JSON.parse(rawValue);
    if (!isRecord(parsedValue)) return null;

    const apiResult = parsedValue.apiResult;
    if (!isRecord(apiResult)) return null;

    return apiResult as PrimerDesignResponseUI;
  } catch {
    return null;
  }
};
