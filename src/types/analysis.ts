  // --- Official Spec Start ---
export interface Range {
  min: number;
  max: number;
}

export interface PrimerDesignRequest {
  // 1. Basic Input
  basic: {
    templateSequence: string;
    targetOrganism: string;
    productSize: Range;
    primerTm: {
      min: number;
      opt: number;
      max: number;
    };
  };

  // 2. Primer Property
  properties: {
    gcContent: Range;
    maxTmDifference: number;
    gcClamp: boolean;
    maxPolyX: number;
    concentration: number;
  };

  // 3. Primer Specificity
  specificity: {
    checkEnabled: boolean;
    spliceVariantHandling: boolean;
    snpExclusion: boolean;
    endMismatchStrictness?: {
      regionSize: number;
      minMismatch: number;
    };
    misprimingLibrary: boolean;
  };

  // 4. Primer Binding Position
  position: {
    searchRange: { from: number; to: number };
    exonJunctionSpan: "none" | "flanking" | "spanning";
    intronInclusion: boolean;
    intronSize?: Range;
    restrictionEnzymes: string[];
  };
}

export interface GenomeSequence {
  id: string;
  name: string;
  sequence: string;
  length_bp: number;
  // Some responses may provide total length as `length`; keep optional for compatibility.
  length?: number;
  // UI helper fields (optional)
  tracks?: unknown[];
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
    penalties?: unknown;
  };
}

export interface PrimerDesignResponse {
  // Optional analysis summary fields (used by UI in mock/preview modes).
  result?: string;
  score?: number;
  details?: unknown;
  genome: GenomeSequence;
  candidates: PrimerCandidate[];
  meta: {
    params: PrimerDesignRequest;
    timestamp: string;
    execution_time_ms?: number;
  };
}
// --- Official Spec End ---

// UI helper types (not part of the spec but used client-side)
export type UIPrimerCandidate = PrimerCandidate & {
  start?: number;
  end?: number;
  label?: string;
  color?: string;
  type?: string;
};

export type UIGenome = GenomeSequence & {
  tracks?: Array<{
    id: string;
    name?: string;
    features: Array<{
      id?: string;
      start: number;
      end: number;
      label?: string;
      color?: string;
    }>;
  }>;
};

export type PrimerDesignResponseUI = PrimerDesignResponse & {
  genome: UIGenome;
  candidates: UIPrimerCandidate[];
};
