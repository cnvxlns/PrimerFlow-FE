"use client";

import type { UIEvent } from "react";
import { useCallback, useMemo, useState } from "react";
import {
  createPrefixSums,
  findItemIndexByPosition,
  getVisibleRange,
  type VisibleRange,
} from "@/lib/algorithms/visibleRange";

export interface UseVisibleRangeOptions {
  itemHeights: number[];
  viewportHeight: number;
  overscan?: number;
  initialScrollTop?: number;
}

export interface UseVisibleRangeResult extends VisibleRange {
  scrollTop: number;
  totalHeight: number;
  onScroll: (event: UIEvent<HTMLElement>) => VisibleRange;
  setScrollTop: (nextScrollTop: number) => VisibleRange;
  findIndexByPosition: (targetPos: number) => number;
}

export const useVisibleRange = ({
  itemHeights,
  viewportHeight,
  overscan = 1,
  initialScrollTop = 0,
}: UseVisibleRangeOptions): UseVisibleRangeResult => {
  const [scrollTop, setScrollTopState] = useState(initialScrollTop);

  const prefixSums = useMemo(() => createPrefixSums(itemHeights), [itemHeights]);
  const totalHeight = prefixSums[prefixSums.length - 1] ?? 0;

  const findIndexByPosition = useCallback(
    (targetPos: number) => findItemIndexByPosition(prefixSums, targetPos),
    [prefixSums],
  );

  const computeVisibleRange = useCallback(
    (targetScrollTop: number) =>
      getVisibleRange(prefixSums, viewportHeight, overscan, targetScrollTop),
    [overscan, prefixSums, viewportHeight],
  );

  const visibleRange = useMemo(
    () => computeVisibleRange(scrollTop),
    [computeVisibleRange, scrollTop],
  );

  const setScrollTop = useCallback(
    (nextScrollTop: number) => {
      setScrollTopState(nextScrollTop);
      return computeVisibleRange(nextScrollTop);
    },
    [computeVisibleRange],
  );

  const onScroll = useCallback(
    (event: UIEvent<HTMLElement>) => {
      const nextScrollTop = event.currentTarget.scrollTop;
      setScrollTopState(nextScrollTop);
      return computeVisibleRange(nextScrollTop);
    },
    [computeVisibleRange],
  );

  return {
    ...visibleRange,
    scrollTop,
    totalHeight,
    onScroll,
    setScrollTop,
    findIndexByPosition,
  };
};

export default useVisibleRange;
