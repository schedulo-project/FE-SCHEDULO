import React from "react";
import "./App.css";

import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import Home from "./pages/Home";
import Settings from "./pages/Settings";
import TimeTableForm from "./components/TimeTableForm";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/timetable" element={<TimeTableForm />} />
      </Routes>
    </Router>
  );
};

export default App;
