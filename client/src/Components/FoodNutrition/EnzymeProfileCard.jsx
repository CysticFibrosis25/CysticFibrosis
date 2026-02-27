import React, { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { motion } from "framer-motion";

const EnzymeProfileCard = ({ onReady }) => {
  const API = import.meta.env.VITE_REACT_APP_BACKEND_URL;
  const email = localStorage.getItem("email");

  const [profile, setProfile] = useState(null);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(false);

  // Estimation mode
  const [mode, setMode] = useState("fat");

  // Inputs with SAFE DEFAULTS
  const [unitsPerGram, setUnitsPerGram] = useState(2000);
  const [unitsPerKg, setUnitsPerKg] = useState(500);
  const [maxUnits, setMaxUnits] = useState(25000);

  /* -----------------------------
     FETCH EXISTING PROFILE
  ----------------------------- */
  useEffect(() => {
    axios
      .get(`${API}/api/enzyme/profile?email=${email}`)
      .then(res => {
        if (res.data?.mode) {
          setProfile(res.data);
          setMode(res.data.mode);
          setUnitsPerGram(res.data.units_per_gram || 2000);
          setUnitsPerKg(res.data.units_per_kg || 500);
          setMaxUnits(res.data.max_units_per_meal || 25000);
          onReady?.(true);
        }
      })
      .catch(() => {});
  }, [API, email, onReady]);

  /* -----------------------------
     SAVE PROFILE
  ----------------------------- */
  const saveProfile = async () => {
    setSaving(true);
    try {
      await axios.post(`${API}/api/enzyme/profile`, {
        email,
        mode,
        units_per_gram: mode === "fat" ? Number(unitsPerGram) : null,
        units_per_kg: mode === "weight" ? Number(unitsPerKg) : null,
        max_units_per_meal: Number(maxUnits)
      });

      toast.success("Enzyme guidance saved");
      setEditing(false);
      onReady?.(true);

      setProfile({
        mode,
        units_per_gram: unitsPerGram,
        units_per_kg: unitsPerKg,
        max_units_per_meal: maxUnits
      });
    } catch {
      toast.error("Unable to save enzyme guidance. Please check inputs.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <motion.div
      className="w-[95%] md:w-[70%] mx-auto bg-white/80 border border-[#BDC0C2] rounded-4xl p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-xl font-bold text-[#0A7CFF]">
          Enzyme Guidance
        </h2>

        {profile && !editing && (
          <span className="text-xs bg-green-100 text-green-700 px-3 py-1 rounded-full">
            ✔ Saved
          </span>
        )}
      </div>

      {/* EDUCATION BLOCK */}
      <div className="text-sm text-gray-700 space-y-2 mb-6">
        <p>
          Pancreatic enzymes help your body digest fat properly.
        </p>
        <p>
          Most people with cystic fibrosis use the{" "}
          <strong>fat-based method</strong>, which is the standard approach.
        </p>
        <p className="italic text-gray-600">
          These values are for estimation only and do not replace medical advice.
        </p>
      </div>

      {/* MODE SELECTION */}
      <div className="mb-6">
        <p className="font-medium mb-2">
          How should enzymes be estimated?
        </p>

        <label className="flex items-start gap-2 mb-3">
          <input
            type="radio"
            checked={mode === "fat"}
            disabled={!editing}
            onChange={() => setMode("fat")}
          />
          <div>
            <p className="font-medium">Based on fat in food (recommended)</p>
            <p className="text-xs text-gray-600">
              Standard daily method used by most CF patients.
            </p>
          </div>
        </label>

        <label className="flex items-start gap-2">
          <input
            type="radio"
            checked={mode === "weight"}
            disabled={!editing}
            onChange={() => setMode("weight")}
          />
          <div>
            <p className="font-medium">
              Based on body weight (doctor-advised only)
            </p>
            <p className="text-xs text-gray-600">
              Use only if your care team has advised it.
            </p>
          </div>
        </label>
      </div>

      {/* FAT-BASED INPUT */}
      {mode === "fat" && (
        <div className="mb-5">
          <label className="block font-medium mb-1">
            Lipase units per gram of fat
          </label>
          <input
            type="number"
            className="input w-full"
            value={unitsPerGram}
            disabled={!editing}
            onChange={e => setUnitsPerGram(e.target.value)}
          />
        </div>
      )}

      {/* WEIGHT-BASED INPUT */}
      {mode === "weight" && (
        <div className="mb-5">
          <label className="block font-medium mb-1">
            Lipase units per kg body weight
          </label>
          <input
            type="number"
            className="input w-full"
            value={unitsPerKg}
            disabled={!editing}
            onChange={e => setUnitsPerKg(e.target.value)}
          />
        </div>
      )}

      {/* SAFETY CAP */}
      <div className="mb-6">
        <label className="block font-medium mb-1">
          Maximum lipase units per meal
        </label>
        <input
          type="number"
          className="input w-full"
          value={maxUnits}
          disabled={!editing}
          onChange={e => setMaxUnits(e.target.value)}
        />
      </div>

      {/* ACTION BUTTONS */}
      {!editing ? (
        <button
          onClick={() => setEditing(true)}
          className="bg-gray-200 text-gray-800 rounded-full px-5 py-2"
        >
          Edit enzyme guidance
        </button>
      ) : (
        <button
          onClick={saveProfile}
          disabled={saving}
          className="bg-[#0A7CFF] text-white rounded-full px-5 py-2"
        >
          {saving ? "Saving..." : "Save changes"}
        </button>
      )}
    </motion.div>
  );
};

export default EnzymeProfileCard;

