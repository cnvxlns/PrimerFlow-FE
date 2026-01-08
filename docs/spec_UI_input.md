# Primer design 시 필요한 UI_input들
##### 본 문서에서는 생물학적 단어와 내용은 최대한 배제하여 개발 시 숙지하여야 한다고 판단되는 단어만 첨언하여 작성하였습니다.

# 1. Introduction
Primer 설계는 주형 DNA(template DNA)라는 거대한 문자열 텍스트 안에서, 우리가 원하는 특정 구간만을 복사하기 위해 "정확한 위치"를 찾아내는 "검색 패턴(Search Pattern)"을 만드는 과정과 유사합니다. Primer가 주형 DNA에 얼마나 "정확하고(Specificity)", "빠르게(Efficiency)" 붙느냐가 핵심입니다. 아래는 Primer 설계 시 고려해야 하는 변수들을 정리한 내용입니다.

## 2. UI 입력 파라미터 (Input Parameters)

사용자 인터페이스(UI)에서 입력받아야 할 항목들은 알고리즘 내 역할에 따라 다음과 같이 분류된다.

### 2.1 기본 입력 (Basic Input)
알고리즘 구동을 위한 필수 데이터이다.

| 항목명 (Label) | 필수 | 입력 타입 | 설명 및 로직 |
| :--- | :---: | :--- | :--- |
| **PCR Template Sequence** | ✅ | String / File | 프라이머를 설계할 표적 DNA 서열 (FASTA 포맷). |
| **Target Organism (DB)** | ✅ | Dropdown | 특이성 검증(Specificity Check)을 수행할 대상 유전체 DB 선택 (예: hg38, mm10). |
| **PCR Product Size** | ✅ | Range (Min-Max) | 원하는 증폭 산물의 크기 범위 (예: $100 \sim 300 \text{bp}$). |
| **Primer Tm** | ✅ | 3 Inputs | 프라이머의 목표 융해 온도 범위 (Min, Opt, Max).<br>*(일반적으로 $57 \sim 63^\circ\text{C}$)* |

### 2.2 프라이머 물성 설정 (Primer Property)
프라이머 자체의 물리화학적 성질 및 열역학적 안정성을 제어한다.

| 항목명 (Label) | 필수 | 입력 타입 | 알고리즘 처리 로직 |
| :--- | :---: | :--- | :--- |
| **Primer GC Content (%)** | | Range (Min-Max) | 프라이머 서열 내 G/C 비율 검사 (보통 40~60%). |
| **Max Tm Difference** | | Number | Forward/Reverse 프라이머 간 $T_m$ 차이 허용치 (권장 $\le 3^\circ\text{C}$). |
| **GC Clamp Requirement** | | Checkbox | 3' 말단 1~2bp가 G 또는 C로 끝나는지 확인. |
| **Max Poly-X Run** | | Number | 단일 염기 반복(예: AAAAA) 허용 횟수 제한. |
| **Concentration (nM)** | | Number | $T_m$ 및 $\Delta G$ 계산(Nearest-Neighbor 모델) 시 농도 보정 상수로 사용. |

### 2.3 결합 위치 및 구조 제어 (Binding Position)
유전자 구조(Exon/Intron), 변이(SNP), 제한효소 정보를 기반으로 프라이머 위치를 필터링한다.

| 항목명 (Label) | 필수 | 입력 타입 | 알고리즘 처리 로직 |
| :--- | :---: | :--- | :--- |
| **Search Range** | | 2 Inputs (From-To) | 템플릿 내에서 프라이머 탐색 구간 제한. |
| **Exon Junction Span** | | Dropdown | Annotation DB(SQLite) 조회. 프라이머가 Exon 경계에 걸치는지 확인 (mRNA 타겟 시 gDNA 증폭 방지). |
| **Intron Inclusion** | | Checkbox | Annotation DB 조회. Fwd/Rev 프라이머 사이에 인트론이 포함되는지 확인. |
| **Intron Size Range** | | Range (Min-Max) | 포함될 인트론의 크기 범위 지정. |
| **Restriction Enzymes** | | List / Search | **[사용자 정의]** 템플릿 내 해당 효소 절단 부위와 프라이머가 겹치면 제거(Overlap check). |

### 2.4 특이성 검증 (Specificity)
Genome DB(pysam)를 활용하여 비특이적 결합을 차단한다.

| 항목명 (Label) | 필수 | 입력 타입 | 알고리즘 처리 로직 |
| :--- | :---: | :--- | :--- |
| **Specificity Check Enable** | ✅ | Checkbox | Genome DB 전수 검색 수행 여부 결정 (OFF 시 속도 향상, 위험 증가). |
| **Splice Variant Handling** | | Checkbox | Annotation DB 조회. 동일 유전자의 다른 전사체(Variant)에 결합하는 경우 허용(Pass). |
| **SNP Exclusion** | | Checkbox | SNP DB 조회. 프라이머 위치(특히 3' 말단)에 SNP 존재 시 제거. |
| **3' End Mismatch Strictness** | | Dropdown / Number | 비특이적 타겟 발견 시, 3' 말단 $N$ bp 내에 미스매치가 $M$개 미만이면 '위험'으로 간주하고 탈락시킴. |
| **Mispriming Library** | | Checkbox | 반복 서열(Repeat DB) 유사도 검사. |

---

## References
* Altschul, S. F., et al. (1990). Basic local alignment search tool. *Journal of Molecular Biology*.
* Altschul, S. F., et al. (1997). Gapped BLAST and PSI-BLAST. *Nucleic Acids Research*.
* Qu, W., et al. (2012). MFEprimer-2.0: a fast thermodynamics-based program for checking PCR primer specificity. *Nucleic Acids Research*.
* SantaLucia, J. (1998). A unified view of polymer, dumbbell, and oligonucleotide DNA nearest-neighbor thermodynamics. *PNAS*.
* Ye, J., et al. (2012). Primer-BLAST: A tool to design target-specific primers for polymerase chain reaction. *BMC Bioinformatics*.