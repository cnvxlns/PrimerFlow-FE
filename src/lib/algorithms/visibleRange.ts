export interface VisibleRange {
  startIndex: number;
  endIndex: number;
}

const EMPTY_RANGE: VisibleRange = {
  startIndex: 0,
  endIndex: -1,
};

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

const normalizeHeight = (height: number) =>
  Number.isFinite(height) ? Math.max(0, height) : 0;

export const createPrefixSums = (itemHeights: number[]) => {
  const prefixSums = new Array(itemHeights.length + 1).fill(0);

  for (let index = 0; index < itemHeights.length; index += 1) {
    prefixSums[index + 1] = prefixSums[index] + normalizeHeight(itemHeights[index]);
  }

  return prefixSums;
};

export const findItemIndexByPosition = (prefixSums: number[], targetPos: number) => {
  const itemCount = Math.max(prefixSums.length - 1, 0);
  if (itemCount === 0) return -1;

  const totalHeight = prefixSums[itemCount];
  if (totalHeight <= 0) return 0;

  const clampedPos = clamp(targetPos, 0, totalHeight - Number.EPSILON);

  let left = 0;
  let right = itemCount - 1;

  while (left < right) {
    const middle = Math.floor((left + right) / 2);
    if (prefixSums[middle + 1] <= clampedPos) {
      left = middle + 1;
    } else {
      right = middle;
    }
  }

  return left;
};

export const getVisibleRange = (
  prefixSums: number[],
  viewportHeight: number,
  overscan: number,
  targetScrollTop: number,
): VisibleRange => {
  const itemCount = Math.max(prefixSums.length - 1, 0);
  if (itemCount === 0) return EMPTY_RANGE;

  const totalHeight = prefixSums[itemCount];
  const safeViewportHeight = Math.max(0, viewportHeight);
  const safeOverscan = Math.max(0, Math.floor(overscan));
  const maxScrollTop = Math.max(0, totalHeight - safeViewportHeight);
  const scrollTop = clamp(targetScrollTop, 0, maxScrollTop);

  const start = findItemIndexByPosition(prefixSums, scrollTop);
  const viewportBottom = scrollTop + Math.max(0, safeViewportHeight - Number.EPSILON);
  const end = findItemIndexByPosition(prefixSums, viewportBottom);

  return {
    startIndex: Math.max(0, start - safeOverscan),
    endIndex: Math.min(itemCount - 1, end + safeOverscan),
  };
};
