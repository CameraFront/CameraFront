# 위례트램 FMS 프론트엔드

## 설치

### 패키지 설치

```bash
yarn
```

### 개발 모드

```bash
yarn dev
```

### 빌드

```bash
yarn build
```

## 주요 기술 스택

- React 18
- Vite 4
- Yarn

## 주요 패키지

| 이름                     | 역할                                            |
| ------------------------ | ----------------------------------------------- |
| Redux Toolkit            | 전역 및 각 페이지 상태 관리                     |
| Ant Design               | UI 컴포넌트                                     |
| Styled Components        | 커스텀 스타일링                                 |
| theme-get(Styled System) | Theme 유틸 메서드                               |
| Axios                    | Data Fetching                                   |
| ECharts                  | 차트                                            |
| React Grid Layout        | Draggable 위젯(대시보드)                        |
| React Lazy With Preload  | Lazy loading 및 Preloading                      |
| React Router             | 페이지 라우팅                                   |
| React Use Websocket      | 실시간 알림을 위한 웹소켓 연결                  |
| React Flow               | 노드기반 다이어그램(토폴로지, 맵현황, 랙실장도) |
| ESlint                   | 코드 분석 및 에러 검출                          |
| Prettier                 | 자동 코드 포멧팅                                |

## 환경변수

```js
VITE_APP_API_BASE_URL; // 주요 API URI
VITE_APP_REPORTS_API; // 보고서 전용 API URI
VITE_APP_API_PREFIX; // API Prefix
VITE_APP_API_WS; // 웹소켓 전용 API URI
```

## 폴더구조

```js
├── public/ // 정적 assets (폰트 및 이미지)
└── src/
    ├── app/   // Redux Store 및 Hooks
    ├── assets/   // 정적 assets (오디오 및 이미지)
    ├── components/  // Custom 컴포넌트
    ├── config/   // 각종 설정 상수들
    ├── css/   // 스타일링 관련 파일들
    ├── features/ // 각 페이지별 Redux Reducers, Redux Thunks 및 Types
    ├── hooks/ // React Hooks
    ├── pages/ // 각 페이지 View
    ├── types/ // Global Types
    └── utils/ // 유틸 함수들
```

## 스타일링

- 각 페이지 및 컴포넌트의 스타일링은 해당 정의 파일 내에서 Styled Component로 덮어씌워 이루어짐
- 주요 스타일 값은 `themeGet()` 함수를 이용해 테마(`css/theme/index.ts`)에서 가져와 적용함
- 테마는 라이트/다크모드로 나눠져 있음

## 기타

- 각 API에 대한 상세는 포스트맨에 기재되어 있음
