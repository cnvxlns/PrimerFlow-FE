# Material Icons Loading & Navigation Icon Fix

## 1. 배경 및 목적

- Material Icons 폰트가 로드되지 않아 카드 헤더의 아이콘 위치에 ligature 텍스트(`tune` 등)만 보이던 문제를 해결.
- 스텝 이동 CTA 버튼의 화살표를 텍스트(`->`, `<-`) 대신 아이콘으로 교체해 일관된 UI/아이콘 세트를 유지.

## 2. 프롬프트 (User Input)
<stitch>
- ESSENTIAL SETTINGS 헤더 옆에 `tune` 문자열이 보이는 것을 Material Icons로 바꿔 달라는 요청.
- Material Icons가 제대로 렌더링되도록 CDN `<link>` 또는 패키지 임포트 안내 요청.
- Next 버튼의 `->` 텍스트를 `arrow_forward`/`chevron_right` 아이콘으로 교체하고, Flex 정렬로 간격을 두라는 요청.
- 동일한 처리를 Back 버튼에도 적용해 달라는 후속 요청.
<codex>
- 전역 `<head>`에 Material Icons CDN을 추가하고, 해당 스팬에 `material-icons` 클래스를 부여해 ligature를 아이콘으로 렌더링.
- Next/Back CTA를 텍스트 화살표 대신 Material Icons로 치환하고 기존 flex 정렬과 gap을 활용해 수직 정렬/간격을 유지.

## 3. AI 응답 요약 (AI Output)

- `app/layout.tsx` `<head>`에 Material Icons CDN 추가:
  `<link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons" />`.
- 카드 헤더 아이콘 스팬에 `material-icons` 클래스를 적용해 `tune`, `science`, `location_on`, `verified_user`가 폰트 아이콘으로 표시되도록 수정.
- 하단 스티키 CTA에서 Next 화살표를 `material-icons` `arrow_forward` 아이콘으로 교체, 기존 `flex items-center gap-3`로 정렬/간격 유지.
- Back 버튼도 `arrow_back` 아이콘 + “Back” 텍스트 조합으로 교체해 일관성 확보.

## 4. 결과 및 적용 (Result)

- 적용 파일: `app/layout.tsx`(Material Icons CDN), `app/page.tsx`(카드 헤더 아이콘 `material-icons` 클래스 적용, Next/Back 버튼 아이콘 교체).
- 효과: Material Icons 폰트가 정상 로드되어 카드 헤더/CTA에서 의도한 아이콘이 표시되고, 스텝 이동 버튼의 화살표 표현이 통일됨.
- 테스트: 별도 테스트 미수행. 브라우저에서 단계별 카드 헤더와 하단 CTA의 아이콘 표시 여부를 확인하면 됨.
