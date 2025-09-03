import {
  createBrowserRouter,
  Outlet,
  Navigate,
} from "react-router-dom";
import MainLayout from "../components/layout/MainLayout";
import Settings from "../pages/Settings";
import Home from "../pages/Home";
import Tag from "../pages/Tag";
import Timetable from "../pages/Timetable";
import ChatbotComponent from "../components/chatbot/ChatbotComponent";
import Loginpage from "../pages/Login";
import Signup from "../pages/Signup";
import Timer from "../pages/Timer";
import ExamPlanStep from "../components/examplan/ExamPlanStep";
import StudyPlanStep from "../components/studyplan/StudyPlanStep";

// settings detail
import Profile from "../components/settingsDetail/Profile";
import Alarm from "../components/settingsDetail/Alarm";
import StudyPlanSetting from "../components/settingsDetail/StudyPlanSetting";
import DataVisualization from "../components/settingsDetail/DataVisualization";
import PasswordChange from "../components/settingsDetail/PasswordChange";
import ExitUser from "../components/settingsDetail/ExitUser";
import SamwaterChange from "../components/settingsDetail/SamwaterChange";

const AppRouter = createBrowserRouter([
  {
    path: "/",
    element: (
      <MainLayout>
        <Outlet />
      </MainLayout>
    ),
    children: [
      { index: true, element: <Home /> },
      { path: "tag", element: <Tag /> },
      { path: "timetable", element: <Timetable /> },
      { path: "chatbot", element: <ChatbotComponent /> },
      { path: "study-plan", element: <StudyPlanStep /> },
      { path: "timer", element: <Timer /> },
      { path: "examplan", element: <ExamPlanStep /> },
      {
        path: "settings",
        element: (
          <Settings>
            <Outlet />
          </Settings>
        ),
        children: [
          {
            index: true,
            element: <Navigate to="profile" replace />,
          },
          {
            path: "profile",
            element: (
              <Profile>
                <Outlet />
              </Profile>
            ),
            children: [
              { path: "password", element: <PasswordChange /> },
              { path: "exit", element: <ExitUser /> },
              { path: "smul", element: <SamwaterChange /> },
            ],
          },
          { path: "alarm", element: <Alarm /> },
          { path: "studyplan", element: <StudyPlanSetting /> },
          { path: "data", element: <DataVisualization /> },
        ],
      },
    ],
  },
  { path: "/login", element: <Loginpage /> },
  { path: "/signup", element: <Signup /> },
  // 기타 라우트 추가
]);

export default AppRouter;
