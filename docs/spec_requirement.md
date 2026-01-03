# 3. 요구사항 (Requirements)

## 3.1 기능 요구사항 (Functional Requirements)

### FR-001: FASTA 서열 입력/로딩
* **설명:** 사용자는 유전자 서열을 FASTA 형식으로 붙여넣거나(또는 파일 업로드) 분석을 시작할 수 있어야 한다.
* **처리 로직:**
    1.  `lib/parsers`에서 FASTA 파싱 (헤더/서열 추출)
    2.  서열 문자열 정규화 (대문자 변환, 공백/개행 제거)
    3.  허용 문자 검증 (**기본: A/C/G/T/N**)
* **우선순위:** **MUST**
* **예외 처리:**
    * FASTA 파싱 실패 시: “FASTA 형식을 확인해 주세요. A/C/G/T/N 문자만 허용됩니다.”
    * 서열 길이 오류 시: “서열 길이가 허용 범위를 벗어났습니다. (현재: {len}bp)”

### FR-002: 대용량 유전자 서열 시각화 (Custom Rendering Engine)
* **설명:** 10,000bp 이상의 유전자 데이터를 HTML5 Canvas에 DOM 조작 없이 렌더링해야 한다.
* **처리 로직:** `components/canvas/` 로드 → Canvas 2D Context 획득 → Loop 드로잉 (`ctx.lineTo`, `ctx.stroke`)
* **우선순위:** **MUST**
* **수용 기준:** 10,000bp 데이터 로드 시 스크롤/줌 동작 중 **60fps 유지**.

### FR-003: 뷰 컬링(View Culling) 최적화
* **설명:** 현재 뷰포트(화면) 밖의 데이터는 렌더링 연산에서 제외한다. 
* **처리 로직:**
    1.  UI의 **1-based 좌표**를 내부 연산용 **0-based 인덱스**로 변환 (`Index = Coordinate - 1`)
    2.  `lib/algorithms/`의 이분 탐색(Binary Search)으로 렌더링 범위 탐색.
* **우선순위:** **SHOULD**

### FR-004: 프라이머 설계 요청 (백엔드 호출)
* **설명:** SWR/TanStack Query로 백엔드에 설계를 요청하고 응답을 캐싱한다.
* **우선순위:** **MUST**
* **수용 기준:** 요청 성공 시 후보 리스트와 캔버스 렌더링이 동시에 갱신된다.

### FR-005: 프라이머 자동 레이아웃 (Auto Layout)
* **설명:** 겹치는 프라이머 구간을 자동으로 Y축(높이)을 달리하여 배치한다.
* **처리 로직:** `lib/algorithms/`의 **Greedy 알고리즘** 응용. 충돌(Collision) 감지 시 Layer 레벨 증가.
* **우선순위:** **MUST**

### FR-006: 인터랙티브 UX (Zoom/Pan)
* **설명:** 마우스/트랙패드를 통한 줌인/아웃 및 패닝.
* **처리 로직:** `store/useViewStore.ts` 업데이트 및 `lib/math/` 행렬 변환(Matrix Transformation).
* **우선순위:** **SHOULD**

## 3.2 비기능 요구사항 (NFR)
* **성능:** 10,000bp 데이터 기준 렌더링 속도 60fps 유지. 
* **가용성:** 로컬 및 Vercel 배포 환경 상시 접근.
* **호환성:** HTML5 Canvas API 지원 최신 브라우저 (Chrome, Firefox, Safari, Edge).
* **접근성:** TBD (별도 고려 필요).