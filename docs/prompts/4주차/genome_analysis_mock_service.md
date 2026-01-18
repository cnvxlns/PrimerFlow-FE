# Genome Analysis Mock Service 및 네이티브 모듈 대응

## 1. 배경 및 목적

- FastAPI 백엔드가 준비되지 않은 상태에서 프론트엔드 UI를 검증하기 위해 유전체 분석 API를 모킹하는 서비스가 필요함.
- Windows 환경에서 Next/Tailwind 빌드 시 lightningcss/oxide 네이티브 바이너리 누락으로 500 오류가 발생해 즉각적인 우회 조치가 요구됨.

## 2. 프롬프트 (User Input)

```text
Task: Implement a Mocking Service for Genome Analysis

I need to simulate backend interaction to test the frontend UI, as the FastAPI backend is not ready yet.
Please create (or update) the `src/services/analysisService.ts` file with the following requirements:

1.  **Define Types**:
    * `AnalyzeRequest`: Should use `snake_case` for keys to match Python Pydantic models (e.g., `target_sequence`, `species`).
    * `AnalyzeResponse`: Should include `result` (string), `score` (number), and `details` (object or string) for testing.

2.  **Implement `analyzeGenome` function**:
    * It should accept `AnalyzeRequest`.
    * **Mocking Logic**: Instead of making a real `api.post` call, return a `Promise` that resolves after a **1.5-second delay** (to simulate network latency).
    * **Mock Data**: The resolved data should be a realistic dummy response (e.g., "Success", score: 98.5).
    * **Commented Real Code**: Please keep the actual `axios` post call code commented out so I can easily uncomment it later when the backend is ready.

3.  **Dependencies**:
    * Import `api` from `@/lib/axios`.

Context:
- Framework: Next.js (App Router)
- HTTP Client: Axios
- Backend: FastAPI (Not running yet)
```

## 3. AI 응답 요약 (AI Output)

- 새 `src/services/analysisService.ts`에 `AnalyzeRequest`(snake_case), `AnalyzeResponse` 타입 정의 후 `analyzeGenome`을 1.5초 지연 뒤 더미 데이터(결과/점수/세부정보)로 resolve하도록 구현, 실제 `api.post` 호출은 주석으로 보관.
- `lib/axios.ts`를 추가해 기존 axios 클라이언트를 `api` alias로 export, 서비스에서 `@/lib/axios` 경로 사용 가능하도록 정리.
- Windows에서 설치된 네이티브 바이너리가 로더에서 발견되도록 `lightningcss.win32-x64-msvc.node`와 `tailwindcss-oxide.win32-x64-msvc.node`를 각 패키지 루트로 복사하고, 설치/실행 OS 일치를 권고.

## 4. 결과 및 적용 (Result)

- 적용 파일: `src/services/analysisService.ts`, `lib/axios.ts`
- 효과: 백엔드 없이도 분석 UI가 모킹 응답으로 동작하고, 빌드 시 Windows 네이티브 모듈 누락으로 인한 500 오류를 긴급 우회.
- 테스트: 미실행(모킹 함수는 Promise 지연 후 값 반환). 빌드 재시작으로 오류 해소 확인 필요; 장기적으로는 설치/실행 환경을 통일해 재설치 권장.
