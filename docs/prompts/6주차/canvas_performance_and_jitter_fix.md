### 1. 배경 및 목적
 - 10,000bp 이상의 대용량 DNA 서열 데이터를 캔버스에 렌더링할 때 발생하던 프레임 드랍(렉) 이슈를 완화.
 - 캔버스 줌/패닝 시 배경 레이어가 함께 밀려 보이는 Jittering 현상을 줄여 UX 안정화.

### 2. 프롬프트 (User Input)
```
Phase 1: 대용량 데이터 렌더링 성능 최적화 (O(log N))
[알고리즘 구현 요청]
전체 트랙을 매번 순회(O(N))하지 않고, 뷰포트에 보이는 구간의 시작/끝 인덱스를
이분 탐색으로 빠르게 계산해 렌더링 범위를 줄여줘.

Phase 2: Jittering 버그(배경 밀림 현상) 수정
[이슈 트러블슈팅]
캔버스 렌더링 시 배경이 스크롤/패닝 영향으로 같이 움직여 보이지 않도록,
좌표계 변환과 배경 렌더링 순서를 분리해 화면 기준으로 안정적으로 그려줘.
```

### 3. AI 응답 요약 (AI Output)
 - `src/lib/algorithms/visibleRange.ts`:
   - `createPrefixSums`, `findItemIndexByPosition`(Binary Search), `getVisibleRange` 구현.
   - 누적 높이(prefix sums) 기반으로 보이는 트랙 인덱스 범위(`startIndex ~ endIndex`) 계산.

 - `hooks/useVisibleRange.ts`:
   - 스크롤 위치/뷰포트 높이를 받아 가시 범위를 계산하는 커스텀 훅 제공.
   - `onScroll`, `setScrollTop`, `findIndexByPosition` 유틸 포함.

 - 캔버스 렌더링 로직 정리:
   - `components/canvas/GenomeCanvas.tsx`에서 `setTransform` + `save()/restore()`로 변환 경계 분리.
   - `components/steps/Step4SpecificityPreview.tsx`에서 배경/그리드와 트랙 렌더링 좌표 처리를 분리하고,
     `getVisibleRange`를 사용해 보이는 트랙만 그리도록 적용.

### 4. 결과 및 적용 (Result)
 - 적용 파일:
   - `src/lib/algorithms/visibleRange.ts`
   - `hooks/useVisibleRange.ts`
   - `components/canvas/GenomeCanvas.tsx`
   - `components/steps/Step4SpecificityPreview.tsx`
   - `tests/visibleRange.test.ts`

 - 주요 결과:
   - 가시 범위 계산을 이분 탐색 기반으로 개선하여 대용량 데이터에서 렌더링 부담 완화.
   - 배경/레이어 좌표 처리 분리로 줌/패닝 시 시각적 떨림(Jittering) 현상 완화.
