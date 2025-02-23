# FE-MVP

## UC007 - 캘린더 조회

### 📌 **1. 기능 정의**

MVP 단계 최소 기능:

- **월간/주간/일간 뷰** 전환 (초기에는 월간 뷰만)
- **이벤트 표시**: 등록된 일정이 캘린더에 표시되도록
- **날짜 클릭 시 상세 일정 조회** (추가 기능 고려)

---

### ⚙️ **2. 기술 스택 선택**

- **Frontend:** React
- **상태 관리:** `useState`와 `useReducer` (필요 시 Redux)
- **UI 라이브러리:** 일단은 CSS
- **캘린더 라이브러리:**
  - `react-calendar` (간단한 기능)

---

### 🗂️ **3. 폴더 구조 예시**

```
📦 FE-MVP
 ┣ 📂 src
 ┃ ┣ 📂 components        # 🔹 재사용 가능한 컴포넌트
 ┃ ┃ ┣ 📜 Calendar.js      # FullCalendar 컴포넌트
 ┃ ┃ ┣ 📜 EventForm.js     # 일정 추가 폼
 ┃ ┃ ┗ 📜 EventModal.js    # 일정 상세 모달
 ┃ ┣ 📂 pages             # 🔹 주요 페이지
 ┃ ┃ ┣ 📜 Home.js         # 메인 캘린더 페이지
 ┃ ┃ ┗ 📜 Settings.js     # 설정 페이지 (추후 확장 가능)
 ┃ ┣ 📂 hooks             # 🔹 커스텀 훅 (데이터 관리)
 ┃ ┃ ┗ 📜 useEvents.js    # 일정 관리 훅
 ┃ ┣ 📂 styles            # 🔹 CSS 파일 (Tailwind & 모듈)
 ┃ ┃ ┣ 📜 global.css      # 전역 스타일
 ┃ ┃ ┗ 📜 calendar.module.css  # 캘린더 관련 스타일
 ┃ ┣ 📂 utils             # 🔹 유틸리티 함수
 ┃ ┃ ┗ 📜 dateUtils.js    # 날짜 관련 유틸 함수
 ┃ ┣ 📜 App.js            # 메인 앱 파일
 ┃ ┣ 📜 index.js          # React 엔트리 파일
 ┃ ┗ 📜 data.json         # (임시) 일정 데이터 저장
 ┣ 📜 package.json
 ┣ 📜 tailwind.config.js  # Tailwind 설정 (사용 시)
 ┣ 📜 .gitignore
 ┗ 📜 README.md

```

---

### ‼️ **4. 실행 방법**

1. 환경 설정

   ```bash
   npm i
   ```

2. 실행
   ```bash
   npm run dev
   ```
