# GenomeCanvas 페이지 연결 및 뷰 상태 연동

## 1. 배경 및 목적

- `GenomeCanvas`를 페이지에 연결하고 더미 데이터로 렌더링을 확인
- 줌/패닝 상태를 전역으로 관리하고, 기본 스타일을 정돈
- 좌표 변환 유틸을 분리하여 재사용 가능하게 구성

## 2. 프롬프트 (User Input)

```text
Integrate GenomeCanvas into app/page.tsx and render it with dummy genome data so it is visible on the page.
Add a simple toolbar above the canvas with zoom in/out, reset view buttons, and a zoom level label.
Move bp-to-px coordinate logic into a reusable utility under lib/math and use it in the draw callback.
Manage the canvas view state (scale/offset) with Zustand as a global store and wire it into GenomeCanvas as a controlled component.
Improve track/feature styling (rounded feature bars, readable labels) without changing the layout structure.
Fix any runtime/type errors introduced in the page, including lack of CanvasRenderingContext2D.roundRect support and TS7006 implicit any in Zustand selectors.
```

## 3. AI 응답 요약 (AI Output)

- `app/page.tsx`에 `GenomeCanvas` 프리뷰와 더미 데이터를 추가
- `store/useViewStore.ts`에 Zustand 기반 뷰 상태 관리(`viewState`, `setViewState`, `resetViewState`)
- `lib/math/coords.ts`에 bp→px 좌표 변환 유틸 `createBpScale` 추가
- 트랙/피처 스타일 개선 및 뷰 상태 UI(줌 인/아웃/리셋) 추가
- `ctx.roundRect` 미지원 이슈를 커스텀 라운드 사각형 유틸로 대체
- Zustand selector의 `state` 타입 명시로 TS7006 해결
- 줌/패닝 시 텍스트가 함께 스케일되는 문제를 해결하도록 캔버스 그리기 로직을 조정
- 캔버스 높이에 맞춰 레이아웃 스케일을 적용해 텍스트/트랙/간격의 가독성 개선

## 4. 결과 및 적용 (Result)

- `app/page.tsx`에 GenomeCanvas 렌더링과 스타일/컨트롤 적용
- `store/useViewStore.ts`에 뷰 상태 전역 관리 로직 구현
- `lib/math/coords.ts`에 좌표 변환 유틸 추가 및 적용
- 오류 수정: `roundRect` 대체, selector 타입 지정
- 줌/패닝 시 텍스트는 고정 크기로 유지되고, 트랙/피처만 변환되도록 분리 렌더링 적용
- 캔버스가 큰 경우에도 정보 영역이 작게 보이지 않도록 높이 기반 스케일링 적용
