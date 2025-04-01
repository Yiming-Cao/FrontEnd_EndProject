import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import CryptoDashboard from "./components/CryptoDashboard";
import Home from "./components/Home";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard/:coinId" element={<CryptoDashboard />} />
      </Routes>
    </Router>
  );
};

export default App;