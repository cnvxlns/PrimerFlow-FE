# 5. API 및 데이터 설계 (API & Data Design)

## 5.1 엔티티 및 스키마 (Entity Schema)

백엔드와 프론트엔드 간 교환되는 핵심 데이터 모델입니다.

### 1) GenomeSequence
사용자가 입력한 유전자 서열의 파싱 결과입니다.

```typescript
interface GenomeSequence {
  id: string;          // 고유 ID
  name: string;        // FASTA Header (서열 이름)
  sequence: string;    // 정규화된 유전자 서열 (A/C/G/T/N...)
  length_bp: number;   // 서열 길이
}
```
### 2) PrimerCandidate

```typescript
interface PrimerCandidate {
  id: string;          // 후보 ID
  sequence: string;    // 프라이머 서열
  start_bp: number;    // 시작 위치 (1-based 기준)
  end_bp: number;      // 종료 위치
  strand: "forward" | "reverse"; // 방향
  metrics: {           // (TBD) 제공 필드 확정 필요
    tm_c?: number;       // 녹는점 (Melting Temperature)
    gc_percent?: number; // GC 함량
    penalties?: any;     // 패널티 점수 등
  };
}
```
### 3) PrimerDesignResponse
```typescript
export interface Range {
  min: number;
  max: number;
}

export interface PrimerDesignRequest {
  // 1. Basic Input (필수)
  basic: {
    templateSequence: string;       // ★ PCR Template Sequence
    targetOrganism: string;         // ★ Target Organism (DB ID)
    productSize: Range;             // ★ PCR Product Size
    primerTm: {                     // ★ Primer Tm
      min: number;
      opt: number;
      max: number;
    };
  };

  // 2. Primer Property
  properties: {
    gcContent: Range;               // Primer GC Content (%)
    maxTmDifference: number;        // Max Tm Difference
    gcClamp: boolean;               // GC Clamp Requirement
    maxPolyX: number;               // Max Poly-X Run
    concentration: number;          // Concentration (nM)
  };

  // 3. Primer Specificity
  specificity: {
    checkEnabled: boolean;          // ★ Specificity Check Enable
    spliceVariantHandling: boolean; // Splice Variant Handling
    snpExclusion: boolean;          // SNP Exclusion
    endMismatchStrictness?: {       // 3' End Mismatch (Dropdown/Number)
      regionSize: number;           // 3' 말단 N bp
      minMismatch: number;          // M 개 이상의 미스매치
    };
    misprimingLibrary: boolean;     // Mispriming Library Check
  };

  // 4. Primer Binding Position
  position: {
    searchRange: {                  // Search Range (From-To)
      from: number;
      to: number;
    };
    exonJunctionSpan: 'none' | 'flanking' | 'spanning'; // Dropdown
    intronInclusion: boolean;       // Intron Inclusion
    intronSize?: Range;             // Intron Size Range
    restrictionEnzymes: string[];   // Restriction Enzymes List
  };
}

interface PrimerDesignResponse {
  genome: GenomeSequence;        // 분석된 게놈 정보 (요약)
  candidates: PrimerCandidate[]; // 생성된 후보 목록
  meta: {
    params: PrimerDesignRequest;   // 요청 시 사용된 파라미터 (검증용)
    timestamp: string;             // 생성 시간 (ISO 8601)
    execution_time_ms?: number;    // 실행 시간
  };
}
```
## 5.2 API 목록 (API Endpoints)
Note: 백엔드는 FastAPI를 사용하며 OpenAPI(/docs)를 제공합니다. 정확한 경로는 개발 착수 시 확정(TBD)됩니다.
1) 프라이머 설계 요청 (Design Primers)
- Endpoint: POST /api/design (예상, TBD)
- Request: 서열 데이터 (Sequence String)
설계 파라미터 (PrimerDesignRequest)
- Response: PrimerDesignResponse
- Status Codes & Errors:
  - 200 OK: 성공
  - 400 Bad Request: 입력 검증 실패 (잘못된 서열 문자, 파라미터 오류)
  - 413 Payload Too Large: 입력 서열이 너무 큼 (TBD: 상한선 정책)
  - 500 Internal Server Error: 서버 내부 알고리즘 오류

2) 헬스 체크 (Health Check)
- Endpoint: GET / 또는 GET /health (TBD)
- Response: 서버 상태 문자열 또는 JSON (TBD)

## 5.3 상태 및 이벤트 관리 (State & Events)
프론트엔드(Zustand)에서 관리해야 할 전역 상태와 주요 이벤트 흐름입니다.

#### 1. 전역 상태 (Global State - Zustand) - 상태 변수
#### 타입설명
* viewportStartBpnumber: 현재 뷰포트 시작 위치 (1-based 권장)
* viewportEndBpnumber: 현재 뷰포트 종료 위치
* zoomLevelnumber: 캔버스 확대 배율
* selectedPrimerIdstring: 사용자가 클릭하여 선택한 프라이머 
* IDhoveredPrimerIdstring(TBD): 마우스 오버 중인 프라이머 
* IDfilterSortStateobject(TBD): 후보 리스트 필터/정렬 조건
#### 2. 주요 이벤트 (Key Events) - 데이터 흐름과 UI 반응을 트리거하는 핵심 이벤트
#### 데이터 처리
* SEQUENCE_PARSED: FASTA 파싱 완료 시
* DESIGN_REQUESTED: 설계 요청 시작 (로딩 UI 표시)
* DESIGN_SUCCEEDED: 결과 수신 완료 (캔버스 렌더링 시작)
* DESIGN_FAILED: 요청 실패 (에러 배너 표시)
#### 상호작용
* VIEWPORT_CHANGED: 줌/팬 동작으로 보고 있는 구간 변경 시
* PRIMER_SELECTED: 프라이머 클릭 시 (상세 패널 표시)
* PRIMER_DESELECTED: 빈 공간 클릭 또는 선택 해제 시