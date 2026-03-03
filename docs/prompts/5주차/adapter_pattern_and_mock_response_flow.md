### 1. 배경 및 목적
 - 프론트엔드의 폼 입력 상태(Flat Object)와 백엔드 API가 요구하는 복잡한 중첩 구조(Nested Object) 간의 규격 차이를 해결하기 위함.
 - Mock 데이터를 활용하여 분석 결과를 시각화하는 모달(Modal) 뷰에 실제 데이터 바인딩 파이프라인을 구축.

### 2. 프롬프트 (User Input)
```aiignore
Phase 1: 프론트-백엔드 데이터 규격 변환 (Adapter 로직)
[요구사항 정의]
프론트엔드의 Zustand 스토어에 저장된 평면적인(Flat) 입력 데이터들을 백엔드 FastAPI 규격에 맞는 중첩(Nested) JSON 형태로 변환하는 Adapter 함수를 작성해 줘.
요구사항:
1. 입력 데이터 중 `Range`, `PrimerDesignRequest` 타입을 백엔드 스펙에 맞게 매핑할 것.
2. 타입 안정성을 보장하고, 누락된 필드가 없도록 TypeScript 인터페이스를 기반으로 작성할 것.

Phase 2: Mock API 클라이언트 구축 및 Result Modal 연동
[데이터 바인딩 요청]
만들어진 Adapter를 거쳐 생성된 Request 객체를 서버로 전송하는 API 호출 함수(`lib/api/primer.ts`)를 만들어 줘.
아직 실제 서버가 없으니, 지연 시간(Delay)을 시뮬레이션하고 Mock 데이터를 반환하도록 구현해 줘.
반환된 결과를 바탕으로, Result Modal 내의 캔버스와 결과 리스트 UI에 데이터가 렌더링되도록 연결해 줘.
```

### 3. AI 응답 요약 (AI Output)
 - src/lib/api/adapters.ts 생성:
   - UI 상태를 백엔드 DTO로 변환하는 mapStoreToPrimerRequest 함수 구현.

 - src/lib/api/primer.ts 모킹:
   - axios 혹은 fetch 기반의 API 통신 뼈대 작성.
   - setTimeout을 활용한 네트워크 지연 시뮬레이션 및 PrimerDesignResponse 타입에 맞춘 더미(Mock) 데이터 반환 로직 추가.

 - ResultModal 컴포넌트 수정:

반환된 Mock 데이터를 React 상태로 받아와 내부 캔버스와 리스트 컴포넌트로 Prop 전달.

4. 결과 및 적용 (Result)
   적용 파일: src/lib/api/adapters.ts, src/lib/api/primer.ts, components/PrimerResultModal.tsx

주요 결과: 프라이머 설계 요청(Request) 프로세스(입력값 → 어댑터 → API 호출)의 전체 흐름 완성. Mock 데이터를 활용해 결과 화면 시각화 성공.