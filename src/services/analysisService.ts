import { api } from "@/lib/api/client";
import type {
  PrimerDesignRequest,
  PrimerDesignResponse,
  PrimerDesignResponseUI,
  UIPrimerCandidate,
  UIGenome,
} from "@/types";

// Flat input from UI (kept flexible)
export interface AnalyzeRequestInput {
  target_sequence?: string;
  templateSequence?: string;
  species?: string;
  targetOrganism?: string;
  analysis_type?: string;
  notes?: string;

  // Properties
  product_size_min?: number;
  product_size_max?: number;
  tm_min?: number;
  tm_opt?: number;
  tm_max?: number;
  gc_content_min?: number;
  gc_content_max?: number;
  max_tm_difference?: number;
  gc_clamp?: boolean;
  max_poly_x?: number;
  concentration?: number;

  // Specificity
  check_enabled?: boolean;
  splice_variant_handling?: boolean;
  snp_handling?: boolean;
  end_mismatch_region_size?: number;
  end_mismatch_min_mismatch?: number;
  mispriming_library?: boolean;

  // Position
  search_start?: number;
  search_end?: number;
  exon_junction_span?: string;
  intron_inclusion?: boolean;
  intron_size_min?: number;
  intron_size_max?: number;
  restriction_enzymes?: string[];
}

// Adapter: flat UI -> official request schema
const toPrimerDesignRequest = (input: AnalyzeRequestInput): PrimerDesignRequest => {
  const seq = input.target_sequence || input.templateSequence || "ATGC";
  const searchFrom = input.search_start ?? 1;
  const searchTo =
    input.search_end ??
    searchFrom + (seq?.length || 1000);

  return {
    basic: {
      templateSequence: seq,
      targetOrganism: input.species || input.targetOrganism || "Homo sapiens",
      productSize: {
        min: input.product_size_min ?? 100,
        max: input.product_size_max ?? 300,
      },
      primerTm: {
        min: input.tm_min ?? 57,
        opt: input.tm_opt ?? 60,
        max: input.tm_max ?? 63,
      },
    },
    properties: {
      gcContent: {
        min: input.gc_content_min ?? 40,
        max: input.gc_content_max ?? 60,
      },
      maxTmDifference: input.max_tm_difference ?? 1,
      gcClamp: input.gc_clamp ?? false,
      maxPolyX: input.max_poly_x ?? 5,
      concentration: input.concentration ?? 50,
    },
    specificity: {
      checkEnabled: input.check_enabled ?? true,
      spliceVariantHandling: input.splice_variant_handling ?? false,
      snpExclusion: input.snp_handling ?? false,
      endMismatchStrictness:
        input.end_mismatch_region_size != null || input.end_mismatch_min_mismatch != null
          ? {
              regionSize: input.end_mismatch_region_size ?? 5,
              minMismatch: input.end_mismatch_min_mismatch ?? 1,
            }
          : undefined,
      misprimingLibrary: input.mispriming_library ?? false,
    },
    position: {
      searchRange: { from: searchFrom, to: searchTo },
      exonJunctionSpan:
        (input.exon_junction_span === "no_pref" || !input.exon_junction_span)
          ? "none"
          : (input.exon_junction_span as "none" | "flanking" | "spanning"),
      intronInclusion: input.intron_inclusion ?? false,
      intronSize:
        input.intron_size_min != null || input.intron_size_max != null
          ? { min: input.intron_size_min ?? 0, max: input.intron_size_max ?? 0 }
          : undefined,
      restrictionEnzymes: input.restriction_enzymes ?? [],
    },
  } as PrimerDesignRequest;
};

// Normalize genome and candidates for UI (tracks + start/end/color)
const toUiResponse = (raw: PrimerDesignResponse): PrimerDesignResponseUI => {
  const genome = raw.genome || ({} as any);
  const length = genome.length_bp ?? genome.length ?? genome.sequence?.length ?? 0;

  const baseTracks =
    Array.isArray(genome.tracks) && genome.tracks.length
      ? genome.tracks.map((t: any, idx: number) => {
          const start = Number(t.start ?? t.start_bp ?? 0);
          const end = Number(t.end ?? t.end_bp ?? start);
          const label = t.label || t.name || t.type || `Track ${idx + 1}`;
          const color = t.color || (t.type === "target_region" ? "#3b82f6" : "#94a3b8");
          return {
            id: t.id || t.type || `track-${idx}`,
            name: label,
            features: [
              {
                id: t.id || `feature-${idx}`,
                start,
                end,
                label,
                color,
              },
            ],
          };
        })
      : [];

  const uiCandidates: UIPrimerCandidate[] = (raw.candidates || []).map((c, idx) => {
    const isForward = c.strand === "forward";
    return {
      ...c,
      start: Number((c as any).start ?? c.start_bp ?? 0),
      end: Number((c as any).end ?? c.end_bp ?? 0),
      label: c.id || `Primer ${idx + 1}`,
      type: "primer",
      color: isForward ? "#2196F3" : "#4CAF50",
      metrics: c.metrics || { tm_c: 0, gc_percent: 0, penalties: { score: 0 } },
    };
  });

  const primerTrack =
    uiCandidates.length > 0
      ? [
          {
            id: "primers",
            name: "Primers",
            features: uiCandidates.map((c, idx) => ({
              id: c.id || `primer-${idx}`,
              start: c.start ?? 0,
              end: c.end ?? 0,
              label: c.label,
              color: c.color,
            })),
          },
        ]
      : [];

  const starts = uiCandidates.map((c) => c.start ?? 0).filter((n) => Number.isFinite(n));
  const ends = uiCandidates.map((c) => c.end ?? 0).filter((n) => Number.isFinite(n));
  const ampTrack =
    starts.length && ends.length
      ? [
          {
            id: "amplicon",
            name: "Amplicon",
            features: [
              {
                id: "amplicon-1",
                start: Math.min(...starts),
                end: Math.max(...ends),
                label: "Amplicon",
                color: "#f97316",
              },
            ],
          },
        ]
      : [];

  const uiGenome: UIGenome = {
    ...genome,
    length_bp: genome.length_bp ?? length,
    tracks: [...baseTracks, ...ampTrack, ...primerTrack],
  };

  return {
    ...raw,
    genome: uiGenome,
    candidates: uiCandidates,
  };
};

export const analyzeGenome = async (
  input: AnalyzeRequestInput,
): Promise<PrimerDesignResponseUI> => {
  const payload = toPrimerDesignRequest(input);

  console.log("🚀 Sending Payload:", payload);

  const response = await api.post<PrimerDesignResponse>("/primer/design", payload);
  const rawData = response.data;

  const transformed = toUiResponse(rawData);
  console.log("✅ Transformed Data for UI:", transformed);
  return transformed;
};
