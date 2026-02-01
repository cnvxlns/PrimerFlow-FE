import type { CSSProperties } from "react";

export type GenomeFeature = {
  id?: string;
  start: number;
  end: number;
  label?: string;
  color?: string;
};

export type GenomeTrack = {
  id: string;
  name?: string;
  height?: number;
  features: GenomeFeature[];
};

export type GenomeData = {
  length: number;
  tracks: GenomeTrack[];
};

export type GenomeCanvasViewState = {
  scale: number;
  offsetX: number;
  offsetY: number;
};

export type GenomeCanvasRenderState = {
  data?: GenomeData;
  viewState: GenomeCanvasViewState;
  viewport: {
    width: number;
    height: number;
    devicePixelRatio: number;
  };
};

export type GenomeCanvasProps = {
  className?: string;
  style?: CSSProperties;
  genome?: GenomeData;
  viewState?: GenomeCanvasViewState;
  initialViewState?: GenomeCanvasViewState;
  minScale?: number;
  maxScale?: number;
  onViewStateChange?: (nextViewState: GenomeCanvasViewState) => void;
  onDraw?: (
    ctx: CanvasRenderingContext2D,
    canvas: HTMLCanvasElement,
    renderState: GenomeCanvasRenderState,
  ) => void;
};
