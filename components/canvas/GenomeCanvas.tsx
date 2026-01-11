"use client";

import type { PointerEvent, WheelEvent } from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import type {
  GenomeCanvasProps,
  GenomeCanvasRenderState,
  GenomeCanvasViewState,
} from "@/lib/types/Genome";

const DEFAULT_VIEW_STATE: GenomeCanvasViewState = {
  scale: 1,
  offsetX: 0,
  offsetY: 0,
};

export default function GenomeCanvas({
                                       className,
                                       style,
                                       genome,
                                       viewState,
                                       initialViewState,
                                       minScale = 0.1,
                                       maxScale = 50,
                                       onViewStateChange,
                                       onDraw,
                                     }: GenomeCanvasProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // 뷰포트 크기를 상태로 관리
  const [viewport, setViewport] = useState({ width: 0, height: 0 });

  // 인터랙션(패닝/줌) 상태 관리
  const isPanningRef = useRef(false);
  const lastPointerRef = useRef<{ x: number; y: number } | null>(null);

  // 내부 상태 (외부에서 viewState를 주입하지 않았을 때 사용)
  const [internalViewState, setInternalViewState] = useState<GenomeCanvasViewState>(
      initialViewState ?? DEFAULT_VIEW_STATE,
  );

  const activeViewState = viewState ?? internalViewState;

  // 뷰 상태 변경 핸들러
  const commitViewState = useCallback(
      (nextViewState: GenomeCanvasViewState) => {
        // 외부 제어 상태가 아닐 때만 내부 상태 업데이트
        if (!viewState) {
          setInternalViewState(nextViewState);
        }
        onViewStateChange?.(nextViewState);
      },
      [onViewStateChange, viewState],
  );

  // 1. ResizeObserver: 부모 컨테이너 크기 감지
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const resizeObserver = new ResizeObserver((entries) => {
      if (!entries || entries.length === 0) return;
      const { width, height } = entries[0].contentRect;
      setViewport({ width, height });
    });

    resizeObserver.observe(container);

    return () => resizeObserver.disconnect();
  }, []);

  // 2. 렌더링 루프 (useEffect)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const { width, height } = viewport;
    if (width === 0 || height === 0) return;

    // High DPI 처리 (Retina 디스플레이 대응)
    const dpr = window.devicePixelRatio || 1;

    // 캔버스의 실질적 픽셀 크기 조정
    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);

    // CSS 크기는 부모 div에 의해 100%로 맞춰짐
    // 캔버스 내부 컨텍스트 스케일 조정
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    // 초기화
    ctx.clearRect(0, 0, width, height);

    // 렌더링 상태 객체 생성
    const renderState: GenomeCanvasRenderState = {
      data: genome,
      viewState: activeViewState,
      viewport: {
        width,
        height,
        devicePixelRatio: dpr,
      },
    };

    // 자동 변환 적용 (translate/scale)
    ctx.save();
    ctx.translate(activeViewState.offsetX, activeViewState.offsetY);
    ctx.scale(activeViewState.scale, 1);

    // 사용자 정의 그리기 함수 호출
    onDraw?.(ctx, canvas, renderState);

    ctx.restore();
  }, [activeViewState, genome, viewport, onDraw]);

  // --- 이벤트 핸들러들 ---
  const handlePointerDown = useCallback(
      (event: PointerEvent<HTMLCanvasElement>) => {
        if (event.button !== 0) return;
        isPanningRef.current = true;
        lastPointerRef.current = { x: event.clientX, y: event.clientY };
        event.currentTarget.setPointerCapture(event.pointerId);
      },
      [],
  );

  const handlePointerMove = useCallback(
      (event: PointerEvent<HTMLCanvasElement>) => {
        if (!isPanningRef.current || !lastPointerRef.current) return;
        const last = lastPointerRef.current;
        const dx = event.clientX - last.x;
        const dy = event.clientY - last.y;
        lastPointerRef.current = { x: event.clientX, y: event.clientY };

        commitViewState({
          ...activeViewState,
          offsetX: activeViewState.offsetX + dx,
          offsetY: activeViewState.offsetY + dy,
        });
      },
      [activeViewState, commitViewState],
  );

  const handlePointerUp = useCallback((event: PointerEvent<HTMLCanvasElement>) => {
    if (!isPanningRef.current) return;
    isPanningRef.current = false;
    lastPointerRef.current = null;
    event.currentTarget.releasePointerCapture(event.pointerId);
  }, []);

  const handleWheel = useCallback(
      (event: WheelEvent<HTMLCanvasElement>) => {
        event.preventDefault(); // 스크롤 방지
        const rect = event.currentTarget.getBoundingClientRect();
        const pointerX = event.clientX - rect.left;

        const zoomIntensity = 0.0015;
        const nextScale = Math.min(
            maxScale,
            Math.max(minScale, activeViewState.scale * Math.exp(-event.deltaY * zoomIntensity)),
        );

        // 마우스 포인터 위치를 기준으로 줌
        const worldX = (pointerX - activeViewState.offsetX) / activeViewState.scale;
        const nextOffsetX = pointerX - worldX * nextScale;

        commitViewState({
          ...activeViewState,
          scale: nextScale,
          offsetX: nextOffsetX,
        });
      },
      [activeViewState, commitViewState, maxScale, minScale],
  );

  return (
      <div
          ref={containerRef}
          className={className}
          style={{ width: "100%", height: "100%", ...style }}
      >
        <canvas
            ref={canvasRef}
            style={{
              display: "block",
              width: "100%",
              height: "100%",
              touchAction: "none",
            }}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
            onWheel={handleWheel}
        />
      </div>
  );
}
