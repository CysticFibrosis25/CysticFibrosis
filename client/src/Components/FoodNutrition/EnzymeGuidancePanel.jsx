import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";

const EnzymeGuidancePanel = ({ groupType, mealFat }) => {
  const API = import.meta.env.VITE_REACT_APP_BACKEND_URL;
  const email = localStorage.getItem("email");

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!groupType || mealFat === undefined || mealFat === null) return;

    const fetchEstimate = async () => {
      setLoading(true);
      try {
        const res = await axios.post(`${API}/api/enzyme/estimate`, {
          email,
          meal_fat: mealFat,
          group_type: groupType
        });
        setResult(res.data);
      } catch (err) {
        toast.error(
          err.response?.data?.message ||
          "Enzyme estimate unavailable. Please check your enzyme setup."
        );
        setResult(null);
      } finally {
        setLoading(false);
      }
    };

    fetchEstimate();
  }, [groupType, mealFat, email, API]);

  if (!groupType) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="w-[95%] md:w-[70%] mx-auto bg-white/80 border border-[#BDC0C2] rounded-4xl p-6"
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <h2 className="text-xl font-bold text-[#0A7CFF] mb-3">
          Enzyme Guidance
        </h2>

        <p className="text-sm text-gray-600 mb-4">
          Based on the fat content of your{" "}
          <strong>{groupType.replace("_", " ")}</strong>, here is a supportive
          estimate aligned with your doctor’s guidance.
        </p>

        {loading && (
          <p className="text-sm text-gray-500">
            Calculating enzyme guidance…
          </p>
        )}

        {result && (
          <div className="space-y-4 text-sm">
            {result.classification === "very_small_snack" ? (
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <p className="font-medium text-blue-800">
                  This appears to be a very low-fat snack.
                </p>
                <p className="text-gray-700 mt-2">
                  Enzymes are usually <strong>not required</strong> for foods with
                  minimal fat.
                </p>
              </div>
            ) : (
              <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                <p>
                  <strong>Estimated lipase units:</strong>{" "}
                  <span className="text-green-700 font-semibold">
                    {result.recommended_lipase_units.toLocaleString()}
                  </span>
                </p>

                {result.warnings?.length > 0 && (
                  <div className="mt-3 bg-yellow-50 border border-yellow-300 rounded-lg p-3">
                    <p className="font-medium text-yellow-800 mb-1">
                      Please note:
                    </p>
                    <ul className="list-disc list-inside text-yellow-800">
                      {result.warnings.map((w, i) => (
                        <li key={i}>{w}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            <p className="text-xs text-gray-500 italic">
              {result.note}
            </p>
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
};

export default EnzymeGuidancePanel;
