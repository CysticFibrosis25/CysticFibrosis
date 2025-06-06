import Userdetais from "../Components/Dashboard/Userdetais";
import Footer from "../Components/Footer";
import Navbar from "../Components/Navbar";
import Stats from "../Components/Dashboard/Stats";
import { Healthtips2 } from "../Components/Healthtips2";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import React, { useEffect } from "react";
import { useState } from "react";
import axios from "axios";
const API_BASE_URL = import.meta.env.VITE_REACT_APP_BACKEND_URL || "https://localhost:5000";

const Dashboard = () => {
  const navigate = useNavigate();
  const [profile, setProfile]=useState({});

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("isLoggedIn");
    if (isLoggedIn !== "true") {
      navigate("/login");
    }
  }, [navigate]); 

   useEffect(() => {
    const fetchUserData = async () => {
      const email = localStorage.getItem("email");
      if (!email) {
       console.error("Email is missing — user not logged in?");
        return;
      } 
      const response = await axios.get(`${API_BASE_URL}/auth/user/details?email=${email}`);
      setProfile(response.data);
    };

    fetchUserData();
  }, []);

  return (
    <div className="h-full font-dm-sans flex flex-col">
      <Navbar />
      <div className="font-dm-sans text-black py-8 text-2xl md:text-3xl mt-8 text-center tracking-tight w-full">
        <p className="font-medium">
          Welcome back, <span className="text-[#260AFF]">{profile.name}</span>
        </p>
        <p className="text-sm">Let&apos;s help you thrive today!</p>
      </div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <Userdetais />
        <Stats />
        <Foodsummary />
        <Healthtips2 />
        <Footer />
      </motion.div>
    </div>
  );
};

export default Dashboard;
