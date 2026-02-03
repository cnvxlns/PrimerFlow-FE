# PrimerFlow specification prompt

## 1. 배경 및 목적

- 작성된 SeqLab 명세서 초안을 바탕으로 개발 팀원들과 공유할 기술 사양을 구체화함. 생물학적 요구사항(1-based Indexing, IUPAC 제한)을 개발 로직에 반영하고, View Culling 및 Auto Layout 등 핵심 기능의 구현 방향과 데이터 스키마를 사전 정의하여 혼선을 방지하고자 함.

## 2. 프롬프트 (User Input)

```text
너는 technique specification writer다.
목표: PCR primer design을 기능으로 하는 Seqlab의 software specification를 작성한다.
독자: 생물학 비전공인 개발자가 이 문서만으로 개발·테스트·출시 판단을 할 수 있어야 한다.

출력 규칙(중요):
- 반드시 아래 "입력 정보"의 섹션 외의 내용 추가하지 말기.
- 반드시 아래 "출력 템플릿"의 섹션 순서/제목/번호를 절대 변경하지 말 것.
- 템플릿에 없는 섹션을 임의로 추가하지 말 것. (필요하면 해당 섹션의 "비고"에 적기)
- 각 항목을 가능한 한 구체적으로 채우고, 정보가 없으면 "TBD"로 두고 그 이유를 짧게 적기.
- 모호한 표현(예: 적당히/빠르게/최대한) 금지. 수치·조건·예외를 명시.
- 요구사항은 MUST/SHOULD/MAY로 구분.
- 기능 요구사항에는 최소 2개 이상의 예외 케이스를 포함.
- 마지막에 "확인 질문"은 최대 7개만. 이미 문서에 있는 내용은 다시 묻지 말 것.

입력 정보:
🧬 PrimeFlow: Frontend Visualization Engine

   
High-Performance PCR Primer Design & Visualization Platform
대용량 유전자 서열(10,000bp+)을 웹 브라우저에서 지연 없이 분석하고 시각화하는 프론트엔드 엔진 리포지토리입니다.
📖 프로젝트 개요

PrimeFlow는 생명과학 연구원들이 PCR 프라이머를 설계할 때 겪는 비효율을 해결하기 위한 웹 솔루션입니다. 본 리포지토리(Frontend)는 백엔드에서 분석된 유전자 데이터와 프라이머 후보군을 HTML5 Canvas를 활용해 시각적으로 표현하는 데 집중합니다.
💡 핵심 기술 (Key Features)

Custom Rendering Engine: DOM 조작 방식이 아닌, Canvas API 기반의 자체 렌더링 엔진을 구현하여 10,000bp 이상의 데이터를 60fps로 부드럽게 렌더링합니다.
Optimization Algorithms:
View Culling: 이분 탐색(Binary Search)을 활용하여 화면 밖의 데이터 렌더링을 생략합니다.
Auto Layout: 그리디(Greedy) 알고리즘을 응용하여 겹치는 프라이머 구간을 자동으로 배치합니다.
Interactive UX: 행렬 변환(Matrix Transformation)을 적용한 정밀한 Zoom-In/Out 및 Panning 기능을 제공합니다.
🛠 기술 스택 (Tech Stack)

Core: Next.js 14 (App Router), TypeScript
Graphics: HTML5 Canvas API (2D Context)
Styling: Tailwind CSS
State Management: Zustand
Data Fetching: SWR / TanStack Query
Deployment: Vercel
🏗️ 프로젝트 구조 (Project Architecture)

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

🚀 시작하기 (Getting Started)

사전 요구사항

Node.js 18.17.0 이상
npm 또는 yarn
설치 및 실행

# 1. 저장소 클론
git clone [https://github.com/Seq-Lab/PrimerFlow-FE.git](https://github.com/Seq-Lab/PrimerFlow-FE.git)# 2. 프로젝트 폴더로 이동cd PrimerFlow-FE# 3. 패키지 설치
npm install# 4. 환경 변수 설정 (.env.local 생성 - 현재는 비워둠, API는 /api/v1 상대 경로 사용)# 5. 개발 서버 실행
npm run dev

프로젝트 구조

PrimerFlow-BE/
├─ api/
│  ├─ deps.py
│  └─ v1/
│     └─ endpoints/        # 엔드포인트 모음
├─ schemas/                # Pydantic 모델 모음
│  └─ schemas.py
├─ algorithms/             # 알고리즘 모음
├─ docs/                   # 협업 가이드 문서 모음
│  └─ prompts/
│  └─ strategy/
├─ main.py                 # FastAPI 앱 엔트리포인트 
├─ requirements.txt        # Python 패키지 목록
├─ README.md
└─ .gitignore

개발 환경 설정

1. 가상환경 생성 및 활성화

Windowspython -m venv .venv
.\.venv\Scripts\Activate.ps1    # PowerShell# 또는
.\.venv\Scripts\activate.bat    # cmd

macOS / Linuxpython3 -m venv .venvsource .venv/bin/activate

2. 의존성 설치

pip install -r requirements.txt

3. 개발 서버 실행

uvicorn main:app --reload

기본 엔드포인트: http://localhost:8000/
OpenAPI 문서: http://localhost:8000/docs
ReDoc 문서: http://localhost:8000/redoc

출력 템플릿:
1. 개요
1.1 목적
1.2 범위(포함/제외)
1.3 용어 정의

2. 이해관계자/권한
2.1 사용자 유형
2.2 권한 매트릭스(역할별 가능/불가)

3. 요구사항
3.1 기능 요구사항 (FR)
- FR-001:
  - 설명:
  - 입력:
  - 처리 로직:
  - 출력:
  - 예외/에러:
  - 우선순위(MUST/SHOULD/MAY):
  - 수용 기준(AC):
(반복)
3.2 비기능 요구사항 (NFR)
- 성능/지연:
- 가용성:
- 보안/개인정보:
- 로깅/감사:
- 호환성:
- 접근성:

4. 유저 플로우/시나리오
4.1 정상 시나리오
4.2 실패/예외 시나리오

5. API/데이터 설계(해당 시)
5.1 엔티티/스키마
5.2 API 목록(엔드포인트/요청/응답/에러코드)
5.3 상태/이벤트

6. UI 규칙(해당 시)
6.1 화면 목록
6.2 화면별 규칙(입력 검증/에러 메시지 문구/빈 상태)

7. 테스트 전략
7.1 테스트 케이스 요약
7.2 경계값/부하/보안 테스트

8. 릴리즈/운영
8.1 롤아웃/마이그레이션
8.2 모니터링 지표/알람
8.3 롤백 계획

9. 리스크/의존성
9.1 리스크
9.2 외부 의존성

10. 확인 질문(최대 7개)
```

## 3. AI 응답 요약 (AI Output)

- 핵심 기술 사양 (Core Specifications)
    - 좌표계 규칙: UI/API는 1-based (생물학 표준), 내부 연산은 0-based (배열 인덱스) 사용. (렌더링 시 변환 필수)
    - 입력 데이터: A, C, G, T, N 5개 문자만 허용 (IUPAC 확장 문자 불허).
    - 성능 목표: 10,000bp 이상 데이터를 Canvas로 60fps 렌더링.
- 기능적 요구사항 및 비기능적 요구사항
- 유저 시나리오

## 4. 결과 및 적용 (Result)

- GPT와 Gemini에 각각 동일한 프롬프트를 입력하여, 둘의 내용들을 정독한 후 통합한 버전으로 작성하였다.
- 시나리오와 제한사항들을 설계하여, 이후 개발과정과 테스트 케이스 설계의 기준으로 설정할 수 있다.
