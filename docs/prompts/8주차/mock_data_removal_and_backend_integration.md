# Mock Data Removal and Deployed Backend Integration

## 1. 배경 및 목적

- Week 5~7까지 사용하던 Mock 기반 결과 흐름을 제거하고, 실제 배포된 백엔드 API 응답을 기준으로 프론트엔드 동작을 전환.
- 프라이머 설계 요청(Request)부터 결과 모달(Canvas) 렌더링까지 실데이터 파이프라인을 안정화.
- API 실패 상황(네트워크/서버 오류)에서도 사용자에게 명확한 에러 메시지를 노출하도록 예외 처리를 보강.

## 2. 프롬프트 (User Input)

```text
Phase 1: Mock 제거 및 실서버 API 연동
[요구사항]
기존 Mock 응답(setTimeout 기반) 의존 로직을 제거하고, 배포된 백엔드 API를 호출하도록 프론트엔드 요청 흐름을 전환해 주세요.

- API Base URL은 환경변수(NEXT_PUBLIC_API_BASE_URL)로 주입하고, 미지정 시 /api를 기본값으로 사용해 주세요.
- 요청 엔드포인트는 /design으로 통일해 주세요.
- 요청 payload는 UI의 flat 입력을 백엔드 스펙의 nested 구조로 변환해 주세요.

Phase 2: 응답 매핑 및 UI 바인딩
[데이터 변환]
백엔드 응답(Genome/Candidate)을 Result Modal과 Canvas에서 바로 사용할 수 있는 UI 구조로 변환해 주세요.

- length, tracks, candidate 좌표(start_bp/end_bp)를 UI 친화 형태로 매핑해 주세요.
- 일부 필드가 누락된 경우에도 기본값으로 안전하게 동작하게 처리해 주세요.

Phase 3: 오류 처리 및 사용자 피드백
[UX 보강]
요청 실패 시 에러를 콘솔에만 남기지 말고 화면에서도 확인 가능하도록 처리해 주세요.

- 로딩/성공/실패 상태 전이를 명확히 관리해 주세요.
- 빈 입력이나 무효 입력은 API 호출 전에 차단해 주세요.
```

## 3. AI 응답 요약 (AI Output)

- `src/lib/api/client.ts`
  - `NEXT_PUBLIC_API_BASE_URL` 기반 axios 클라이언트 구성.
  - 기본값 `/api` 사용으로 로컬/배포 환경 모두 대응.
- `src/services/analysisService.ts`
  - `AnalyzeRequestInput`(flat) -> `PrimerDesignRequest`(nested) 변환 어댑터(`toPrimerDesignRequest`) 정리.
  - 백엔드 응답을 UI 트랙/프라이머 후보 구조로 변환하는 `toUiResponse` 로직 적용.
  - `analyzeGenome`에서 실제 `POST /design` 호출 후 UI 전용 응답 반환.
- `app/page.tsx`
  - Step1 검증 이후 `analyzeGenome` 호출하도록 Generate 흐름 연결.
  - 로딩/에러/성공 상태를 모달 오픈과 함께 관리.
- `components/PrimerResultModal.tsx`
  - API 결과를 기반으로 캔버스 데이터 표시 및 결과 메타 정보 렌더링.

## 4. 결과 및 적용 (Result)

- 적용 파일:
  - `src/lib/api/client.ts`
  - `src/lib/api/primer.ts`
  - `src/services/analysisService.ts`
  - `app/page.tsx`
  - `components/PrimerResultModal.tsx`
- 주요 결과:
  - Mock 의존 흐름을 제거하고, 배포된 백엔드 API 기반의 실데이터 파이프라인으로 전환.
  - 프론트 입력 스키마와 백엔드 요청 스키마 간 매핑을 정리해 API 연동 안정성 개선.
  - 실패 케이스에서 사용자 가시 에러 메시지를 제공해 디버깅 및 운영 대응성 향상.
