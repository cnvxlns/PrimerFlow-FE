# Primer Design UI Rework

## 1. 배경 및 목적

- `test/demodesign.html`에 맞춰 Next.js 앱 메인 화면의 프라이머 디자인 UI를 다크 테마로 재구성하고, 단계별 입력 흐름(시퀀스 입력 → 조건 설정 → 결과 확인/미리보기)을 구현하기 위함.

## 2. 프롬프트 (User Input)
<stitch>
- pcr을 위한 프라이머를 자동으로 디자인해서 시각화해주는 툴을 개발할 것. input 원하는 시퀀스 (필수) 프라이머 조건: 길이(18-30), TM(60C), GC%(40-60%) (optional) 제한효소서열(optional) Core: Next.js 16 (App Router), TypeScript Graphics: HTML5 Canvas API (2D Context) Styling: Tailwind CSS State Management: Zustand Data Fetching: SWR / TanStack Query Deployment: Vercel 목 데이터는 따로 알아보기 편하게 폴더로 분리, 컴포넌트 분리
<codex>
- `test/demodesign.html`을 참고해 메인 페이지 디자인을 동일 톤으로 맞춰 달라는 요청.
- UI를 “시퀀스 입력 → 조건 설정 → 결과 확인” 순서로 단계화하고, 진행 중인 단계 외엔 가리도록 요구.
- 수정된 `demodesign.html` 느낌을 다시 반영해 달라는 리디자인 요청.

## 3. AI 응답 요약 (AI Output)

- `app/page.tsx`를 demodesign과 동일한 다크 톤으로 재설계: 헤더/배지/배경 그라데이션, Space Grotesk/Noto Sans/JetBrains Mono 폰트 유지.
- 단계형 스텝퍼와 가드 로직 추가(Template & Essential → Primer Properties → Binding Location → Specificity & Preview). 현재 단계만 노출되며 Back/Next/Generate 버튼과 스티키 네비게이션 제공.
- Step 1: PCR Template 입력 카드(FASTA/Raws, 업로드/붙여넣기/정리 버튼)와 필수 Essential 설정(Organism DB, Product Size Min-Max, Primer Tm Min/Opt/Max).
- Step 2: Primer 물성 카드(GC 범위, Max Tm diff, GC Clamp 토글, Poly-X, 농도 등) 배치.
- Step 3: Binding 위치 카드(Search range, Exon junction 옵션, Intron 포함 여부, Intron size range, Restriction enzyme 리스트) 배치.
- Step 4: Specificity 토글/체크박스와 3' mismatch strictness 입력, 우측에 GenomeCanvas 미리보기(줌/리셋 컨트롤) 및 품질 노트 섹션 구성.
- 하단 스티키 CTA 영역에서 단계 이동/프라이머 생성 버튼 제공. 화살표/텍스트 인코딩 문제를 escaping으로 해결.

## 4. 결과 및 적용 (Result)

- 적용 파일: `app/page.tsx` (전체 레이아웃, 스텝 UI, 입력 카드, 캔버스 섹션 재구성), `app/layout.tsx`, `app/globals.css` (이전 단계에서 테마/폰트 설정).
- 결과: demodesign 스타일을 반영한 4단계 시퀀스 UI로 리디자인 완료. 단계별 카드/폼과 GenomeCanvas 프리뷰가 분리되어 UX 가이드라인 충족.
- 테스트: 실행 테스트 미수행. `npm run dev` 후 스텝 1→4 순서로 화면 전환 및 입력/줌 컨트롤 확인 필요.
