### 📄 5. `docs/05_QA_Ops_Risks.md`

# 7. 테스트 전략

## 7.1 테스트 케이스
* **파서:** FASTA 정상/비정상 입력, 허용 문자 검증.
* **알고리즘:** View Culling 경계값 계산, Auto Layout 겹침 방지.
* **UI/E2E:** 입력 → 설계 → 렌더링 → 내보내기 흐름 검증.
* **성능:** 10,000bp 이상 데이터에서 프레임/지연 측정.

## 7.2 경계값 테스트 (Boundary Testing)
* 서열 길이: 1bp, 9,999bp, 10,000bp.
* 뷰포트: `start=0`, `start>end` (오류 케이스).

---

# 8. 릴리즈 및 운영

* **배포:** Frontend는 **Vercel**, Backend는 FastAPI.
* **환경 변수:** `NEXT_PUBLIC_API_URL` 필수.
* **모니터링:** API 실패율, 주요 UI 액션 실패율.
* **롤백:** Vercel 배포 히스토리 기반 즉시 롤백.

---

# 9. 리스크 및 의존성

## 9.1 리스크
* 대용량 데이터 처리 시 브라우저 메모리 증가로 인한 성능 저하.
* 캔버스 UI의 접근성(스크린 리더) 대응 어려움.
* **0-based vs 1-based** 좌표계 불일치 시 시각화 오류 발생 가능성.

## 9.2 기술 스택 (Dependencies)
* **Frontend:** Next.js 16, TypeScript, Tailwind, Zustand, SWR/TanStack Query.
* **Backend:** FastAPI (Python).