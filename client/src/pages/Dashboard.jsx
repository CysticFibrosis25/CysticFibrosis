import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import axios from "axios";

/* Layout */
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";

/* Profile cards */
import Userdetails from "../Components/Dashboard/Userdetails";
import PresentUserProfile from "../Components/Dashboard/PresentUserProfile";
import HealthNutritionCard from "../Components/Dashboard/HealthNutritionCard";

/* Utils */
import { toast } from "react-toastify";

const API_BASE_URL =
  import.meta.env.VITE_REACT_APP_BACKEND_URL || "https://localhost:5000";

const Dashboard = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  /* 🔐 Protect route */
  useEffect(() => {
    const isLoggedIn = localStorage.getItem("isLoggedIn");
    if (isLoggedIn !== "true") {
      navigate("/login");
    }
  }, [navigate]);

  /* 📡 Fetch user profile */
  useEffect(() => {
    const fetchUserData = async () => {
      setIsLoading(true);
      try {
        const email = localStorage.getItem("email");
        if (!email) {
          setIsLoading(false);
          return;
        }

        const response = await axios.get(
          `${API_BASE_URL}/auth/user/details?email=${email}`
        );
        setProfile(response.data);
      } catch (error) {
        console.error("Error fetching user data:", error);
        toast.error("Failed to fetch user data. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, []);

  return (
    <div
      className="h-full font-dm-sans flex flex-col min-h-screen"
      style={{
        backgroundImage: `
          repeating-linear-gradient(0deg, transparent, transparent 39px, #BDC0C230 39px, #BDC0C230 40px),
          repeating-linear-gradient(90deg, transparent, transparent 39px, #BDC0C230 39px, #BDC0C230 40px)
        `,
        backgroundSize: "40px 40px",
        backgroundColor: "#ffffff",
      }}
    >
      {/* Navbar */}
      <Navbar />

      {/* Content */}
      <div className="flex-1">
        {isLoading ? (
          <div className="flex justify-center items-center py-16 mt-8">
            <div className="flex space-x-2">
              <div className="w-2 h-2 bg-[#0A7CFF] rounded-full animate-bounce [animation-delay:-0.3s]" />
              <div className="w-2 h-2 bg-[#0A7CFF] rounded-full animate-bounce [animation-delay:-0.15s]" />
              <div className="w-2 h-2 bg-[#0A7CFF] rounded-full animate-bounce" />
            </div>
          </div>
        ) : (
          <>
            {/* Welcome header */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <div className="font-dm-sans text-black py-10 text-2xl md:text-3xl mt-8 text-center tracking-tight w-full">
                <p className="font-medium">
                  Welcome back,{" "}
                  <span className="text-[#260AFF]">{profile.name}</span>
                </p>
                <p className="text-sm">
                  Manage your profile and health details below
                </p>
              </div>
            </motion.div>

            {/* Profile Sections */}
            <div className="flex flex-col gap-6">
              {/* Basic profile + reminders */}
              <Userdetails />

              {/* CF-specific profile */}
              <PresentUserProfile />

              {/* Health + nutrition profile */}
              <HealthNutritionCard />
            </div>
          </>
        )}
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Dashboard;
