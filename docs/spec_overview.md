# 1. 개요 (Overview)

## 1.1 목적
본 문서는 생명과학 연구원들이 PCR 프라이머(Primer)를 설계할 때 겪는 비효율을 해결하기 위한 웹 솔루션 **PrimerFlow**의 기술 사양을 정의한다.
본 시스템은 10,000bp 이상의 대용량 유전자 서열 데이터를 백엔드에서 분석하고, 프론트엔드(PrimeFlow Engine)에서 웹 브라우저 지연 없이 **60fps로 시각화**하는 것을 목적으로 한다.

## 1.2 범위 (Scope)

### 포함 (In-Scope)
* **Frontend:** Next.js 16 기반의 웹 애플리케이션 구현. HTML5 Canvas API를 활용한 Custom Rendering Engine, UI 컴포넌트, 전역 상태 관리(Zustand).
* **Backend:** FastAPI 기반의 REST API 서버. 유전자 데이터 분석 및 PCR 프라이머 설계 알고리즘 제공.
* **Algorithm:** View Culling(이분 탐색), Auto Layout(Greedy), 좌표 변환(Matrix Transformation). 
* **Infra:** Vercel 배포(FE) 및 로컬 개발 환경 구성.

### 제외 (Out-Scope)
* 사용자 인증/인가 시스템 (입력 정보에 명시되지 않음, TBD).
* 실제 실험 장비와의 하드웨어 연동.

## 1.3 용어 정의 (Terminology)

| 용어 | 정의 | 비고 |
| :--- | :--- | :--- |
| **bp (Base Pair)** | 유전자 서열의 길이를 나타내는 단위. | 시각화 시 X축 좌표의 기준 단위가 됨. |
| **PCR Primer** | DNA 중합효소 연쇄 반응(PCR)을 위해 필요한 짧은 유전자 서열 조각. | UI 상에서 유전자 위에 겹쳐지는 '구간'으로 표현됨. |
| **FASTA** | 유전자 서열 데이터를 표현하는 텍스트 기반 포맷. | `lib/parsers/`에서 파싱해야 할 입력 데이터 형식. |
| **View Culling** | 현재 화면(Viewport)에 보이지 않는 데이터를 렌더링에서 제외하는 최적화 기법. | 이분 탐색(Binary Search) 사용. |
| **Canvas API** | HTML5 `<canvas>` 요소를 통해 비트맵 그래픽을 즉시 모드로 그리는 수단. | DOM 조작 대신 사용됨. |
| **Coordinate System** | 유전자 위치를 나타내는 숫자 체계. 본 프로젝트는 **생물학 표준인 1-based Indexing**을 따른다. | UI 및 API의 모든 위치 값은 1부터 시작한다. (0번 아님) |
| **Range (구간)** | 시작(Start)과 끝(End)을 포함하는 **Closed Interval [Start, End]**. | Python 슬라이싱 `[Start:End)`과 다르므로 주의. |

---

# 2. 이해관계자 및 권한

## 2.1 사용자 유형
* **Researcher (연구원/사용자):** 서열을 입력하고 프라이머 후보를 조회/선택/내보내기 한다.
* **Developer (개발자):** 디버그/성능 측정/렌더링 검증을 수행한다.

## 2.2 권한 매트릭스
| 역할 | 가능 (Allowed) | 불가 (Disallowed) |
| :--- | :--- | :--- |
| **Researcher** | 서열 입력(FASTA), 프라이머 후보 조회, 캔버스 탐색(Zoom/Pan), 후보 선택/비교, 결과 내보내기 | 배포 설정 변경, API URL 변경(프로덕션) |
| **Developer** | 성능 오버레이/디버그 로그 활성화(개발 환경), 샘플 데이터 로드(개발용) | (기본) 운영 데이터 변경/관리 기능 |