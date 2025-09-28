![이미지 2025  9  28  오후 7 37](https://github.com/user-attachments/assets/0bc50b09-e9c5-4b18-9d80-ed728cf8821e)
> 대학생 학습 및 일정 관리 서비스, Schedulo (🔗 https://www.schedulo.co.kr/)

## 📌 프로젝트 개요

대학생들은 학습 과정에서 일정 관리의 어려움으로 인해 벼락치기, 복습 부재, 학습 불균형과 같은 문제를 겪습니다. 저희 팀은 이러한 문제를 인식하고 학생 일정 관리의 새로운 혁신을 추구하며 프로젝트를 시작했습니다.

일정 관리의 어려움은 크게 ① 계획 수립, ② 계획 관리, ③ 꾸준한 실행의 세 가지로 나눌 수 있습니다.

저희 프로젝트는 학사 시스템 연동을 통한 시간표와 과제의 자동 반영, 학습 루틴 등록 및 자동 복습 일정 생성, 알림과 시각화, 점수제 경쟁 기능을 통해 학습의 지속성을 높이고자 합니다. 이를 통해 학생들은 계획 수립부터 실행까지 학습 전 과정을 한 번에 해결할 수 있는 통합 학습 관리 경험을 누릴 수 있습니다.

## 🚀 주요 기능

### 1. 개인 맞춤형 일정 관리 + 공부법 설계

- 달력에서 일정을 한눈에 확인하고 완료 처리로 하루 진척도를 파악하며, 드래그 앤 드롭으로 손쉽게 이동·수정할 수 있습니다.
    
    <img width="1470" height="831" alt="달력" src="https://github.com/user-attachments/assets/62324915-8ce5-4e5d-93c0-faaa07796700" />
    
- 태그를 통해 일정을 분리하여 사용자별, 주제별로 묶어 관리할 수 있습니다.
    
    <img width="1470" height="831" alt="태그" src="https://github.com/user-attachments/assets/4a39b03b-6a89-4f99-a00b-ce147932040d" />
    
- 공부 습관을 직접 등록할 수 있으며, 등록된 습관을 기반으로 복습 일정이 자동으로 생성됩니다.
    
    <img width="1470" height="831" alt="공부 습관 등록" src="https://github.com/user-attachments/assets/8b7d35e9-465e-4c78-9408-16697479ff12" />
    
- 시험 공부 계획을 직접 등록하거나, 이캠퍼스에서 수강 과목을 불러와 손쉽게 일정에 반영할 수 있습니다.
    
    <img width="1470" height="831" alt="시험 공부 일정 자동 생성" src="https://github.com/user-attachments/assets/1b139ce0-e3c4-4b8d-afa3-7b625135c2d8" />
    
- 일정 알림 기능을 통해 중요한 과제·시험을 놓치지 않습니다.
    
    <img width="1470" height="831" alt="리마인더" src="https://github.com/user-attachments/assets/ba317e30-b931-457b-a968-3e9284c561d6" />
    
- 뽀모도로 타이머로 학습 시간을 분 단위로 관리해 집중력을 유지합니다.
    
    <img width="1470" height="831" alt="타이머" src="https://github.com/user-attachments/assets/12418a62-e346-4ce4-8481-60f3c0714ba5" />
    

### 2. AI 에이전트 Dulo

- AI 에이전트 Dulo를 통해 위 모든 기능을 대화형으로 이용할 수 있습니다.
    
    <img width="1470" height="831" alt="AI 에이전트 Dulo" src="https://github.com/user-attachments/assets/4e6a4969-32b9-466b-bb81-4a35c566f811" />
    

### 3. 학사 시스템 연동

- 시간표를 직접 입력하지 않아도 학사 시스템에서 자동으로 가져옵니다.
    
    <img width="1470" height="831" alt="시간표" src="https://github.com/user-attachments/assets/c696633f-3897-45d1-9278-c899d1dd229f" />
    
- 학사 시스템과 연동해 과제·이러닝 일정을 손쉽게 불러올 수 있습니다.
    
    <img width="1470" height="831" alt="학사 시스템 정보 불러오기" src="https://github.com/user-attachments/assets/5a0923e5-a7cc-4856-b5d7-353b76482502" />
    

## 🛠️ 기술 스택 & 아키텍처

### 사용 기술

<table>
        <thead>
            <tr>
                <th>분류</th>
                <th>기술 스택</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td>Core</td>
                <td>
                    <img src="https://img.shields.io/badge/React-61DAFB?style=flat&logo=react&logoColor=white"/>
                    <img src="https://img.shields.io/badge/Vite-646CFF?style=flat&logo=vite&logoColor=white">
                </td>
            </tr>
            <tr>
                <td>Styling</td>
                <td>
                    <img src="https://img.shields.io/badge/Tailwind CSS-06B6D4?style=flat&logo=tailwindCSS&logoColor=white">
                    <img src="https://img.shields.io/badge/PostCSS-DD3A0A?style=flat&logo=postcss&logoColor=white">
                </td>
            </tr>
            <tr>
                <td>State Management</td>
                <td>
                    <img src="https://img.shields.io/badge/TanStack Query-FF4154?style=flat&logo=reactquery&logoColor=white">
                    <img src="https://img.shields.io/badge/Jotai-000000?style=flat&logo=jotai&logoColor=white">
                </td>
            </tr>
            <tr>
                <td>HTTP Client</td>
                <td>
                    <img src="https://img.shields.io/badge/Axios-5A29E4?style=flat&logo=axios&logoColor=white">
                </td>
            </tr>
            <tr>
                <td>Router</td>
                <td>
                    <img src="https://img.shields.io/badge/React Router-CA4245?style=flat&logo=reactrouter&logoColor=white">
                </td>
            </tr>
            <tr>
                <td>Forms</td>
                <td>
                    <img src="https://img.shields.io/badge/React Hook Form-EC5990?style=flat&logo=reacthookform&logoColor=white">
                </td>
            </tr>
            <tr>
                <td>UI Components</td>
                <td>
                    <img src="https://img.shields.io/badge/Lucide React-000000?style=flat&logo=lucide&logoColor=white">
                    <img src="https://img.shields.io/badge/React Select-FF6B6B?style=flat&logo=react&logoColor=white">
                </td>
            </tr>
            <tr>
                <td>Calendar & Charts</td>
                <td>
                    <img src="https://img.shields.io/badge/FullCalendar-4285F4?style=flat&logo=calendar&logoColor=white">
                    <img src="https://img.shields.io/badge/Nivo-FF6B35?style=flat&logo=d3-dot-js&logoColor=white">
                </td>
            </tr>
            <tr>
                <td>Drag & Drop</td>
                <td>
                    <img src="https://img.shields.io/badge/React DnD-000000?style=flat&logo=react&logoColor=white">
                </td>
            </tr>
            <tr>
                <td>Backend Services</td>
                <td>
                    <img src="https://img.shields.io/badge/Firebase-FFCA28?style=flat&logo=firebase&logoColor=black">
                </td>
            </tr>
        </tbody>
    </table>
    
### 시스템 아키텍처

<img width="857" height="397" alt="시스템아키텍처" src="https://github.com/user-attachments/assets/e16d3741-57ab-4830-b6da-45ddd031bf3f" />

## 👥 팀원 소개
| 권동균 | 장지연 | 정우현 |
| --- | --- | --- |
| <a href="https://github.com/Kwondongkyun"><img src="https://github.com/user-attachments/assets/5573c1e9-d381-4ff5-b61d-111d886dd034" width="100px;" alt=""/><br /><sub><b>Kwon</b></sub></a> | <a href="https://github.com/JANGJEEYEON"><img src="https://avatars.githubusercontent.com/u/106160603?s=96&v=4" width="100px;" alt=""/><br /><sub><b>JANGJEEYEON</b></sub></a> | <a href="https://github.com/UHyeonj"><img src="https://avatars.githubusercontent.com/u/128715793?v=4" width="100px;" alt=""/><br /><sub><b>UHyeonj</b></sub></a> |

## 📽️ 시연 영상
https://youtu.be/_NxCuFZ9Vk0
