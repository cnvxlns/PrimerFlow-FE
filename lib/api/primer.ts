import type { AxiosResponse } from "axios";
import { apiClient } from "./client";

export interface Range {
  min: number;
  max: number;
}

export interface PrimerDesignRequest {
  basic: {
    templateSequence: string;
    targetOrganism: string;
    productSize: Range;
    primerTm: { min: number; opt: number; max: number };
  };
  properties: {
    gcContent: Range;
    maxTmDifference: number;
    gcClamp: boolean;
    maxPolyX: number;
    concentration: number;
  };
  specificity: {
    checkEnabled: boolean;
    spliceVariantHandling: boolean;
    snpExclusion: boolean;
    misprimingLibrary: boolean;
    endMismatchStrictness?: { regionSize: number; minMismatch: number };
  };
  position: {
    searchRange: { from: number; to: number };
    exonJunctionSpan: "none" | "flanking" | "spanning";
    intronInclusion: boolean;
    restrictionEnzymes: string[];
  };
}

export interface PrimerCandidate {
  id: string;
  sequence: string;
  start_bp: number;
  end_bp: number;
  strand: "forward" | "reverse";
  metrics: {
    tm_c?: number;
    gc_percent?: number;
    penalties?: any;
  };
}

export interface PrimerDesignResponse {
  genome: { id: string; name: string; sequence: string; length_bp: number };
  candidates: PrimerCandidate[];
  meta: any;
}

export const postDesignPrimers = async (
  payload: PrimerDesignRequest,
): Promise<PrimerDesignResponse> => {
  const response: AxiosResponse<PrimerDesignResponse> = await apiClient.post(
    "/api/v1/primer/design",
    payload,
  );

  return response.data;
};
