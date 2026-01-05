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
npm install

# 4. 환경 변수 설정 (.env.local 생성)
# (백엔드 API 주소 설정 예시)
# echo "NEXT_PUBLIC_API_URL=http://localhost:8000" > .env.local

# 5. 개발 서버 실행
npm run dev
```
