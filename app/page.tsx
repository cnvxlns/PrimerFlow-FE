"use client";

import GenomeCanvas, { type GenomeData } from "@/components/canvas/GenomeCanvas";
import { createBpScale } from "@/lib/math/coords"; // 만약 이 파일이 없다면 아래 주석 참고
import { useViewStore } from "@/store/useViewStore";

/**
 * 둥근 사각형 그리기 유틸리티
 */
const drawRoundedRect = (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    width: number,
    height: number,
    radius: number,
) => {
    const r = Math.min(radius, width / 2, height / 2);
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + width, y, x + width, y + height, r);
    ctx.arcTo(x + width, y + height, x, y + height, r);
    ctx.arcTo(x, y + height, x, y, r);
    ctx.arcTo(x, y, x + width, y, r);
    ctx.closePath();
};

export default function Home() {
    const viewState = useViewStore((state) => state.viewState);
    const setViewState = useViewStore((state) => state.setViewState);
    const resetViewState = useViewStore((state) => state.resetViewState);

    const minScale = 0.1;
    const maxScale = 50;
    const zoomStep = 1.2;

    const clampScale = (scale: number) => Math.min(maxScale, Math.max(minScale, scale));
    const handleZoomIn = () =>
        setViewState({ ...viewState, scale: clampScale(viewState.scale * zoomStep) });
    const handleZoomOut = () =>
        setViewState({ ...viewState, scale: clampScale(viewState.scale / zoomStep) });

    // 더미 데이터
    const genome: GenomeData = {
        length: 12000,
        tracks: [
            {
                id: "track-1",
                name: "Primer 후보군",
                height: 28,
                features: [
                    { id: "f1", start: 400, end: 1200, label: "P-01", color: "#2563eb" },
                    { id: "f2", start: 1800, end: 2600, label: "P-02", color: "#0ea5e9" },
                    { id: "f3", start: 3200, end: 4300, label: "P-03", color: "#22c55e" },
                ],
            },
            {
                id: "track-2",
                name: "Target 구간",
                height: 18,
                features: [
                    { id: "t1", start: 1500, end: 5200, label: "Amplicon", color: "#f97316" },
                ],
            },
        ],
    };

    return (
        <div className="min-h-screen bg-slate-50 px-8 py-12 text-slate-900">
            <main className="mx-auto flex w-full max-w-5xl flex-col gap-6">
                <header className="flex flex-col gap-2">
                    <h1 className="text-2xl font-semibold">Genome Canvas Preview</h1>
                    <p className="text-sm text-slate-500">
                        더미 데이터를 이용해 GenomeCanvas 렌더링을 확인합니다.
                    </p>
                </header>

                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                    {/* 컨트롤 버튼 영역 */}
                    <div className="mb-4 flex flex-wrap items-center gap-3 text-sm text-slate-600">
                        <div className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1">
                            Zoom: {viewState.scale.toFixed(2)}x
                        </div>
                        <button
                            type="button"
                            className="rounded-full border border-slate-200 px-3 py-1 text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
                            onClick={handleZoomOut}
                        >
                            Zoom out
                        </button>
                        <button
                            type="button"
                            className="rounded-full border border-slate-200 px-3 py-1 text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
                            onClick={handleZoomIn}
                        >
                            Zoom in
                        </button>
                        <button
                            type="button"
                            className="rounded-full border border-slate-200 px-3 py-1 text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
                            onClick={resetViewState}
                        >
                            Reset view
                        </button>
                    </div>

                    {/* 캔버스 컴포넌트 */}
                    <GenomeCanvas
                        genome={genome}
                        viewState={viewState}
                        onViewStateChange={setViewState}
                        className="w-full"
                        style={{ height: "450px" }} // 높이 고정 (반응형 너비)
                        onDraw={(ctx, _canvas, renderState) => {
                            const { data, viewport, viewState } = renderState;
                            if (!data) return;

                            // ✅ [핵심 수정] DPI를 고려한 Transform 초기화
                            // GenomeCanvas에서 설정한 dpr 값을 그대로 가져와야 함 (안 그러면 1/dpr 배로 작아짐)
                            const dpr = viewport.devicePixelRatio || 1;
                            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

                            // 1. 배경 지우기 및 그리기
                            ctx.fillStyle = "#f8fafc";
                            ctx.fillRect(0, 0, viewport.width, viewport.height);

                            // 2. 레이아웃 상수 계산
                            const paddingX = 20;
                            // 높이가 너무 작으면 글씨 크기도 줄이는 반응형 레이아웃 스케일
                            const layoutScale = Math.min(1.4, Math.max(1, viewport.height / 400));

                            const headerY = 28 * layoutScale;
                            const trackStartY = 64 * layoutScale;
                            const trackGap = 28 * layoutScale;

                            // 3. 좌표 변환 함수
                            const bpScale = createBpScale(data.length, viewport.width - paddingX * 2, 0);

                            const toScreenX = (bp: number) =>
                                paddingX + viewState.offsetX + bpScale.bpToX(bp) * viewState.scale;

                            const toScreenWidth = (start: number, end: number) => {
                                const rawWidth = bpScale.spanToWidth(start, end, 0) * viewState.scale;
                                return Math.max(2, rawWidth); // 최소 2px 보장
                            };

                            // 4. 헤더 텍스트 그리기
                            ctx.fillStyle = "#0f172a";
                            ctx.font = `600 ${14 * layoutScale}px ui-sans-serif, system-ui`;
                            ctx.fillText(`Genome length`, paddingX, headerY - 6 * layoutScale);

                            ctx.fillStyle = "#475569";
                            ctx.font = `${12 * layoutScale}px ui-sans-serif, system-ui`;
                            ctx.fillText(
                                `${data.length.toLocaleString()} bp`,
                                paddingX,
                                headerY + 10 * layoutScale,
                            );

                            // 5. 그리드 라인 그리기
                            ctx.strokeStyle = "#e2e8f0";
                            ctx.lineWidth = 1;
                            for (let i = 0; i <= 10; i += 1) {
                                const x = paddingX + i * ((viewport.width - paddingX * 2) / 10);
                                ctx.beginPath();
                                ctx.moveTo(x, trackStartY - 16 * layoutScale);
                                ctx.lineTo(x, viewport.height - 20);
                                ctx.stroke();
                            }

                            // 6. 트랙 데이터 그리기
                            let y = trackStartY + viewState.offsetY;

                            data.tracks.forEach((track) => {
                                const trackHeight = (track.height ?? 18) * layoutScale;

                                // 트랙 이름
                                ctx.fillStyle = "#64748b";
                                ctx.font = `${12 * layoutScale}px ui-sans-serif, system-ui`;
                                ctx.fillText(track.name ?? track.id, paddingX, y - 10 * layoutScale);

                                // 트랙 가이드라인
                                ctx.strokeStyle = "#e5e7eb";
                                ctx.beginPath();
                                ctx.moveTo(paddingX, y + trackHeight / 2);
                                ctx.lineTo(viewport.width - paddingX, y + trackHeight / 2);
                                ctx.stroke();

                                // 피처 그리기
                                track.features.forEach((feature) => {
                                    const x = toScreenX(feature.start);
                                    const width = toScreenWidth(feature.start, feature.end);
                                    const radius = Math.min(6, trackHeight / 2);

                                    // 막대 그리기
                                    ctx.fillStyle = feature.color ?? "#38bdf8";
                                    drawRoundedRect(ctx, x, y, width, trackHeight, radius);
                                    ctx.fill();

                                    // 라벨 그리기 (옵션)
                                    if (feature.label) {
                                        const labelPaddingX = 6 * layoutScale;
                                        const labelPaddingY = 3 * layoutScale;
                                        ctx.font = `600 ${11 * layoutScale}px ui-sans-serif, system-ui`;
                                        const metrics = ctx.measureText(feature.label);
                                        const labelWidth = metrics.width + labelPaddingX * 2;
                                        const labelHeight = 16 * layoutScale + labelPaddingY;
                                        const labelX = x + 6 * layoutScale;
                                        const labelY = y + trackHeight + 6 * layoutScale;

                                        // 라벨 배경
                                        ctx.fillStyle = "#ffffff";
                                        ctx.strokeStyle = "#e2e8f0";
                                        drawRoundedRect(
                                            ctx,
                                            labelX,
                                            labelY,
                                            labelWidth,
                                            labelHeight,
                                            6 * layoutScale,
                                        );
                                        ctx.fill();
                                        ctx.stroke();

                                        // 라벨 텍스트
                                        ctx.fillStyle = "#0f172a";
                                        ctx.fillText(
                                            feature.label,
                                            labelX + labelPaddingX,
                                            labelY + 12 * layoutScale,
                                        );
                                    }
                                });

                                y += trackHeight + trackGap;
                            });
                        }}
                    />
                </div>
            </main>
        </div>
    );
}