import React from "react";
import AppRouter from "./router/AppRouter";
import "./App.css";

import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";

const App = () => {
  return (
    <Router>
      <AppRouter />
    </Router>
  );
};

export default App;
