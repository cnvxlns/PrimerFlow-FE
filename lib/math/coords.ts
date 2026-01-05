type BpScale = {
  pixelsPerBp: number;
  bpToX: (bp: number) => number;
  spanToWidth: (start: number, end: number, minWidth?: number) => number;
};

export function createBpScale(
  genomeLength: number,
  viewportWidth: number,
  paddingX = 0,
): BpScale {
  const safeLength = Math.max(1, genomeLength);
  const drawableWidth = Math.max(1, viewportWidth - paddingX * 2);
  const pixelsPerBp = drawableWidth / safeLength;

  return {
    pixelsPerBp,
    bpToX: (bp) => paddingX + bp * pixelsPerBp,
    spanToWidth: (start, end, minWidth = 2) =>
      Math.max(minWidth, (end - start) * pixelsPerBp),
  };
}
