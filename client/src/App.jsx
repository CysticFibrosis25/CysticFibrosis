import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import LoginSignup from "./pages/LoginSignup";
import Dashboard from "./pages/Dashboard";
import Chatbot from "./pages/Chatbot";
import MoreInfo from "./pages/MoreInfo";
import { Toaster } from "react-hot-toast";

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
      <Toaster
        position="bottom-right"
        toastOptions={{
          duration: 3000,
          style: {
            fontSize: "14px",
            padding: "14px 24px",
            borderRadius: 50,
            background: "rgba(255, 255, 255)",
            color: "#000000",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
            backdropFilter: "blur(16px)",
            border: "1px solid #e0e0e0",
            fontFamily: "'DM Sans', sans-serif",
          },
          success: {
            iconTheme: {
              primary: "#22c55e",
              secondary: "#ffffff",
            },
            style: {
              borderLeft: "4px solid #22c55e",
              borderRight: "4px solid #22c55e",
            },
          },
          error: {
            iconTheme: {
              primary: "#ef4444",
              secondary: "#ffffff",
            },
            style: {
              borderLeft: "4px solid #ef4444",
              borderRight: "4px solid #ef4444",
            },
          },
        }}
      />
    </>
  );
};

export default App;
