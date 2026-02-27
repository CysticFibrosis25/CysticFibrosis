import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

const MEAL_COLORS = {
  breakfast: "bg-[#E8F2FF]",
  lunch: "bg-[#EAF7F0]",
  dinner: "bg-[#FFF1E8]",
  snack: "bg-[#FFF9DB]",
  extra: "bg-[#F3F3F3]"
};

const getMealColor = (mealKey) => {
  if (mealKey.startsWith("snack")) return MEAL_COLORS.snack;
  return MEAL_COLORS[mealKey] || MEAL_COLORS.extra;
};

const formatMealName = (mealKey) => {
  if (mealKey.startsWith("snack")) {
    const n = mealKey.split("_")[1];
    return `Snack ${n}`;
  }
  return mealKey.charAt(0).toUpperCase() + mealKey.slice(1);
};

const DailyMealPlanPanel = () => {
  const API = import.meta.env.VITE_REACT_APP_BACKEND_URL;
  const email = localStorage.getItem("email");

  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(false);
  const [hasGeneratedToday, setHasGeneratedToday] = useState(false);
  const [initialChecking, setInitialChecking] = useState(true);

  // 🔹 On mount: check if today's plan already exists
  useEffect(() => {
    const checkExistingPlan = async () => {
      try {
        const res = await axios.get(
          `${API}/api/recipes/day-plan?email=${email}`
        );

        if (res.data?.meals) {
          setPlan(res.data);
          setHasGeneratedToday(true);
        }
      } catch {
        // No plan yet → show button
      } finally {
        setInitialChecking(false);
      }
    };

    checkExistingPlan();
  }, []);

  const fetchPlan = async () => {
  setLoading(true);
  try {
    const res = await axios.post(
      `${API}/api/recipes/day-plan`,
      { email }
    );

    setPlan(res.data);
    setHasGeneratedToday(true);
  } catch {
    toast.error("Could not generate meal plan. Please try again.");
  } finally {
    setLoading(false);
  }
};

  if (initialChecking) return null;

  return (
    <motion.div
      className="w-[95%] md:w-[70%] mx-auto bg-white/80 border border-[#BDC0C2] rounded-4xl p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <h2 className="text-xl font-bold text-[#0A7CFF] mb-2">
        Today’s Meal Plan
      </h2>

      <p className="text-sm text-gray-600 mb-4">
        A full-day meal recommendation based on your calorie target and dietary
        preferences. This refreshes automatically tomorrow.
      </p>

      {!plan && (
        <div className="text-center py-6">
          <button
            onClick={fetchPlan}
            disabled={loading || hasGeneratedToday}
            className={`rounded-full px-6 py-2 text-white ${
              hasGeneratedToday
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-[#0A7CFF] hover:opacity-90"
            }`}
          >
            {loading
              ? "Generating..."
              : hasGeneratedToday
              ? "Meal plan generated for today"
              : "Get today’s meal plan"}
          </button>

          <p className="text-xs text-gray-500 mt-2 italic">
            You get one meal plan recommendation per day.
          </p>
        </div>
      )}

      {plan && (
        <div className="space-y-5 mt-4">
          {Object.entries(plan.meals).map(([mealKey, mealData]) => {
            const bgColor = getMealColor(mealKey);

            return (
              <div
                key={mealKey}
                className={`rounded-3xl p-4 ${bgColor}`}
              >
                <h3 className="font-semibold mb-3">
                  {formatMealName(mealKey)}
                </h3>

                <div className="space-y-4">
                  {mealData.items.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex gap-4 bg-white/70 p-3 rounded-xl"
                    >
                      {item.image && (
                        <img
                          src={item.image}
                          alt={item.title}
                          className="w-24 h-24 rounded-lg object-cover flex-shrink-0"
                        />
                      )}

                      <div className="flex-1">
                        <p className="font-medium text-sm mb-1">
                          {item.title || "Suggested item"}
                        </p>

                        <div className="flex flex-wrap gap-4 text-xs text-gray-700">
                          <span>
                            <strong>{item.calories}</strong> kcal
                          </span>
                          <span>
                            <strong>{item.fat}</strong> g fat
                          </span>
                          {item.protein !== undefined && (
                            <span>
                              <strong>{item.protein}</strong> g protein
                            </span>
                          )}
                          {item.readyInMinutes && (
                            <span>⏱ {item.readyInMinutes} min</span>
                          )}
                        </div>

                        {item.url && (
                          <a
                            href={item.url}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-block mt-2 px-3 py-1.5 rounded-full bg-black text-white text-xs font-medium hover:opacity-80 transition"
                          >
                            View recipe
                          </a>
                        )}

                        {item.note && (
                          <p className="text-xs text-gray-500 mt-1 italic">
                            {item.note}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}

          <p className="text-xs text-gray-500 mt-6 italic">
            This is just a recommendation — you don’t have to follow it strictly.
            Try what feels right for you, and always log what you actually eat.
          </p>
        </div>
      )}
    </motion.div>
  );
};

export default DailyMealPlanPanel;
