import Userdetais from "../Components/Dashboard/Userdetails";
import Footer from "../Components/Footer";
import Navbar from "../Components/Navbar";
import Stats from "../Components/Dashboard/Stats";
import PresentUserProfile from "../Components/Dashboard/PresentUserProfile";
import { Healthtips2 } from "../Components/Healthtips2";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import React, { useEffect } from "react";
import { useState } from "react";
import axios from "axios";
const API_BASE_URL =
  import.meta.env.VITE_REACT_APP_BACKEND_URL || "https://localhost:5000";
import Foodsummary from "../Components/Dashboard/Foodsummary";

const Dashboard = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("isLoggedIn");
    if (isLoggedIn !== "true") {
      navigate("/login");
    }
  }, [navigate]);

  useEffect(() => {
    const fetchUserData = async () => {
      setIsLoading(true);
      try {
        const email = localStorage.getItem("email");
        if (!email) {
          console.error("Email is missing — user not logged in?");
          return;
        }
        const response = await axios.get(
          `${API_BASE_URL}/auth/user/details?email=${email}`
        );
        setProfile(response.data);
      } catch (error) {
        console.error("Error fetching user data:", error);
        alert("Failed to fetch user data. Please try again later.");
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
      <Navbar />
      <div>
        {isLoading ? (
          <div className="flex justify-center items-center py-8 mt-8">
            <div className="flex space-x-2">
              <div className="w-2 h-2 bg-[#0A7CFF] rounded-full animate-bounce [animation-delay:-0.3s]"></div>
              <div className="w-2 h-2 bg-[#0A7CFF] rounded-full animate-bounce [animation-delay:-0.15s]"></div>
              <div className="w-2 h-2 bg-[#0A7CFF] rounded-full animate-bounce"></div>
            </div>
          </div>
        ) : (
          <>
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
                <p className="text-sm">Let&apos;s help you thrive today!</p>
              </div>
            </motion.div>
            <div>
              <Userdetais />
              <PresentUserProfile profile={profile} />
              <Stats />
              <Foodsummary />
              <Healthtips2 />
              <Footer />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
