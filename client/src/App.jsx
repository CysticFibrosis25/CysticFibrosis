import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import LoginSignup from "./pages/LoginSignup";
import Dashboard from "./pages/Dashboard";
import Chatbot from "./pages/Chatbot";
import MoreInfo from "./pages/MoreInfo";


import { ToastContainer, Slide } from "react-toastify";

const App = () => {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<LoginSignup />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/chatbot" element={<Chatbot />} />
        <Route path="/moreinfo" element={<MoreInfo />} />
        </Routes>
      </Router>
      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        pauseOnHover
        theme="light"
        transition={Slide}
      />
    </>
  );
};

export default App;
