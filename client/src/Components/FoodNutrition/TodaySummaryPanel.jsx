import React, { useEffect, useState } from "react";
import axios from "axios";

const TodaySummaryPanel = () => {
  const API = import.meta.env.VITE_REACT_APP_BACKEND_URL;
  const email = localStorage.getItem("email");

  const [day, setDay] = useState(null);
  const [nutrition, setNutrition] = useState(null);

  useEffect(() => {
    axios.get(`${API}/api/food/day?email=${email}`)
      .then(res => setDay(res.data));

    axios.get(`${API}/api/nutrition?email=${email}`)
      .then(res => setNutrition(res.data));
  }, []);

  const consumed = day?.daily_totals?.calories || 0;
  const target = nutrition?.daily_calorie_target || 0;
  const percent = target ? Math.min((consumed / target) * 100, 100) : 0;

  return (
    <div className="w-[95%] md:w-[70%] mx-auto bg-white/80 border border-[#BDC0C2] rounded-4xl p-6">
      <h2 className="text-xl font-bold text-[#0A7CFF] mb-4">
        Today’s Intake
      </h2>

      <div className="w-full bg-gray-200 rounded-full h-4 mb-3">
        <div
          className="bg-[#0A7CFF] h-4 rounded-full"
          style={{ width: `${percent}%` }}
        />
      </div>

      <div className="flex justify-between text-sm">
        <p>{consumed} kcal consumed</p>
        <p>{target} kcal target</p>
      </div>
    </div>
  );
};

export default TodaySummaryPanel;
