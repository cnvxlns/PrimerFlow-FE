# GenomeCanvas.tsx 스켈레톤 코드 생성 프롬프트

## 1. 배경 및 목적

- React와 TypeScript를 사용하여 `GenomeCanvas.tsx` 컴포넌트의 기본 스켈레톤 코드를 생성하고자 함

## 2. 프롬프트 (User Input)

```text
Generate a skeleton code for a React component named GenomeCanvas.tsx using TypeScript. The component should include the following features:
1. Props Interface: Define an interface for the component props, including properties for genome data, canvas dimensions, and any necessary callbacks.
2. State Management: Use React's useState hook to manage any internal state required for the component.
3. useEffect Hook: Implement the useEffect hook to handle side effects, such as fetching genome data or updating the canvas when props change.
4. Canvas Rendering: Set up a basic canvas element within the component, including necessary refs and event handlers for user interactions.
5. Type Annotations: Ensure all functions and variables are properly typed according to TypeScript standards.
6. Export Statement: Export the component as the default export of the module.
```

## 3. AI 응답 요약 (AI Output)
```text
- AI가 제안한 `GenomeCanvas.tsx` 컴포넌트의 스켈레톤 코드는 다음과 같은 주요 부분으로 구성됨:
  1. Props 인터페이스 정의: `GenomeCanvasProps` 인터페이스를 통해 유전체 데이터, 캔버스 크기, 콜백 함수 등의 속성을 명시
  2. 상태 관리: `useState` 훅을 사용하여 내부 상태를 관리하는 예시 코드 포함
  3. `useEffect` 훅: props 변경 시 캔버스를 업데이트하거나 유전체 데이터를 가져오는 사이드 이펙트 처리 코드 포함
  4. 캔버스 렌더링: `canvas` 요소를 설정하고, `useRef` 훅을 사용하여 참조 및 사용자 상호작용을 위한 이벤트 핸들러 포함
  5. 타입 주석: 모든 함수와 변수에 TypeScript 타입 주석이 적용되어 있음
  6. 기본 내보내기: 컴포넌트를 모듈의 기본 내보내기로 설정
```


## 4. 결과 및 적용 (Result)
- 생성된 스켈레톤 코드를 기반으로 `GenomeCanvas.tsx` 컴포넌트를 구현함
- 필요에 따라 추가 기능 및 스타일링을 적용하여 프로젝트에 통합함