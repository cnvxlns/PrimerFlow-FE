import { describe, expect, it } from "vitest";

import {
  createPrefixSums,
  findItemIndexByPosition,
  getVisibleRange,
} from "../src/lib/algorithms/visibleRange";

describe("visibleRange smoke", () => {
  it("calculates prefix sums and visible range", () => {
    const heights = [10, 10, 10, 10, 10];
    const prefix = createPrefixSums(heights);

    expect(prefix).toEqual([0, 10, 20, 30, 40, 50]);
    expect(findItemIndexByPosition(prefix, 0)).toBe(0);
    expect(findItemIndexByPosition(prefix, 10)).toBe(1);
    expect(findItemIndexByPosition(prefix, 100)).toBe(4);

    expect(getVisibleRange(prefix, 15, 0, 0)).toEqual({
      startIndex: 0,
      endIndex: 1,
    });

    expect(getVisibleRange(prefix, 15, 1, 0)).toEqual({
      startIndex: 0,
      endIndex: 2,
    });
  });
});
