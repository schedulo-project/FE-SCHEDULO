import { Route, Routes } from "react-router-dom";
import Home from "../pages/Home";
import Settings from "../pages/Settings";
import Timetable from "../pages/Timetable";
import ChatbotComponent from "../components/chatbot/ChatbotComponent";
import Loginpage from "../pages/Login";
import Main from "../pages/Main";

// 라우팅 함수 분리
const AppRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<Main />} />
      <Route path="/login" element={<Loginpage />} />
      <Route path="/settings" element={<Settings />} />
      <Route path="/timetable" element={<Timetable />} />
      <Route path="/chatbot" element={<ChatbotComponent />} />
    </Routes>
  );
};

export default AppRouter;
