# Step1 Sequence Input 버튼 동작 수정

## 1. 배경 및 목적

- Step1 시퀀스 입력 카드의 `Upload FASTA`, `Paste`, `Clean` 버튼이 동작하지 않아 파일 추가/클립보드 붙여넣기/입력 초기화 기능을 구현하고, 입력 길이(bp)도 즉시 반영하도록 개선.

## 2. 프롬프트 (User Input)
- step1에서 sequence input의 Upload FASTA, Paste, Clean버튼이 전혀 작동하지 않아. 각각의 버튼이 로컬의 디렉토리에서 찾아서 추가하는 기능, 클립보드에서 붙여넣는 기능, 입력된 내용을 제거하는 기능을 하게 수정해줘

## 3. AI 응답 요약 (AI Output)

- `Step1TemplateEssential`을 상태형으로 전환해 textarea를 제어 컴포넌트로 관리하고, 알파벳만 집계해 실시간 bp 카운트를 노출.
- Upload FASTA: 숨겨진 파일 입력(`.fa/.fasta/.txt` 허용)을 버튼으로 열어 파일 내용을 읽고 앞뒤 공백을 정리해 현재 입력에 개행으로 이어붙인 후 포커스 유지.
- Paste: `navigator.clipboard.readText()`로 클립보드 텍스트를 받아 동일한 정리/이어붙이기를 수행하며, Clipboard API 부재 시 콘솔 에러로 처리.
- Clean: 입력값을 비우고 textarea에 포커스를 돌려 즉시 재입력 가능하도록 함. 버튼 타입을 `button`으로 명시해 폼 제출 부작용을 차단.

## 4. 결과 및 적용 (Result)

- 적용 파일: `components/steps/Step1TemplateEssential.tsx`
- 효과: FASTA 업로드/클립보드 붙여넣기/입력 초기화 동작이 활성화되고, bp 카운트가 입력 변화에 맞춰 갱신됨.
- 테스트: 미실행. 브라우저에서 각 버튼 클릭 → 파일 선택/클립보드 텍스트 붙여넣기/초기화 시 textarea와 bp 표시가 기대대로 변하는지 확인 필요.
