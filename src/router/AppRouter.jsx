import { Route, Routes } from "react-router-dom";
import Home from "../pages/Home";
import Settings from "../pages/Settings";
import Timetable from "../pages/Timetable";
import ChatbotComponent from "../components/chatbot/ChatbotComponent";
import Loginpage from "../pages/Login";
import MainLayout from "../components/layout/MainLayout";
import StudyPlanStep from "../components/studyPlan/StudyPlanStep";

//setting에 사용되는 컴포넌트들
import Profile from "../components/settingsDetail/Profile";
import Alarm from "../components/settingsDetail/Alarm";
import StudyPlanSetting from "../components/settingsDetail/StudyPlanSetting";
import DataVisualization from "../components/settingsDetail/DataVisualization";

import PasswordChange from "../components/settingsDetail/PasswordChange";
import Signup from "../pages/Signup";

// 라우팅 함수 분리
const AppRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/settings" element={<Settings />}>
          <Route path="profile" element={<Profile />}>
            <Route path="password" element={<PasswordChange />} />
          </Route>
          <Route path="alarm" element={<Alarm />} />
          <Route path="studyplan" element={<StudyPlanSetting />} />
          <Route path="data" element={<DataVisualization />} />
        </Route>
        <Route path="/timetable" element={<Timetable />} />
        <Route path="/chatbot" element={<ChatbotComponent />} />
        <Route path="/study-plan" element={<StudyPlanStep />} />
      </Route>
      <Route path="/login" element={<Loginpage />} />
      <Route path="/signup" element={<Signup />} />
    </Routes>
  );
};

export default AppRouter;
