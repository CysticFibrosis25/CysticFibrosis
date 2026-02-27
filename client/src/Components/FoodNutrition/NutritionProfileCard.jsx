import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import EditIcon from "@mui/icons-material/Edit";
import toast from "react-hot-toast";

/* ---------------------------
   Constants
--------------------------- */

const DIET_OPTIONS = [
  { label: "Vegetarian", value: "vegetarian" },
  { label: "Vegan", value: "vegan" },
  { label: "Keto", value: "keto" },
  { label: "Paleo", value: "paleo" },
  { label: "Gluten-free", value: "gluten_free" }
];


/* ---------------------------
   Helper: minimum meals rule
--------------------------- */
const getMinimumMeals = (calories) => {
  const c = Number(calories || 0);
  if (c >= 5000) return 8;
  if (c >= 4000) return 7;
  if (c >= 3000) return 6;
  return 3;
};

/* ---------------------------
   Component
--------------------------- */

const NutritionProfileCard = ({ onReady }) => {
  const API = import.meta.env.VITE_REACT_APP_BACKEND_URL;
  const email = localStorage.getItem("email");

  const [profile, setProfile] = useState(null);
  const [editData, setEditData] = useState(null);
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  /* ---------------------------
     Load existing profile
  --------------------------- */
  useEffect(() => {
    axios
      .get(`${API}/api/nutrition?email=${email}`)
      .then((res) => {
        if (res.data?.daily_calorie_target) {
          setProfile(res.data);
          onReady?.(true);
        } else {
          // First-time user → initialize editable state
          setEditData({
            daily_calorie_target: "",
            meals_per_day: 3,
            dietary_preferences: [],
            food_allergies: ""
          });
        }
      })
      .catch(() => {
        toast.error("Failed to load nutrition profile");
      })
      .finally(() => setLoading(false));
  }, []);

  /* ---------------------------
     Enter edit mode
  --------------------------- */
  const startEdit = () => {
    setEditData({
      daily_calorie_target: profile?.daily_calorie_target || "",
      meals_per_day: profile?.meals_per_day || 3,
      dietary_preferences: profile?.dietary_preferences || [],
      food_allergies: (profile?.food_allergies || []).join(", ")
    });
    setEditing(true);
  };

  /* ---------------------------
     Toggle diet
  --------------------------- */
  const toggleArrayValue = (field, value) => {
    setEditData((prev) => ({
      ...prev,
      [field]: prev[field].includes(value)
        ? prev[field].filter((v) => v !== value)
        : [...prev[field], value]
    }));
  };

  /* ---------------------------
     Save profile
  --------------------------- */
  const saveProfile = async () => {
    if (!editData.daily_calorie_target) {
      toast.error("Daily calorie target is required");
      return;
    }

    const minMeals = getMinimumMeals(editData.daily_calorie_target);

    if (editData.meals_per_day < minMeals) {
      toast.error(
        `Based on your calorie target, at least ${minMeals} meals per day are recommended`
      );
      return;
    }

    setSaving(true);
    try {
      await axios.post(`${API}/api/nutrition`, {
        email,
        daily_calorie_target: editData.daily_calorie_target,
        meals_per_day: editData.meals_per_day,
        dietary_preferences: editData.dietary_preferences,
        food_allergies: editData.food_allergies
          .split(",")
          .map((a) => a.trim())
          .filter(Boolean)
      });

      setProfile({
        daily_calorie_target: editData.daily_calorie_target,
        meals_per_day: editData.meals_per_day,
        dietary_preferences: editData.dietary_preferences,
        food_allergies: editData.food_allergies
          .split(",")
          .map((a) => a.trim())
          .filter(Boolean)
      });

      setEditing(false);
      onReady?.(true);
      toast.success("Nutrition setup saved");
    } catch {
      toast.error("Failed to save nutrition profile");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return null;

  /* ---------------------------
     Render
  --------------------------- */
  return (
    <motion.div
      className="w-[95%] md:w-[70%] mx-auto bg-white/80 border border-[#BDC0C2] rounded-4xl p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-[#0A7CFF]">
          Nutrition Setup
        </h2>

        {profile && !editing && (
          <button
            onClick={startEdit}
            className="bg-[#0A7CFF] text-white rounded-full px-3 py-1"
          >
            <EditIcon fontSize="small" />
          </button>
        )}
      </div>

      <AnimatePresence>
        {(editing || !profile) && editData ? (
          <motion.div
            key="edit"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-4 text-sm"
          >
            {/* Daily calories */}
            <input
              className="input w-full"
              type="number"
              placeholder="Daily calorie target (e.g. 4200)"
              value={editData.daily_calorie_target}
              onChange={(e) => {
                const calories = e.target.value;
                const minMeals = getMinimumMeals(calories);

                setEditData({
                  ...editData,
                  daily_calorie_target: calories,
                  meals_per_day: Math.max(
                    editData.meals_per_day,
                    minMeals
                  )
                });
              }}
            />

            {/* Meals per day */}
            <input
              className="input w-full"
              type="number"
              min={getMinimumMeals(editData.daily_calorie_target)}
              placeholder="Meals per day"
              value={editData.meals_per_day}
              onChange={(e) => {
                const minMeals = getMinimumMeals(
                  editData.daily_calorie_target
                );
                setEditData({
                  ...editData,
                  meals_per_day: Math.max(
                    Number(e.target.value),
                    minMeals
                  )
                });
              }}
            />

            <p className="text-xs text-gray-500">
              Based on your calorie target, at least{" "}
              <strong>
                {getMinimumMeals(editData.daily_calorie_target)}
              </strong>{" "}
              meals per day are recommended.
            </p>

            {/* Diet */}
            <div>
              <p className="font-medium mb-1">Diet preference</p>
              <div className="flex flex-wrap gap-2">
                {DIET_OPTIONS.map((d) => (
                  <button
                    key={d.value}
                    onClick={() =>
                      toggleArrayValue("dietary_preferences", d.value)
                    }
                    className={`px-3 py-1 rounded-full border ${
                      editData.dietary_preferences.includes(d.value)
                        ? "bg-[#0A7CFF] text-white"
                        : "bg-white"
                    }`}
                  >
                    {d.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Allergies */}
            <div>
              <p className="font-medium mb-1">Food allergies (comma-separated)</p>
              <input
                className="input w-full"
                type="text"
                placeholder="e.g. peanuts, shellfish"
                value={editData.food_allergies}
                onChange={(e) =>
                  setEditData({ ...editData, food_allergies: e.target.value })
                }
              />
            </div>

            <button
              onClick={saveProfile}
              disabled={saving}
              className="bg-[#0A7CFF] text-white rounded-full px-4 py-2"
            >
              {saving ? "Saving..." : "Save Nutrition Setup"}
            </button>
          </motion.div>
        ) : (
          <div className="text-sm space-y-2">
            <p><strong>Daily calories:</strong> {profile.daily_calorie_target} kcal</p>
            <p><strong>Meals per day:</strong> {profile.meals_per_day} meals</p>
            <p><strong>Diet:</strong> {profile.dietary_preferences.join(", ") || "None"}</p>
            <p><strong>Allergies:</strong> {profile.food_allergies?.join(", ") || "None"}</p>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default NutritionProfileCard;
