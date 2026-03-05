# 🧬 PrimeFlow: Frontend Visualization Engine

![Next.js](https://img.shields.io/badge/Next.js-16.1.1-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?logo=typescript)
![Canvas API](https://img.shields.io/badge/HTML5-Canvas_API-orange?logo=html5)
![Vercel](https://img.shields.io/badge/Deployment-Vercel-black?logo=vercel)

> **High-Performance PCR Primer Design & Visualization Platform**
>
> 대용량 유전자 서열(10,000bp+)을 웹 브라우저에서 지연 없이 분석하고 시각화하는 프론트엔드 엔진 리포지토리입니다.

## 📖 프로젝트 개요

**PrimeFlow**는 생명과학 연구원들이 PCR 프라이머를 설계할 때 겪는 비효율을 해결하기 위한 웹 솔루션입니다.
본 리포지토리(Frontend)는 백엔드에서 분석된 유전자 데이터와 프라이머 후보군을 **HTML5 Canvas**를 활용해 시각적으로 표현하는 데 집중합니다.

### 💡 핵심 기술 (Key Features)

* **Custom Rendering Engine:** DOM 조작 방식이 아닌, Canvas API 기반의 자체 렌더링 엔진을 구현하여 10,000bp 이상의 데이터를 60fps로 부드럽게 렌더링합니다.
* **Optimization Algorithms:**
  * **View Culling:** 이분 탐색(Binary Search)을 활용하여 화면 밖의 데이터 렌더링을 생략합니다.
  * **Auto Layout:** 그리디(Greedy) 알고리즘을 응용하여 겹치는 프라이머 구간을 자동으로 배치합니다.
* **Interactive UX:** 행렬 변환(Matrix Transformation)을 적용한 정밀한 Zoom-In/Out 및 Panning 기능을 제공합니다.

## 🛠 기술 스택 (Tech Stack)

* **Core:** Next.js 16 (App Router), TypeScript
* **Graphics:** HTML5 Canvas API (2D Context)
* **Styling:** Tailwind CSS
* **State Management:** Zustand
* **Data Fetching:** SWR / TanStack Query
* **Deployment:** Vercel

## 🏗️ 프로젝트 구조 (Project Architecture)

```text
PrimerFlow-FE/
├── app/                  # 🌐 [Main] 페이지 및 라우팅 (Next.js App Router)
│   ├── page.tsx          # 메인 대시보드 화면
│   └── layout.tsx        # 전역 레이아웃 (Header, Font 등)
│
├── components/           # 🧩 UI 컴포넌트 모음
│   ├── canvas/           # ✨ [Core] 시각화 엔진 (GenomeCanvas, Controls 등)
│   └── ui/               # 공통 UI (Button, Input, Card 등)
│
├── lib/                  # 🧮 순수 함수 및 알고리즘
│   ├── algorithms/       # [Optimization] 이분 탐색, 레이아웃 알고리즘
│   ├── math/             # [Math] 좌표 변환(World <-> Screen), 행렬 연산
│   └── parsers/          # [Data] FASTA 파싱 및 API 데이터 변환
│
├── store/                # 💾 전역 상태 관리 (Zustand)
│   └── useViewStore.ts   # 줌 레벨, 뷰포트 위치 등 관리
│
├── docs/                 # 📄 문서 및 프롬프트 아카이브
│   └── prompts/          # AI 개발을 위한 기능 명세서(Spec) 모음
│
└── public/               # 🖼️ 정적 파일 (이미지, 아이콘)
```

## 🚀 시작하기 (Getting Started)

### 사전 요구사항
* Node.js 20.9.0 이상
* npm 또는 yarn

### 설치 및 실행

```bash
# 1. 저장소 클론
git clone [https://github.com/Seq-Lab/PrimerFlow-FE.git](https://github.com/Seq-Lab/PrimerFlow-FE.git)

# 2. 프로젝트 폴더로 이동
cd PrimerFlow-FE

# 3. 패키지 설치
npm ci

# 4. 환경 변수 설정 (.env.local 생성)
- `.env.example` 파일을 복사하여 `.env.local`을 생성하세요.
- Next.js `rewrites`에서 백엔드 목적지는 `BACKEND_URL`이 설정되면 해당 값을, 없으면 `http://127.0.0.1:8000`(로컬)로 사용합니다.
- 로컬 기본값(127.0.0.1:8000)을 사용하려면 `.env.local`을 비워 두어도 무방합니다.
- 다른 백엔드로 프록시해야 한다면 `.env.local`에 아래처럼 설정하세요:

```env
BACKEND_URL=[https://api.example.com](https://api.example.com)
```

- Vercel 등 배포 환경에서도 동일한 환경 변수를 프로젝트 환경 변수로 추가하면 됩니다.

# 5. 개발 서버 실행
```
npm run dev
```


## 주간 진행 상황
### Week 1 (25.12.22 - 25.12.28)
- 작업 내역:
  - 기술스택 선정
    - Next.js: 메인 페이지(app/page.tsx)와 전역 레이아웃을 구성, 정적 리소스 관리·헤드 설정
    - Typescript: 컴포넌트·전역 스토어·유틸 타입을 명시
    - Canvas API: 캔버스 컨텍스트를 직접 처리; 대용량 서열 랜더링, 줌/패닝 변환, 텍스트/바 도형 그리기
    - Zustand: 캔버스 뷰 상태, 리셋/업데이트 액션의 전역 관리
    - Vercel: Next.js앱 배포
  - 프로젝트 기본 아키텍처 및 스켈레톤 코드 구성
- AI 활용: Gemini로 자세한 내용 프롬프트로 작성, codex로 프로젝트 아키텍처 및 스켈레톤 코드 작성.
- 다음 주 계획: page.tsx, layout.tsx 구현, 목 데이터 출력 해보기

### Week 2 (25.12.29 - 26.01.04)z`
- 작업 내역:
  - 더미 데이터로 페이지에 연결
  - 뷰 상태(Zustand)와 줌·패닝 동작을 정돈
- AI 활용:
  - codex 활용하여 layout.tsx, page.tsx 세부 구현 및 디버깅
- 완료 기능:
  - 목 데이터의 출력 상태 확인
- 테스트 결과:
  - ![week2_screenshot.png](docs/screenshots/week2_screenshot.png)
- 다음 주 계획: 스펙 기반 초기 입력 폼과 검증 로직 착수.

### Week 3 (26.01.05 ~ 26.01.11)
- 작업 내역:
  - PCR 프라이머 디자인 스펙을 작성해 1-based 규칙·IUPAC 제한·성능 목표를 포함한 요구사항과 시나리오를 정리
  - 메인 UI 디자인 결정; 다크 톤 4단계 스텝 플로우로 리워크
  - Genome 타입 분리
- AI 활용:
  - stitch, figma에 같은 프롬프트를 넣고 디자인을 비교, 채택.
- 완료 기능:
  - 단계별 UI 구현 완료
    - 1단계: 시퀀스 입력(FASTA/raw textarea)
    - 2단계: Primer Properties: GC% 범위, 최대 Tm 차이, GC Clamp 온/오프, Poly-X 제한, 농도/염 조건 입력
    - 3단계: Binding Location: Search range 시작/끝, Exon junction 고려 여부, Intron 포함 여부와 Intron size 범위, Restriction enzyme 목록/선택.
    - 4단계: 결과물 출력
- 테스트 결과:
  - 1단계

    ![week3_screenshot#1.png](docs/screenshots/week3_screenshot%231.png)
  - 2단계

    ![week3_screenshot#2.png](docs/screenshots/week3_screenshot%232.png)
  - 3단계

    ![week3_screenshot#3.png](docs/screenshots/week3_screenshot%233.png)
  - 4단계

    ![week3_screenshot#4.png](docs/screenshots/week3_screenshot%234.png)
- 다음 주 계획: 실제 데이터 연동, GenomeCanvas 미리보기·컨트롤 마무리.

### Week 4 (26.01.12 ~ 26.01.18)
- 작업 내역:
  - 백엔드 모킹 서비스 구현 및 결과 시각화
  - Step 1 시퀀스 입력 편의성 개선
  - 컴포넌트 아키텍처 개선 및 UI 업데이트
- AI 활용:
  - codex로 캔버스가 표시되는 모달 구현
  - paste등 버튼 기능 구현
- 완료 기능:
  - 목데이터를 모달을 이용하여 표시
  - Step1에서 DNA서열 입력 시, fasta파일 업로드, 클립보드에서 붙여넣기 지원

- 테스트 결과:
  - 목데이터 표시 확인

    ![week4_screenshot#1.png](docs/screenshots/week4_screenshot%231.png)
- 다음 주 계획: 완성된 백엔드와 연동하여 결과 표시 및 디버깅

### Week 5 (26.01.19 ~ 26.01.25)
- 작업 내역: 프론트엔드-백엔드 간 API 통신 규격(Spec) 정의 및 연동 구현
- AI 활용: codex 이용하여 복잡한 Nested Object을 UI 전용 상태(Flat Object)로 변환하는 어댑터 패턴 코드 자동 생성
- 완료 기능:
  - 프라이머 설계 요청(Request) 프로세스 구현: 입력값 → 어댑터 → API 호출 흐름 완성
  - 결과 모달(Result Modal) 데이터 바인딩: Mock 데이터를 활용하여 캔버스 및 리스트에 분석 결과 렌더링
- 다음 주 계획: 사용자 입력 데이터(DNA 서열)에 대한 전처리(Sanitization) 및 유효성 검증 로직 구현


### Week 6 (26.01.26 ~ 26.02.01)
- 작업 내역:
  - 대용량 데이터(10,000bp 이상) 렌더링 성능 최적화를 위한 뷰포트 탐색 로직 개선
  - 캔버스 UI 스크롤 조작 시 배경이 함께 밀리는 버그(Jittering) 수정 및 레이어 고정 처리
- AI 활용:
  - codex를 이용하여 binary search 알고리즘 로직 검증 및 최적화
  - gemini로 현재 발생하고 있는 상황을 정확하게 설명하여 해결을 요구하는 프롬프트 작성 및 codex를 이용한 수정
- 완료 기능:
  - Binary Search 렌더링 최적화: $O(N)$ 탐색을 $O(\log N)$으로 개선하여 High BP 구간 프레임 드랍 해결
  - Canvas Background Fix: 스크롤 이벤트 시 배경 이미지가 고정되도록 렌더링 로직 수정
- 다음 주 계획:
  - 입력 데이터 validator 구현

### Week 7 (26.02.02 ~ 26.02.08)
- Step1 시퀀스 입력 정규화 및 검증 UX 개선
  - ATGC 대소문자 처리 및 비정상 문자(N, 숫자, 특수문자) 필터링 로직 정립
  - 붙여넣기 및 파일 업로드 시 사용자 동의 UX 일관성 확보

- AI 활용:
  - 4단계 프롬프트(Phase 1~4)를 구성하여 AI와 단계별 로직 고도화 및 트러블슈팅 진행
  - Next.js Turbopack 빌드 에러(Import 경로 이슈) 분석 및 해결
  - 대량 문자열 붙여넣기 시 발생하는 데이터 손실(과도한 삭제) 문제에 대한 최적화된 Sanitize 접근 방식 제안 및 적용

- 완료 기능:
  - 실시간 정규화: 입력 즉시 대소문자 구분 없이 대문자 ATGC로 자동 변환 및 실시간 필터링 적용 (안내 캡션 추가)
  - 사용자 동의 기반 예외 처리: FASTA 파일 업로드, Paste 버튼, Ctrl+V 입력 시 비정상 문자가 감지되면 즉시 삭제하지 않고 window.confirm을 통한 사용자 제거 동의 로직 구현
  - 로직 최적화: 조각(chunk) 단위 산니타이즈(Sanitize) 방식으로 전환하여 성능 개선 및 Generate 단계의 불필요한 중복 검증 로직 제거

- 다음 주 계획:
  - 목데이터 제거 및 배포된 백엔드와 연결

### Week 8 (26.02.09 ~ 26.02.15)
- 작업 내역:
  - 목데이터(Mock Data) 기반 응답 제거 및 실서버 응답 구조 기준으로 프론트 로직 전환
  - 프라이머 분석 요청 파라미터를 백엔드 스펙에 맞게 정리하고 요청/응답 매핑 흐름 점검
  - API 호출 실패 상황(네트워크/서버 오류)에 대한 사용자 메시지 노출 및 상태 처리 보강
  - 디자인/UI 리뉴얼
    - Poppins 폰트 도입: 헤더 타이틀을 Poppins로 변경
    - 헤더 리뉴얼: `PF` 텍스트를 로고 이미지로 교체하고 타이틀을 `Primer Designer by SeqLab`으로 변경
    - 컴팩트한 디자인: Step 1 템플릿 시퀀스 카드 헤더 패딩 조정(`py-4 -> py-2`)
    - UI 클린업: Step 4 불필요 요소(`Quality notes`) 제거
    - 파일 정리: 불필요한 빈 파일(`tailwind.config.ts`) 삭제
  - 코드 품질 자동 검증 환경 구축 PR 반영
    - CI 자동화: GitHub Actions에서 PR 시 Lint, Test, Build 자동 실행
    - 테스트 인프라: Vitest 도입, `vitest.config.ts` 및 테스트 실행 스크립트(`npm test`) 추가
    - 린트 개선: lint 스크립트를 `eslint .`로 확장해 프로젝트 전역 검사 수행
    - 테스트 케이스: `visibleRange` 알고리즘 로직 검증용 기초 테스트 코드 작성
- AI 활용:
  - Codex를 활용해 API 클라이언트 경로(`/api/design`)와 서비스 레이어 매핑 로직 검증
  - 응답 데이터 변환(UI 전용 트랙/프라이머 후보 매핑) 과정의 타입 안정성 점검 및 개선
- 완료 기능:
  - 프라이머 설계 요청이 배포된 백엔드 API로 전송되도록 연동 완료
  - 백엔드 응답을 Result Modal/Canvas에 렌더링 가능한 형태로 변환하여 표시
  - Mock 의존 흐름을 제거하고 실데이터 기반 동작으로 전환
  - PR 단위 품질 게이트(Lint/Test/Build) 자동 검증 체계 구축
  - `visibleRange` 핵심 로직 테스트 기반 확보

### Week 9 (26.02.16 ~ 26.02.22)
- 작업 내역:
  - 취약점 경고 대응
  - `npm audit fix --force`를 통해 의존성 및 lockfile 업데이트
  - 보안 패치 적용 후 Lint/Test/Build 기준 기본 동작 점검
- AI 활용:
  - Codex로 `package.json`/`package-lock.json` 변경 diff를 검토하고 버전 상향 내역 정리
  - 업데이트 이후 CI 기준(린트/테스트/빌드) 회귀 위험 체크리스트 점검
- 완료 기능:
  - Next.js: `16.1.1 -> 16.1.6`
  - eslint: `9 -> 9.39.2`
  - eslint-config-next: `16.1.1 -> 16.1.6`
  - npm audit 취약점 경고 대응을 위한 프론트엔드 의존성 업데이트 완료
