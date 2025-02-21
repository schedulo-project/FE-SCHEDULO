import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import CheckSchedule from "./pages/CheckSchedule";
import ScheduleEdit from "./pages/ScheduleEdit";
import Tag from "./components/Tag";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/checkschedule" element={<CheckSchedule />} />
        <Route path="/scheduleedit" element={<ScheduleEdit />} />
      </Routes>
    </Router>
  );
}

export default App;
