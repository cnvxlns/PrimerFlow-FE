# PrimerFlow-FE

![Next.js](https://img.shields.io/badge/Next.js-16.1.6-black?logo=next.js)
![React](https://img.shields.io/badge/React-19.2.3-149eca?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178c6?logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.x-06b6d4?logo=tailwindcss)
![License](https://img.shields.io/badge/License-Private-lightgrey)

PCR 프라이머 설계 워크플로우를 위한 Next.js 프론트엔드입니다.  
4단계 Wizard UI, 백엔드 연동, 결과 캔버스 시각화를 제공합니다.

## 프로젝트 개요

- Next.js App Router 기반 단일 페이지 Wizard(`app/page.tsx`)
- 템플릿 시퀀스 입력(FASTA/Raw) 정규화 및 유효성 검사
- `/api/design` API 호출 후 결과를 새 탭(`/result`)으로 표시
- 결과를 `localStorage`에 저장/복원해 탭 간 데이터 전달
- Canvas 기반 genome track 렌더링(줌/패닝 포함)

## 현재 동작 상태 (2026-03-09 기준)

### 1) Step 1

- FASTA 헤더 제거, 공백 제거, `ATGC` 이외 문자 필터링/대문자화
- 파일 업로드, 클립보드 붙여넣기, 큰 입력(30,000자 초과) 프리뷰 모드 지원

### 2) Step 2~4 입력 연결 상태

- Step 2/Step 4 대부분 필드는 UI 기본값 표시 단계입니다.
- Step 3에서는 `restriction_enzymes` 입력만 실제 요청 payload에 반영됩니다.
- 템플릿 시퀀스(`target_sequence`)는 실제 API 요청에 반영됩니다.

### 3) Generate 동작

- `Generate Primers` 클릭 시 새 탭(`/result`)을 먼저 열고 API 요청 실행
- 성공 시 결과 키(`resultKey`)를 쿼리스트링으로 전달해 결과 페이지 렌더링
- 실패 시 에러 메시지 표시 및 임시 탭 정리

### 4) 결과 페이지(`/result`)

- `resultKey`로 `localStorage` 데이터 복원
- Primer/Template focus 기반 초기 줌 상태 자동 계산
- Canvas에서 결과 track 시각화 및 줌/리셋 조작 지원

## 기술 스택

- Framework: Next.js 16 (App Router)
- Language: TypeScript (strict)
- UI: React 19, Tailwind CSS 4, lucide-react
- State: Zustand
- Data: Axios, TanStack Query
- Test: Vitest

## 폴더 구조

```text
PrimerFlow-FE/
├─ app/
│  ├─ page.tsx                  # 4-step wizard 메인 화면
│  ├─ result/
│  │  ├─ page.tsx               # 결과 라우트(클라이언트 동적 import)
│  │  └─ ResultClientPage.tsx   # resultKey 기반 결과 복원/표시
│  ├─ layout.tsx
│  └─ providers.tsx             # QueryClientProvider
├─ components/
│  ├─ canvas/GenomeCanvas.tsx   # 공용 캔버스 인터랙션(패닝/휠 줌)
│  ├─ steps/                    # Step1~Step4 UI
│  ├─ ui/                       # 헤더/푸터/네비게이션
│  └─ PrimerResultModal.tsx
├─ src/
│  ├─ lib/                      # 알고리즘, API 클라이언트, 파서, storage
│  ├─ services/analysisService.ts
│  └─ types/
├─ store/useViewStore.ts
├─ hooks/
├─ tests/
└─ docs/
```

## 시작하기

### 요구 사항

- Node.js 20.x 이상
- npm
- 로컬 백엔드 서버(`http://127.0.0.1:8000`)

### 설치 및 실행

```bash
# 1) 의존성 설치
npm ci

# 2) 개발 서버 실행
npm run dev
```

브라우저에서 `http://localhost:3000`을 열어 확인합니다.

## 환경 변수 및 API 프록시

현재 `next.config.ts`는 아래 rewrite를 고정으로 사용합니다.

- `/api/:path*` -> `http://127.0.0.1:8000/:path*`

즉, 프론트엔드는 `POST /api/design`으로 호출하고 실제 요청은 로컬 백엔드로 프록시됩니다.

`.env.example`는 안내용이며, 현재 코드 기준으로 백엔드 라우팅에 필수 환경 변수는 없습니다.

## 스크립트

```bash
npm run dev     # 개발 서버
npm run build   # 프로덕션 빌드
npm run start   # 프로덕션 서버 실행
npm run lint    # eslint .
npm test        # vitest run
```

## 테스트

현재 포함된 핵심 테스트:

- `tests/step1TemplateSequence.test.ts`
  - FASTA/Raw 입력 정규화, invalid 문자 탐지/제거 검증
- `tests/visibleRange.test.ts`
  - prefix sum 및 visible range 계산 검증

## CI

GitHub Actions에서 PR 기준으로 아래 검증이 실행됩니다.

- Lint
- Test
- Build

또한 `main` 브랜치 대상 PR은 `develop` 브랜치에서만 허용하도록 정책이 설정되어 있습니다.

## 주간 진행 상황

### Week 1 (25.12.22 - 25.12.28)
- 작업 내역:
  - 기술스택 선정
    - Next.js: 메인 페이지(`app/page.tsx`)와 전역 레이아웃을 구성, 정적 리소스 관리 및 헤드 설정
    - TypeScript: 컴포넌트, 전역 스토어, 유틸 타입을 명시
    - Canvas API: 캔버스 컨텍스트 직접 처리, 대용량 서열 렌더링, 줌/패닝 변환, 텍스트/바 도형 그리기
    - Zustand: 캔버스 뷰 상태, 리셋/업데이트 액션의 전역 관리
    - Vercel: Next.js 앱 배포
  - 프로젝트 기본 아키텍처 및 스켈레톤 코드 구성
- AI 활용:
  - Gemini로 상세 프롬프트 작성
  - Codex로 프로젝트 아키텍처 및 스켈레톤 코드 작성
- 다음 주 계획:
  - `page.tsx`, `layout.tsx` 구현, 목 데이터 출력 확인

### Week 2 (25.12.29 - 26.01.04)
- 작업 내역:
  - 더미 데이터로 페이지 연결
  - 뷰 상태(Zustand)와 줌/패닝 동작 정돈
- AI 활용:
  - Codex로 `layout.tsx`, `page.tsx` 세부 구현 및 디버깅
- 완료 기능:
  - 목 데이터 출력 상태 확인
- 테스트 결과:
  - ![week2_screenshot.png](docs/screenshots/week2_screenshot.png)
- 다음 주 계획:
  - 스펙 기반 초기 입력 폼과 검증 로직 착수

### Week 3 (26.01.05 ~ 26.01.11)
- 작업 내역:
  - PCR 프라이머 디자인 스펙 작성(1-based 규칙, IUPAC 제한, 성능 목표 포함)
  - 메인 UI 디자인 결정 및 다크 톤 4단계 스텝 플로우로 리워크
  - Genome 타입 분리
- AI 활용:
  - Stitch, Figma에 동일 프롬프트를 넣어 디자인 비교 후 채택
- 완료 기능:
  - 단계별 UI 구현 완료
  - 1단계: 시퀀스 입력(FASTA/raw textarea)
  - 2단계: Primer Properties (GC% 범위, 최대 Tm 차이, GC Clamp, Poly-X 제한, 농도/염 조건)
  - 3단계: Binding Location (검색 범위, Exon junction 옵션, Intron 포함/범위, Restriction enzyme 입력)
  - 4단계: 결과물 출력
- 테스트 결과:
  - 1단계: ![week3_screenshot#1.png](docs/screenshots/week3_screenshot%231.png)
  - 2단계: ![week3_screenshot#2.png](docs/screenshots/week3_screenshot%232.png)
  - 3단계: ![week3_screenshot#3.png](docs/screenshots/week3_screenshot%233.png)
  - 4단계: ![week3_screenshot#4.png](docs/screenshots/week3_screenshot%234.png)
- 다음 주 계획:
  - 실제 데이터 연동, GenomeCanvas 미리보기 및 컨트롤 마무리

### Week 4 (26.01.12 ~ 26.01.18)
- 작업 내역:
  - 백엔드 모킹 서비스 구현 및 결과 시각화
  - Step 1 시퀀스 입력 편의성 개선
  - 컴포넌트 아키텍처 개선 및 UI 업데이트
- AI 활용:
  - Codex로 캔버스 표시 모달 구현
  - Paste 등 버튼 기능 구현
- 완료 기능:
  - 목 데이터를 모달로 표시
  - Step 1에서 DNA 서열 입력 시 FASTA 업로드, 클립보드 붙여넣기 지원
- 테스트 결과:
  - 목 데이터 표시 확인: ![week4_screenshot#1.png](docs/screenshots/week4_screenshot%231.png)
- 다음 주 계획:
  - 완성된 백엔드와 연동하여 결과 표시 및 디버깅

### Week 5 (26.01.19 ~ 26.01.25)
- 작업 내역:
  - 프론트엔드-백엔드 간 API 통신 규격(Spec) 정의 및 연동 구현
- AI 활용:
  - Codex로 Nested Object를 UI 전용 상태(Flat Object)로 변환하는 어댑터 패턴 코드 생성
- 완료 기능:
  - 프라이머 설계 요청 프로세스 구현: 입력값 -> 어댑터 -> API 호출
  - 결과 모달 데이터 바인딩: Mock 데이터 기반 캔버스/리스트 렌더링
- 다음 주 계획:
  - 사용자 입력 DNA 서열 전처리(Sanitization) 및 유효성 검증 로직 구현

### Week 6 (26.01.26 ~ 26.02.01)
- 작업 내역:
  - 대용량 데이터(10,000bp+) 렌더링 성능 최적화를 위한 뷰포트 탐색 로직 개선
  - 캔버스 스크롤 시 배경이 함께 밀리는 Jittering 버그 수정 및 레이어 고정 처리
- AI 활용:
  - Codex로 binary search 알고리즘 로직 검증 및 최적화
  - Gemini로 문제 상황 설명 프롬프트 작성, Codex로 수정 적용
- 완료 기능:
  - Binary Search 렌더링 최적화: `O(N)` -> `O(log N)` 개선으로 고BP 구간 프레임 드랍 완화
  - Canvas 배경 고정 렌더링 처리
- 다음 주 계획:
  - 입력 데이터 validator 구현

### Week 7 (26.02.02 ~ 26.02.08)
- 작업 내역:
  - Step1 시퀀스 입력 정규화 및 검증 UX 개선
  - ATGC 대소문자 처리 및 비정상 문자(N, 숫자, 특수문자) 필터링 로직 정립
  - 붙여넣기/파일 업로드 시 사용자 동의 UX 일관성 확보
- AI 활용:
  - 4단계 프롬프트(Phase 1~4) 기반 단계별 로직 고도화 및 트러블슈팅
  - Next.js Turbopack import 경로 이슈 분석 및 해결
  - 대량 문자열 붙여넣기 시 과도한 삭제 문제에 대한 sanitize 방식 개선안 적용
- 완료 기능:
  - 실시간 정규화: 입력 즉시 대문자 ATGC 변환 및 실시간 필터링
  - 예외 처리: Upload/Paste/Ctrl+V 시 비정상 문자 감지 시 확인 후 제거
  - chunk 단위 sanitize 전환으로 성능 개선 및 중복 검증 제거
- 다음 주 계획:
  - 목 데이터 제거 및 배포 백엔드 연결

### Week 8 (26.02.09 ~ 26.02.15)
- 작업 내역:
  - Mock Data 응답 제거 및 실서버 응답 구조 기준으로 프론트 로직 전환
  - 요청 파라미터를 백엔드 스펙에 맞춰 정리, 요청/응답 매핑 점검
  - API 호출 실패 상황(네트워크/서버 오류) 메시지 및 상태 처리 보강
  - 디자인/UI 리뉴얼
    - Poppins 폰트 도입
    - 헤더 리뉴얼(`PF` 텍스트 -> 로고 이미지, `Primer Designer by SeqLab`)
    - Step 1 카드 헤더 패딩 조정(`py-4 -> py-2`)
    - Step 4 불필요 요소(`Quality notes`) 제거
    - 불필요 빈 파일(`tailwind.config.ts`) 삭제
  - 코드 품질 자동 검증 PR 반영
    - GitHub Actions PR 시 Lint/Test/Build 자동 실행
    - Vitest 도입 및 `npm test` 스크립트 추가
    - 린트 스크립트 `eslint .`로 확장
    - `visibleRange` 기초 테스트 작성
- AI 활용:
  - Codex로 API 클라이언트 경로(`/api/design`)와 서비스 레이어 매핑 검증
  - 응답 데이터 변환 과정의 타입 안정성 점검 및 개선
- 완료 기능:
  - 배포 백엔드 API 연동 완료
  - 백엔드 응답을 Result Modal/Canvas 렌더링 가능한 형태로 변환해 표시
  - Mock 의존 제거, 실데이터 기반으로 전환
  - PR 품질 게이트(Lint/Test/Build) 자동 검증 체계 구축
  - `visibleRange` 핵심 로직 테스트 기반 확보

### Week 9 (26.02.16 ~ 26.02.22)
- 작업 내역:
  - 취약점 경고 대응
  - `npm audit fix --force`로 의존성 및 lockfile 업데이트
  - 보안 패치 적용 후 Lint/Test/Build 기준 동작 점검
- AI 활용:
  - Codex로 `package.json`/`package-lock.json` diff 검토 및 버전 상향 내역 정리
  - 업데이트 이후 CI 회귀 위험 체크리스트 점검
- 완료 기능:
  - Next.js: `16.1.1 -> 16.1.6`
  - eslint: `9 -> 9.39.2`
  - eslint-config-next: `16.1.1 -> 16.1.6`
  - npm audit 취약점 대응 의존성 업데이트 완료
