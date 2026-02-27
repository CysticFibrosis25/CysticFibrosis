import React, { useEffect, useState } from "react";
import axios from "axios";
import { useRef } from "react";

const WeeklyCalorieStrip = () => {
  const API = import.meta.env.VITE_REACT_APP_BACKEND_URL;
  const email = localStorage.getItem("email");
  const containRef = useRef(null);

  const [week, setWeek] = useState([]);

  useEffect(() => {
    if (containRef.current) {
        containRef.current.scrollLeft =
        containRef.current.scrollWidth;
    }
  }, [week]);

  useEffect(() => {
    axios
      .get(`${API}/api/food/weekly?email=${email}`)
      .then(res => setWeek(res.data))
      .catch(() => setWeek([]));
  }, []);

  const maxCalories = Math.max(...week.map(d => d.calories), 1);

  return (
    <div className="w-[95%] md:w-[70%] mx-auto">
      <h2 className="text-lg font-semibold text-[#0A7CFF] mb-3">
        Weekly Progress
      </h2>

      <div ref={containRef} className="flex gap-4 overflow-x-auto pb-4">
        {week.map((day, idx) => {
            const safeMax = Math.max(...week.map(d => d.calories), 1);
            const height = day.calories === 0 ? 6:(day.calories / safeMax) * 100;

          return (
            <div key={idx} className="flex flex-col items-center min-w-[40px]">
              <div className="h-40 flex items-end">
                <div
                  className={`w-6 rounded-full transition-all ${
                    idx === week.length - 1
                      ? "bg-[#0A7CFF]"
                      : "bg-[#AFDDFF]"
                  }`}
                  style={{ height: `${height}%` }}
                />
              </div>
              <p className="text-xs mt-1">
                {idx === week.length - 1 ? (
                <span className="text-[#0A7CFF] font-semibold">Today</span>
                ) : (
                <span className="text-gray-500">{day.date.slice(5)}</span>
                )}
             </p>

            </div>
          );
        })}
      </div>
    </div>
  );
};

export default WeeklyCalorieStrip;
