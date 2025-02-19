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
src/
├── components/
│   ├── CalendarView.jsx      # 캘린더 컴포넌트
|   ├── CalendarView.css
│   ├── Modal.jsx             # 일정 상세 조회 모달 (선택 사항)
|   ├── Modal.css
├── hooks/
│   ├── useCalendar.js        # 캘린더 관련 로직을 훅으로 분리
├── services/
│   ├── eventService.js       # 일정 데이터 가져오기 (Mock API)
├── App.jsx
└── index.js
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

