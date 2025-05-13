import { Route, Routes } from "react-router-dom";
import Home from "../pages/Home";
import Settings from "../pages/Settings";
import Timetable from "../pages/Timetable";
import ChatbotComponent from "../components/chatbot/ChatbotComponent";
import Loginpage from "../pages/Login";
import MainLayout from "../components/layout/MainLayout";

// 라우팅 함수 분리
const AppRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/timetable" element={<Timetable />} />
        <Route path="/chatbot" element={<ChatbotComponent />} />
      </Route>
      <Route path="/login" element={<Loginpage />} />
    </Routes>
  );
};

export default AppRouter;
