# Genome Analysis Mock Service 및 네이티브 모듈 대응

## 1. 배경 및 목적

- FastAPI 백엔드가 준비되지 않은 상태에서 프론트엔드 UI를 검증하기 위해 유전체 분석 API를 모킹하는 서비스가 필요함.
- 모킹 서비스 응답을 실제 UI 흐름(Generate Primers 버튼)과 연결해 최종 스텝에서 결과를 바로 확인할 수 있게 함.
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
    * Import `api` from `@/lib/api/client`.

Context:
- Framework: Next.js (App Router)
- HTTP Client: Axios
- Backend: FastAPI (Not running yet)

Refactor `src/app/page.tsx` to finalize the Primer Generation UI.
1. Remove Smoke Test button.
2. Wire “Generate Primers” to analyzeGenome with loading/error state and raw JSON output in a <pre>.
3. On success, open a modal that reuses the Genome Canvas preview (zoom/reset controls + canvas) to display the API result.
```

## 3. AI 응답 요약 (AI Output)

- 새 `src/services/analysisService.ts`에 `AnalyzeRequest`(snake_case), `AnalyzeResponse` 타입 정의 후 `analyzeGenome`을 1.5초 지연 뒤 더미 데이터(결과/점수/세부정보)로 resolve하도록 구현, 실제 `api.post` 호출은 주석으로 보관.
- `lib/api/client.ts`에 axios 클라이언트를 두고 `api` alias를 export하도록 정리해 단일 진입점으로 통합.
- `components/ui/WizardFooterNav.tsx`의 마지막 스텝 버튼을 `onGenerate`/`isGenerating` props로 확장해 로딩 중 비활성화 및 “Loading...” 텍스트를 노출하도록 수정.
- `app/page.tsx`에서 Smoke Test 컴포넌트 제거 후 최종 스텝의 “Generate Primers” 버튼을 `analyzeGenome`에 연결; `isLoading`/`apiResult`/`errorMessage` 상태를 추가해 try-catch로 오류를 처리하고, `<pre className="bg-gray-100 p-4 rounded mt-4 overflow-auto">`에 JSON.stringify 결과를 출력.
- API 성공 시 결과를 `GenomeData`로 안전 변환하는 헬퍼를 추가해 `GenomeCanvas`가 요구하는 스키마를 만족시키고, 모달을 띄워 기존 프리뷰 UI(줌 인/아웃/리셋 컨트롤 + Canvas)를 재사용해 결과를 시각화.
- Windows에서 설치된 네이티브 바이너리가 로더에서 발견되도록 `lightningcss.win32-x64-msvc.node`와 `tailwindcss-oxide.win32-x64-msvc.node`를 각 패키지 루트로 복사하고, 설치/실행 OS 일치를 권고.

## 4. 결과 및 적용 (Result)

- 적용 파일: `src/services/analysisService.ts`, `lib/axios.ts`, `components/ui/WizardFooterNav.tsx`, `app/page.tsx`
- 효과: 백엔드 없이도 최종 스텝에서 Generate Primers를 눌러 모킹 응답을 로딩/에러 상태와 함께 확인할 수 있고, 성공 시 모달 내 Genome Canvas 프리뷰로 결과를 바로 시각화할 수 있음. Windows 네이티브 모듈 누락으로 인한 빌드 500 오류를 긴급 우회.
- 테스트: 모킹 함수는 Promise 지연 후 값 반환(별도 테스트 미실행). 빌드 재시작으로 오류 해소 확인 필요; 장기적으로는 설치/실행 환경을 통일해 재설치 권장.
