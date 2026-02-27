import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { motion } from "framer-motion";

const MEAL_COLORS = {
  breakfast: "bg-[#E8F2FF]",
  lunch: "bg-[#EAF7F0]",
  dinner: "bg-[#FFF1E8]",
  snack: "bg-[#FFF9DB]"
};

const MealLoggerSection = ({ onMealComplete }) => {
  const API = import.meta.env.VITE_REACT_APP_BACKEND_URL;
  const email = localStorage.getItem("email");

  const [dayData, setDayData] = useState(null);
  const [nutritionProfile, setNutritionProfile] = useState(null);
  const [drafts, setDrafts] = useState({});
  const [lockedMeals, setLockedMeals] = useState({});
  const [lockedAt, setLockedAt] = useState({});
  const [loadingMeal, setLoadingMeal] = useState(null);

  const isLocked = mealKey => lockedMeals[mealKey];

  /* -----------------------------
     FETCH DAY + PROFILE
  ----------------------------- */
  useEffect(() => {
    const fetchAll = async () => {
      const [dayRes, nutritionRes] = await Promise.all([
        axios.get(`${API}/api/food/day?email=${email}`),
        axios.get(`${API}/api/nutrition?email=${email}`)
      ]);
      setDayData(dayRes.data);
      setNutritionProfile(nutritionRes.data);
    };
    fetchAll();
  }, [API, email]);

  useEffect(() => {
  if (!dayData?.meals) return;

  const hydratedDrafts = {};
  const hydratedLocks = {};
  const hydratedTimes = {};

  const hydrateMeal = (key, meal) => {
    if (!meal?.items?.length) return;

    hydratedDrafts[key] = {
      items: meal.items.map(i => ({
        text: i.text,
        calories: i.calories,
        fat: i.fat,
        protein: i.protein || 0
      })),
      analyzed: true
    };

    hydratedLocks[key] = true;
    hydratedTimes[key] = new Date(meal.items[0].timestamp).toLocaleTimeString(
      [],
      { hour: "2-digit", minute: "2-digit" }
    );
  };

  hydrateMeal("breakfast", dayData.meals.breakfast);
  hydrateMeal("lunch", dayData.meals.lunch);
  hydrateMeal("dinner", dayData.meals.dinner);

  dayData.meals.snacks?.forEach(snack => {
    hydrateMeal(`snack_${snack.snack_id}`, snack);
  });

  setDrafts(hydratedDrafts);
  setLockedMeals(hydratedLocks);
  setLockedAt(hydratedTimes);
}, [dayData]);


  if (!dayData || !nutritionProfile) return null;

  /* -----------------------------
     MEALS LIST
  ----------------------------- */
  const mealsPerDay = nutritionProfile.meals_per_day || 3;

  const mealList = [
    { key: "breakfast", label: "Breakfast", type: "meal" },
    { key: "lunch", label: "Lunch", type: "meal" },
    { key: "dinner", label: "Dinner", type: "meal" }
  ];

  const snackCount = Math.max(mealsPerDay - 3, 0);
  for (let i = 1; i <= snackCount; i++) {
    mealList.push({
      key: `snack_${i}`,
      label: `Snack ${i}`,
      type: "snack",
      snack_id: i
    });
  }

  /* -----------------------------
     DRAFT INIT
  ----------------------------- */
  const initDraft = mealKey => {
    setDrafts(prev => ({
      ...prev,
      [mealKey]: {
        inputText: "",
        items: [],
        analyzed: false
      }
    }));
  };

  /* -----------------------------
     ADD / REMOVE ITEM
  ----------------------------- */
  const addItem = mealKey => {
    const text = drafts[mealKey]?.inputText?.trim();
    if (!text) return toast.error("Enter a food item");

    setDrafts(prev => ({
      ...prev,
      [mealKey]: {
        ...prev[mealKey],
        inputText: "",
        items: [...prev[mealKey].items, { text }]
      }
    }));
  };

  const deleteItem = (mealKey, index) => {
    if (isLocked(mealKey)) return;
    setDrafts(prev => ({
      ...prev,
      [mealKey]: {
        ...prev[mealKey],
        items: prev[mealKey].items.filter((_, i) => i !== index)
      }
    }));
  };

  /* -----------------------------
     ANALYZE MEAL
  ----------------------------- */
  const analyzeMeal = async mealKey => {
    const items = drafts[mealKey]?.items;
    if (!items || items.length === 0)
      return toast.error("Add items first");

    toast.loading("Analyzing nutrition…", { id: "analyze" });

    try {
      const res = await axios.post(`${API}/api/nutrition/lookup`, { items });

      setDrafts(prev => ({
        ...prev,
        [mealKey]: {
          ...prev[mealKey],
          analyzed: true,
          items: res.data.items.map(i => ({ ...i }))
        }
      }));

      toast.success("Nutrition analyzed", { id: "analyze" });
    } catch {
      toast.error("Analysis failed", { id: "analyze" });
    }
  };

  /* -----------------------------
     EDIT ITEM
  ----------------------------- */
  const updateItem = (mealKey, index, field, value) => {
    if (isLocked(mealKey)) return;
    setDrafts(prev => {
      const items = [...prev[mealKey].items];
      items[index][field] = Number(value);
      return {
        ...prev,
        [mealKey]: { ...prev[mealKey], items }
      };
    });
  };

  /* -----------------------------
     TOTALS
  ----------------------------- */
  const totals = mealKey => {
    const items = drafts[mealKey]?.items || [];
    return {
      calories: items.reduce((s, i) => s + (i.calories || 0), 0),
      fat: items.reduce((s, i) => s + (i.fat || 0), 0),
      protein: items.reduce((s, i) => s + (i.protein || 0), 0)
    };
  };

  /* -----------------------------
     SAVE MEAL
  ----------------------------- */
  const confirmAndSave = async meal => {
    const mealKey = meal.key;
    const items = drafts[mealKey]?.items || [];
    if (!items.length) return;

    setLoadingMeal(mealKey);

    try {
      for (const item of items) {
        await axios.post(`${API}/api/food/add-item`, {
          email,
          meal_type: meal.type === "meal" ? meal.key : "snack",
          snack_id: meal.snack_id,
          text: item.text,
          calories: item.calories,
          fat: item.fat,
          protein: item.protein
        });
      }

      setLockedMeals(prev => ({ ...prev, [mealKey]: true }));
      setLockedAt(prev => ({
        ...prev,
        [mealKey]: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit"
        })
      }));

      toast.success(`${meal.label} saved`);
    } catch {
      toast.error("Failed to save meal");
    } finally {
      setLoadingMeal(null);
    }
  };

  /* -----------------------------
     RENDER
  ----------------------------- */
  return (
    <motion.div className="w-[95%] md:w-[70%] mx-auto bg-white/80 border rounded-4xl p-6">
      <h2 className="text-xl font-bold text-[#0A7CFF] mb-3">
        Log Today’s Meals
      </h2>

      <p className="text-xs text-gray-600 mb-6">
        Break meals into components for better accuracy.
        <br />
        <strong>Example:</strong> 2 idli + 1 medu vada + 1 cup sambar
        <br />
        Avoid brand names (use “50g potato chips” instead of Lay’s).
        <br />
        <strong>Add all items → Analyze → Edit → Confirm & Save</strong>
      </p>

      {mealList.map(meal => {
        const draft = drafts[meal.key];
        const total = totals(meal.key);

        return (
          <div
            key={meal.key}
            className={`mb-6 rounded-3xl p-4 ${
              MEAL_COLORS[meal.type === "meal" ? meal.key : "snack"]
            }`}
          >
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-semibold">{meal.label}</h3>

              {isLocked(meal.key) && (
                <span className="text-xs bg-gray-200 px-3 py-1 rounded-full">
                  🔒 Locked · Saved at {lockedAt[meal.key]}
                </span>
              )}
            </div>

            {!draft && !isLocked(meal.key) && (
              <button
                onClick={() => initDraft(meal.key)}
                className="bg-white rounded-full px-4 py-1"
              >
                + Add items
              </button>
            )}

            {draft && (
              <>
                {!isLocked(meal.key) && (
                  <>
                    <input
                      className="input w-full mb-2"
                      placeholder="Enter food item"
                      value={draft.inputText}
                      onChange={e =>
                        setDrafts(prev => ({
                          ...prev,
                          [meal.key]: {
                            ...prev[meal.key],
                            inputText: e.target.value
                          }
                        }))
                      }
                    />

                    <button
                      onClick={() => addItem(meal.key)}
                      className="bg-[#0A7CFF] text-white rounded-full px-4 py-1 mb-3"
                    >
                      Add item
                    </button>
                  </>
                )}

                {draft.items.map((item, i) => (
                  <div key={i} className="bg-white rounded-xl p-3 mb-3">
                    <div className="flex justify-between mb-2">
                      <strong>{item.text}</strong>
                      <button
                        onClick={() => deleteItem(meal.key, i)}
                        disabled={isLocked(meal.key)}
                        className={`font-bold ${
                          isLocked(meal.key)
                            ? "text-gray-300 cursor-not-allowed"
                            : "text-red-500"
                        }`}
                      >
                        ×
                      </button>
                    </div>

                    {draft.analyzed && (
                      <div className="flex gap-2 text-sm">
                        {["calories", "fat", "protein"].map(field => (
                          <div key={field} className="w-1/3">
                            <label className="capitalize">{field}</label>
                            <input
                              type="number"
                              className={`input w-full ${
                                isLocked(meal.key)
                                  ? "bg-gray-100 cursor-not-allowed"
                                  : ""
                              }`}
                              readOnly={isLocked(meal.key)}
                              value={item[field]}
                              onChange={e =>
                                updateItem(
                                  meal.key,
                                  i,
                                  field,
                                  e.target.value
                                )
                              }
                            />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}

                {draft.analyzed && (
                  <div className="text-sm font-medium mt-2">
                    Total: {total.calories} kcal · {total.fat} g fat ·{" "}
                    {total.protein} g protein
                  </div>
                )}

                {!draft.analyzed && !isLocked(meal.key) && (
                  <button
                    onClick={() => analyzeMeal(meal.key)}
                    className="bg-green-600 text-white rounded-full px-4 py-1 mt-3"
                  >
                    Analyze Nutrition
                  </button>
                )}

                {draft.analyzed && !isLocked(meal.key) && (
                  <button
                    onClick={() => confirmAndSave(meal)}
                    className="bg-[#0A7CFF] text-white rounded-full px-4 py-1 mt-3"
                    disabled={loadingMeal === meal.key}
                  >
                    Confirm & Save
                  </button>
                )}
              </>
            )}

            {isLocked(meal.key) && (
              <button
                className="mt-3 bg-white rounded-full px-4 py-1"
                onClick={() =>
                  onMealComplete?.({
                    groupType: meal.key,
                    mealFat: total.fat
                  })
                }
              >
                Estimate enzymes
              </button>
            )}
          </div>
        );
      })}
    </motion.div>
  );
};

export default MealLoggerSection;





