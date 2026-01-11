# PrimerFlow 시스템 설계 및 아키텍처
이 문서는 PrimerFlow의 핵심 데이터 구조(Class Diagram)와 시스템 동작 흐름(Sequence Diagram)을 정의합니다. 
테스트 케이스 작성 및 기능 구현 시 본 문서를 기준으로 로직을 검증합니다.

## 1. Class Diagram
Backend의 주요 데이터 모델과 알고리즘 처리 클래스 구조입니다.

```mermaid
classDiagram
    %% ==========================================================
    %% 1. Request Schema (UI Input Structure)
    %% ==========================================================
    class PrimerDesignRequest {
        +BasicInput basic
        +PropertyInput properties
        +SpecificityInput specificity
        +PositionInput position
    }
    class BasicInput {
        +String template_sequence
        +String target_organism
        +Range product_size
        +TmSettings primer_tm
    }
    class PropertyInput {
        +Range gc_content
        +float max_tm_difference
        +bool gc_clamp
        +int max_poly_x
        +float concentration
    }
    class SpecificityInput {
        +bool check_enabled
        +bool splice_variant_handling
        +bool snp_exclusion
        +MismatchSettings end_mismatch_strictness
        +bool mispriming_library
    }
    class PositionInput {
        +Range search_range
        +String exon_junction_span
        +bool intron_inclusion
        +Range intron_size
        +List~String~ restriction_enzymes
    }
    %% ==========================================================
    %% 2. Entity & Response Schema
    %% ==========================================================
    class GenomeSequence {
        %% 5.1.1 GenomeSequence
        +String id
        +String name
        +String sequence
        +int length_bp
    }
    class PrimerCandidate {
        +String id
        +String sequence
        +int start_bp
        +int end_bp
        +String strand
        +Metrics metrics
    }
    class Metrics {
        %% PrimerCandidate.metrics
        +float tm_c
        +float gc_percent
        +dict penalties
    }
    class PrimerDesignResponse {
        +GenomeSequence genome
        +List~PrimerCandidate~ candidates
        +Meta meta
    }
    class Meta {
        +PrimerDesignRequest params
        +String timestamp
        +float execution_time_ms
    }
    %% ==========================================================
    %% 3. Helper Classes (Value Objects)
    %% ==========================================================
    class Range {
        +float min
        +float max
    }
    class TmSettings {
        +float min
        +float opt
        +float max
    }
    class MismatchSettings {
        +int region_size
        +int min_mismatch
    }
    %% ==========================================================
    %% 4. Frontend State Management
    %% ==========================================================
    class ViewStore {
        <<Zustand State>>
        +int viewport_startBp
        +int viewport_endBp
        +float zoom_level
        +String selected_primer_id
        +String hovered_primer_id
        +Object filter_sort_state
        
        +setViewport(start, end)
        +setZoom(level)
        +selectPrimer(id)
    }
    %% ==========================================================
    %% Relationships
    %% ==========================================================
    %% Request Composition
    PrimerDesignRequest *-- BasicInput
    PrimerDesignRequest *-- PropertyInput
    PrimerDesignRequest *-- SpecificityInput
    PrimerDesignRequest *-- PositionInput
    %% Response Composition
    PrimerDesignResponse *-- GenomeSequence
    PrimerDesignResponse *-- Meta
    PrimerDesignResponse "1" o-- "many" PrimerCandidate
    PrimerCandidate *-- Metrics
    %% Helpers
    BasicInput ..> Range
    BasicInput ..> TmSettings
    PropertyInput ..> Range
    PositionInput ..> Range
    SpecificityInput ..> MismatchSettings
```
## 2. Sequence Diagram
Backend의 주요 시스템 동작 흐름 구조입니다.

```mermaid
sequenceDiagram
    autonumber
    
    participant User as 사용자
    participant Client as Client (Next.js)
    participant API as API (FastAPI)
    participant Algo as Algorithm Engine
    
    Note over User, Client: 1. 초기 설정 및 입력
    User->>Client: FASTA 데이터 입력 & 파라미터 설정
    User->>Client: "프라이머 찾기" 버튼 클릭
    
    Note over Client, API: 2. 데이터 전송 및 검증
    Client->>Client: 입력값 유효성 검사 (길이, 형식)
    Client->>API: POST /api/v1/primer/design (JSON)
    activate API
    
    API->>API: Request Body 검증 (Pydantic)
    alt 유효하지 않은 데이터
        API-->>Client: 400 Bad Request (Error Msg)
        Client-->>User: 에러 알림 표시
    else 유효한 데이터
        Note over API, Algo: 3. 알고리즘 수행
        API->>Algo: design_primers(sequence, params)
        activate Algo
        
        Algo->>Algo: 후보군 탐색 (Sliding Window)
        Algo->>Algo: 필터링
        Algo->>Algo: 최적 페어링 및 정렬
        
        Algo-->>API: List[PrimerPair] 반환
        deactivate Algo
        
        API-->>Client: 200 OK (Result JSON)
    end
    deactivate API
    
    Note over Client, User: 4. 결과 시각화
    Client->>Client: GenomeCanvas 렌더링
    Client->>User: 최적 프라이머 목록 및 위치 표시
```

# Data Flow Diagram and Structure Chart

이 문서는 사용자의 유전체 데이터(FASTA)가 시스템 내부에서 어떤 변환 과정을 거쳐 최종 프라이머 쌍(Primer Pair)으로 도출되는지를 시각화한 DFD Level 1입니다.

## DFD Level 1: Primer Design Process

```mermaid
graph LR
    classDef entity fill:#f9f,stroke:#333,stroke-width:2px, color:#000;
    classDef process fill:#e1f5fe,stroke:#0277bd,stroke-width:2px,rx:10,ry:10, color:#000;
    classDef store fill:#fff9c4,stroke:#fbc02d,stroke-width:2px, color:#000;
    %% 1. External Entities (외부 엔티티)
    User[사용자/Researcher]:::entity
    Client[Frontend UI]:::entity
    %% 2. Processes (처리 과정)
    P1(입력 데이터 파싱 및 검증):::process
    P2(후보군 생성):::process
    P3(물성 계산-Tm/GC):::process
    P4(필터링 및 페어링):::process
    %% 3. Data Stores (데이터 저장소/설정값)
    Config[(파라미터 설정값\nMin/Max Tm, Length)]:::store
    RefData[(생물학적 상수\nSalt Correction 등)]:::store
    %% 4. Data Flows (데이터 흐름)
    User -- "1. FASTA 파일 & 설정" --> Client
    Client -- "2. Raw Sequence JSON" --> P1
    
    P1 -- "3. 정제된 서열 (Clean Sequence)" --> P2
    P1 -- "유효하지 않은 서열 에러" --> Client
    
    Config -.-> P2
    P2 -- "4. 모든 가능한 20mer 조각들" --> P3
    
    RefData -.-> P3
    P3 -- "5. 후보군 리스트 (with Properties)" --> P4
    
    Config -.-> P4
    P4 -- "6. 최적 프라이머 쌍 (Ranked Pairs)" --> Client
    Client -- "7. 시각화된 결과" --> User
```
# PrimerFlow 구조 도표 (Structure Chart)

이 문서는 DFD에서 정의된 데이터 처리 과정을 수행하기 위한 소프트웨어 모듈의 계층 구조를 정의합니다.
상위 모듈이 하위 모듈을 제어하며, 화살표는 호출 관계를 나타냅니다.

## Structure Chart

```mermaid
graph TD
    classDef root fill:#1a237e,stroke:#fff,stroke-width:2px,color:#fff;
    classDef mainModule fill:#0277bd,stroke:#fff,stroke-width:2px,color:#fff;
    classDef subModule fill:#e1f5fe,stroke:#0277bd,stroke-width:1px,color:#000;
    classDef library fill:#fff9c4,stroke:#fbc02d,stroke-width:1px,stroke-dasharray: 5 5, color:#000;
    %% Level 0: Main Controller
    Main["Main Controller<br/>(API Endpoint)"]:::root
    %% Level 1: Primary Modules
    InputMod["Input Processing Module"]:::mainModule
    AlgoMod["Core Algorithm Module"]:::mainModule
    ResultMod["Result Formatting Module"]:::mainModule
    %% Level 2: Sub Modules
    %% Input Branch
    Parser["FASTA Parser"]:::subModule
    Validator["Input Validator"]:::subModule
    %% Algorithm Branch
    Gen["Candidate Generator<br/>(Sliding Window)"]:::subModule
    PropFilt["Property Filter"]:::subModule
    SpecFilt["Specificity Filter"]:::subModule
    BindFilt["Binding Filter"]:::subModule
    %% Result Branch
    JSON["JSON Serializer"]:::subModule
    %% 호출 관계 연결
    Main --> InputMod
    Main --> AlgoMod
    Main --> ResultMod
    InputMod --> Parser
    InputMod --> Validator
    AlgoMod --> Gen
    AlgoMod --> PropFilt
    AlgoMod --> BindFilt
    AlgoMod --> SpecFilt
    ResultMod --> JSON
```
