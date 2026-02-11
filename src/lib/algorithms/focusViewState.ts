import type { GenomeCanvasViewState, GenomeData, GenomeFeature } from "@/types";

type FocusRange = {
  start: number;
  end: number;
};

type FocusedViewStateOptions = {
  genome: GenomeData;
  viewportWidth: number;
  minScale: number;
  maxScale: number;
  paddingX?: number;
  fillRatio?: number;
  fallbackScale?: number;
};

const DEFAULT_PADDING_X = 20;
const DEFAULT_FILL_RATIO = 0.78;

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

const toNumber = (value: unknown) =>
  typeof value === "number" && Number.isFinite(value) ? value : null;

const isPrimerRelatedTrack = (trackIdOrName: string) => {
  const normalized = trackIdOrName.toLowerCase();
  return (
    normalized.includes("primer") ||
    normalized.includes("amplicon") ||
    normalized.includes("target")
  );
};

const isPrimerRelatedFeature = (feature: GenomeFeature) => {
  const label = String(feature.label ?? feature.name ?? feature.id ?? "").toLowerCase();
  return (
    label.includes("primer") ||
    label.includes("amplicon") ||
    label.includes("target")
  );
};

const extractFocusRange = (features: GenomeFeature[], genomeLength: number): FocusRange | null => {
  if (features.length === 0) return null;

  let minStart = Number.POSITIVE_INFINITY;
  let maxEnd = Number.NEGATIVE_INFINITY;

  for (const feature of features) {
    const rawStart = toNumber(feature.start ?? feature.start_bp);
    const rawEnd = toNumber(feature.end ?? feature.end_bp ?? rawStart);
    if (rawStart == null || rawEnd == null) continue;

    const start = Math.min(rawStart, rawEnd);
    const end = Math.max(rawStart, rawEnd);

    minStart = Math.min(minStart, start);
    maxEnd = Math.max(maxEnd, end);
  }

  if (!Number.isFinite(minStart) || !Number.isFinite(maxEnd)) return null;

  const safeLength = Math.max(1, genomeLength);
  const span = Math.max(1, maxEnd - minStart);
  const margin = Math.max(1, span * 0.25);

  return {
    start: clamp(minStart - margin, 0, safeLength),
    end: clamp(maxEnd + margin, 0, safeLength),
  };
};

const findPrimerFocusRange = (genome: GenomeData): FocusRange | null => {
  const tracks = Array.isArray(genome.tracks) ? genome.tracks : [];

  const focusTrackFeatures = tracks.flatMap((track) => {
    const id = String(track.id ?? "");
    const name = String(track.name ?? "");
    const isFocusTrack = isPrimerRelatedTrack(id) || isPrimerRelatedTrack(name);
    if (!isFocusTrack) return [];
    return Array.isArray(track.features) ? track.features : [];
  });

  const explicitFeatureMatches = tracks.flatMap((track) => {
    const features = Array.isArray(track.features) ? track.features : [];
    return features.filter(isPrimerRelatedFeature);
  });

  const primaryFeatures =
    focusTrackFeatures.length > 0 ? focusTrackFeatures : explicitFeatureMatches;

  return extractFocusRange(primaryFeatures, genome.length);
};

export const createFocusedPrimerViewState = ({
  genome,
  viewportWidth,
  minScale,
  maxScale,
  paddingX = DEFAULT_PADDING_X,
  fillRatio = DEFAULT_FILL_RATIO,
  fallbackScale = 1,
}: FocusedViewStateOptions): GenomeCanvasViewState => {
  const safeMinScale = Math.min(minScale, maxScale);
  const safeMaxScale = Math.max(minScale, maxScale);
  const focusRange = findPrimerFocusRange(genome);
  if (!focusRange) {
    return {
      scale: clamp(fallbackScale, safeMinScale, safeMaxScale),
      offsetX: 0,
      offsetY: 0,
    };
  }

  const safeLength = Math.max(1, genome.length);
  const drawableWidth = Math.max(1, viewportWidth - paddingX * 2);
  const safeFillRatio = clamp(fillRatio, 0.1, 0.98);
  const span = Math.max(1, focusRange.end - focusRange.start);
  const centerBp = (focusRange.start + focusRange.end) / 2;

  const scale = clamp((safeLength / span) * safeFillRatio, safeMinScale, safeMaxScale);
  const offsetX = drawableWidth / 2 - (centerBp / safeLength) * drawableWidth * scale;

  return {
    scale,
    offsetX,
    offsetY: 0,
  };
};
