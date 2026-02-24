# Step1 시퀀스 입력 정규화 및 검증 UX 개선

## 1. 배경 및 목적

- Step1 입력에서 `atgc` 대소문자 처리, 비정상 문자(`N`, 숫자, 특수문자) 정리, 붙여넣기/업로드 동의 UX를 일관되게 만들기 위해 파서/입력 이벤트 로직을 개선.

## 2. 프롬프트 (User Input)

```text
Phase 1: 염기서열(ATGC) 입력 파서 및 기본 UX 구현
[요구사항 정의]
src/lib/parsers 디렉토리 내에 Step 1에서 사용할 DNA 염기서열 입력 파싱 및 검증 로직을 구현해 주세요.

자동 대문자 변환: 입력된 'atgc' 문자열을 대소문자 구분 없이 자동으로 대문자로 변환하여 상태를 업데이트해야 합니다.

실시간 Sanitize: 입력 시점에서 ATGC 이외의 유효하지 않은 문자가 감지되면 즉시 필터링하여 제거하는 로직을 포함해 주세요.

사용자 안내(UX): Caps Lock이 꺼져 있어도 대문자로 강제 변환되거나 예외 문자가 사라지는 동작에 사용자가 당황하지 않도록, 입력창 하단에 해당 동작을 설명하는 작은 안내 캡션(Caption) 텍스트를 추가해 주세요.

Phase 2: 빌드 에러 트러블슈팅 및 로직 수정
[이슈 해결 요청]
Next.js 환경에서 Turbopack과 관련된 빌드 에러가 발생하여 Job이 실패했습니다.

제공된 에러 로그를 기반으로 ./app/page.tsx (약 12번 라인) 및 ./components/steps/Step1TemplateEssential.tsx (약 12번 라인)의 모듈 Import 경로를 검토해 주세요.

지정된 경로에 실제 모듈이나 파일이 존재하는지 확인하고, 누락되거나 잘못된 참조가 있다면 수정해 주세요.


[로직 결함 수정 및 대안 제시]
현재 구현된 파서 로직에서 긴 문자열을 한 번에 붙여넣기(Paste)할 때, 유효한 문자까지 과도하게 삭제되는 이슈가 확인되었습니다.

해당 문자열 손실 문제를 해결할 수 있는 최적화된 Sanitize 접근 방식을 2~3가지 제안해 주세요.

제안해 주신 솔루션 중 1번 방식을 채택하여 코드를 수정해 주시고, 클라이언트에서 백엔드로 데이터를 전송하기 직전에 최종 문자열이 '대문자 ATGC'로만 구성되어 있는지 다시 한번 엄격하게 확인하는 최종 검증(Validation) 로직을 추가해 주세요.

Phase 3: 예외 케이스 처리 및 대화상자(Dialog) 연동
[UX 개선 및 예외 문자 처리 로직 보강]
단순 텍스트 입력과 달리, .fasta 파일 업로드나 대량 텍스트 붙여넣기 시 미확인 염기(예: 'N')가 포함되어 있을 수 있습니다. 무조건적인 삭제보다는 사용자 확인을 거치는 방향으로 흐름을 개선하고자 합니다.

유효하지 않은 문자가 감지되었을 때 즉시 삭제하지 않고, "이상 문자를 제거하시겠습니까?"를 묻는 사용자 동의 대화상자(Confirmation Dialog)를 띄우도록 로직을 수정해 주세요.

이 대화상자 호출 로직은 다음 세 가지 이벤트에 모두 동일하게 적용되어야 합니다:

UI 상의 'Paste' 버튼 클릭 시

'Upload FASTA' 기능을 통한 파일 로드 시

입력 텍스트 영역(Textarea) 내에서의 Ctrl + V 키보드 이벤트 발생 시

Phase 4: 이벤트 핸들러 리팩토링 및 로직 최적화
[코드 최적화]
이전 단계들에서 추가된 검증 로직들로 인해 중복된 코드가 발생하여, 컴포넌트의 상태 관리 로직을 다음과 같이 정리하고자 합니다.

handleTextareaChange 이벤트 핸들러 내부에서 입력과 동시에 필터링이 이루어질 수 있도록 코드를 수정해 주세요.
(예: updateSequence(sanitizeStep1TemplateSequenceInput(event.currentTarget.value)) 구조 활용)

입력 단계에서 Sanitize가 보장됨에 따라, 폼 제출 시 작동하는 handleGenerate 함수 내의 불필요한 중복 검증 로직을 제거하고 전체 흐름을 단순화해 주세요.
```

## 3. AI 응답 요약 (AI Output)

- `src/lib/parsers/step1TemplateSequence.ts` 생성/확장:
  - `toUpperCaseAtgcOnly`, `sanitizeStep1TemplateSequenceInput`, `normalizeStep1TemplateSequence`
  - `getInvalidStep1TemplateSequenceChar`, `getInvalidStep1TemplateSequenceChars`
  - `isUppercaseAtgcOnlySequence`
- `Step1TemplateEssential` 입력 처리 개선:
  - 전체 문자열 sanitize 방식 → 입력 조각(chunk) sanitize 방식으로 전환.
  - `Paste 버튼`, `Upload FASTA`, `Ctrl+V` 경로에서 비-ATGC 문자 발견 시 `window.confirm`으로 제거 동의 요청.
  - `onBeforeInput` 기반 실시간 정리 + `onChange` sanitize 폴백 추가.
  - 안내 문구 추가 및 2줄 줄바꿈 반영.
- `app/page.tsx` 반영:
  - Generate 직전 정규화 적용.
  - “입력은 있었지만 정규화 후 빈 시퀀스” 차단 로직 추가.
  - 중복 `ATGC-only` 재검증 블록 제거로 검증 단순화.
  - Turbopack module-not-found 대응으로 parser import 경로 조정.
- 테스트 추가/보강:
  - `tests/step1TemplateSequence.test.ts`에 대문자화/정규화/invalid 문자 수집/검증 케이스 추가.

## 4. 결과 및 적용 (Result)

- 적용 파일:
  - `src/lib/parsers/step1TemplateSequence.ts`
  - `components/steps/Step1TemplateEssential.tsx`
  - `app/page.tsx`
  - `tests/step1TemplateSequence.test.ts`
- 주요 결과:
  - Step1 입력은 `ATGC` 중심으로 자동 정리되고, 가져오기(Paste/Ctrl+V/Upload) 시 비정상 문자 제거 전에 사용자 동의를 받음.
  - paste 시 과도 삭제 문제를 조각 단위 처리로 완화.
  - Generate 직전 유효 염기열 존재 여부를 보장.
  - Turbopack import 에러 재발 가능성을 낮춤.