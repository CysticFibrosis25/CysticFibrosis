import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import { motion } from "framer-motion";

import NutritionProfileCard from "../Components/FoodNutrition/NutritionProfileCard";
import WeeklyCalorieStrip from "../Components/FoodNutrition/WeeklyCalorieStrip";
import TodaySummaryPanel from "../Components/FoodNutrition/TodaySummaryPanel";
import MealLoggerSection from "../Components/FoodNutrition/MealLoggerSection";
import EnzymeGuidancePanel from "../Components/FoodNutrition/EnzymeGuidancePanel";
import DailyMealPlanPanel from "../Components/FoodNutrition/DailyMealPlanPanel";
import EnzymeProfileCard from "../Components/FoodNutrition/EnzymeProfileCard";


const FoodNutrition = () => {
    const navigate= useNavigate();
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
    const email= localStorage.getItem("email");
    const [nutritionReady, setNutritionReady] = useState(false);
    const [enzymeReady, setEnzymeReady] = useState(false);
    const [enzymeTarget, setEnzymeTarget] = useState(null);

    useEffect(() => {
      if (!isLoggedIn || !email) {
        navigate("/login");
      }
    }, [isLoggedIn, email, navigate]);

  return (
    <div
      className="min-h-screen font-dm-sans flex flex-col"
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

      <motion.div
        className="flex-1 flex flex-col gap-10 py-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
       <NutritionProfileCard onReady={() => setNutritionReady(true)} />
        {nutritionReady && (
       <EnzymeProfileCard onReady={() => setEnzymeReady(true)} />
        )}

        {nutritionReady && enzymeReady && (
        <>
        <WeeklyCalorieStrip />
        <TodaySummaryPanel />
        <MealLoggerSection onMealComplete={setEnzymeTarget} />
        {enzymeTarget && (
        <EnzymeGuidancePanel
        groupType={enzymeTarget.groupType}
        mealFat={enzymeTarget.mealFat}
        />
        )}
        <DailyMealPlanPanel />
        </>
     )}
      </motion.div>

      <Footer />
    </div>
  );
};

export default FoodNutrition;
