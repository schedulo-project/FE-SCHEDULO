import React from "react";
import AppRouter from "./router/AppRouter";
import "./App.css";

import { AuthProvider } from "./contexts/AuthContext";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <AppRouter />
      </AuthProvider>
    </Router>
  );
};

export default App;
