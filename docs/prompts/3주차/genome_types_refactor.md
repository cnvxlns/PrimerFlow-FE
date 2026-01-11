# Genome Types Extraction & Stepper Layering Fix

## 1. 배경 및 목적

- `GenomeCanvas` 내에 흩어져 있던 타입 정의를 분리해 재사용성과 유지보수성을 높이고, 관련 소비자들이 일관된 타입 소스를 사용하도록 정리.
- 스텝퍼 UI에서 진행선이 원형 스텝 아이콘 위로 겹치는 문제를 해결해 시각적 위계를 바로잡음.

## 2. 프롬프트 (User Input)
<stitch>
- `src/components/canvas/GenomeCanvas.tsx`에 있는 `GenomeFeature`, `GenomeTrack`, `GenomeData`, `GenomeCanvasViewState`, `GenomeCanvasRenderState`, `GenomeCanvasProps`를 `src/lib/types/Genome.ts`로 이동하고, 관련 파일들이 새 경로에서 가져오도록 수정 요청.
- 스텝퍼의 가로 라인이 원형 스텝 위에 렌더링되는 문제를 고쳐 라인이 뒤로 가도록 z-index/Tailwind 클래스 조정 요청.
<codex>
- 프로젝트의 타입 공유 규칙을 따르기 위해 타입을 컴포넌트 로직과 분리하고, 경로 별칭(`@/`)이 새 타입 위치를 가리키도록 보완.
- 레이아웃 겹침 문제는 원형 스텝에 `relative`/`z-10`을 주고 라인에 낮은 z-index를 부여하는 방식으로 해결 지시.

## 3. AI 응답 요약 (AI Output)

- `src/lib/types/Genome.ts`를 신설해 Genome 관련 타입 6종을 집약하고, `GenomeCanvas`에서 선언하던 타입을 제거 후 새 모듈에서 임포트하도록 수정.
- 타입 소비 파일(`app/page.tsx`, `store/useViewStore.ts`)도 모두 새 타입 경로(`@/lib/types/Genome`)로 교체.
- `tsconfig.json`의 `paths`를 `@/* -> ./src/*` 우선으로 확장해 새 타입 위치를 해석하도록 조정.
- 스텝퍼 진행선에 `z-0`, 스텝 버튼에 `relative z-10`을 적용해 라인이 원 위로 올라오지 않도록 레이어링 수정.
- 정리 후 `npm run lint` 수행, 경고/에러 없이 통과 확인.

## 4. 결과 및 적용 (Result)

- 적용 파일: `src/lib/types/Genome.ts`, `components/canvas/GenomeCanvas.tsx`, `app/page.tsx`, `store/useViewStore.ts`, `tsconfig.json`.
- 효과: Genome 타입이 단일 모듈로 분리되어 재사용성 확보 및 경로 혼선 제거. 스텝퍼 시각 계층 개선으로 진행선이 원형 스텝 뒤에 배치됨.
- 테스트: `npm run lint` 성공. 추가로 `npm run build`로 전체 빌드를 확인하면 완전성을 보강할 수 있음.
