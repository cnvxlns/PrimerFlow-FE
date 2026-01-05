"use client";

import { create } from "zustand";
import type { GenomeCanvasViewState } from "@/components/canvas/GenomeCanvas";

type ViewStore = {
  viewState: GenomeCanvasViewState;
  setViewState: (nextViewState: GenomeCanvasViewState) => void;
  resetViewState: () => void;
};

const DEFAULT_VIEW_STATE: GenomeCanvasViewState = {
  scale: 1,
  offsetX: 0,
  offsetY: 0,
};

export const useViewStore = create<ViewStore>((set) => ({
  viewState: DEFAULT_VIEW_STATE,
  setViewState: (nextViewState) => set({ viewState: nextViewState }),
  resetViewState: () => set({ viewState: DEFAULT_VIEW_STATE }),
}));
