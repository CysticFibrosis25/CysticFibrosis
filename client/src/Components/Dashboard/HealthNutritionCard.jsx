import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import EditIcon from "@mui/icons-material/Edit";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import toast from "react-hot-toast";

const calculateAge = (dob) => {
  if (!dob) return "—";

  const birthDate = new Date(dob);
  const today = new Date();

  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();

  if (
    monthDiff < 0 ||
    (monthDiff === 0 && today.getDate() < birthDate.getDate())
  ) {
    age--;
  }

  return age;
};


const HealthNutritionCard = () => {
  const API_BASE_URL = import.meta.env.VITE_REACT_APP_BACKEND_URL;

  const [profile, setProfile] = useState(null);
  const [editData, setEditData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [expanded, setExpanded] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    const fetchHealthData = async () => {
      try {
        const email = localStorage.getItem("email");
        if (!email) return;

        const res = await axios.get(
          `${API_BASE_URL}/api/health?email=${email}`
        );

        setProfile({
  ...res.data,
  dob: res.data.dob ? res.data.dob : "",
});
      } catch (err) {
        console.error("Failed to fetch health profile:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchHealthData();
  }, [API_BASE_URL]);

  const openEditModal = () => {
    if (!profile) return;
    setEditData({
    ...profile,
    dob: profile.dob ? new Date(profile.dob).toISOString().split("T")[0] : "",
  });
    setModalOpen(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditData({ ...editData, [name]: value });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      await axios.put(`${API_BASE_URL}/api/health`, {
        email: profile.email,
        height: editData.height,
        weight: editData.weight,
        sex: editData.sex,
        dob: editData.dob,
        allergies: editData.allergies,
      });

      setProfile(editData);
      toast.success("Health & nutrition info updated");
      setModalOpen(false);
    } catch (err) {
      toast.error("Failed to update health info");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="w-full flex justify-center items-center py-16">
        <div className="flex space-x-2">
          <div className="w-2 h-2 bg-[#0A7CFF] rounded-full animate-bounce"></div>
          <div className="w-2 h-2 bg-[#0A7CFF] rounded-full animate-bounce delay-100"></div>
          <div className="w-2 h-2 bg-[#0A7CFF] rounded-full animate-bounce delay-200"></div>
        </div>
      </div>
    );
  }

  return (
    <>
      <motion.div
        className="w-[95%] md:w-[70%] mx-auto mt-6 bg-white/80 rounded-4xl border border-[#BDC0C2] font-dm-sans tracking-tight"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b">
          <h2 className="text-xl font-bold text-[#0A7CFF]">
            Health Data
          </h2>

          <div className="flex gap-2">
            <button
              onClick={openEditModal}
              className="bg-[#0A7CFF] text-white rounded-full px-3 py-1"
            >
              <EditIcon fontSize="small" />
            </button>

            <button
              onClick={() => setExpanded(!expanded)}
              className="bg-[#0A7CFF] text-white rounded-full px-2"
            >
              {expanded ? <ArrowUpwardIcon /> : <ArrowDownwardIcon />}
            </button>
          </div>
        </div>

        {/* Content */}
        {expanded && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-6 text-sm">
            <p>
              <strong>Sex:</strong> {profile?.sex || "—"}
            </p>
            <p>
              <strong>Date of Birth:</strong> {profile.dob || "—"}
            </p>
            <p>
                <strong>Age:</strong> {calculateAge(profile.dob)} years
            </p>

            <p>
              <strong>Height:</strong> {profile.height|| "-"} cm
            </p>
            <p>
              <strong>Weight:</strong> {profile.weight|| "-"} kg
            </p>
            
            <p className="md:col-span-2">
              <strong>Allergies:</strong>{" "}
              {profile.allergies || "None reported"}
            </p>
            
          </div>
        )}
      </motion.div>

      {/* Edit Modal */}
      <AnimatePresence>
        {modalOpen && (
          <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
            <motion.div
              className="bg-white rounded-xl p-6 w-[90%] max-w-lg"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
            >
              <h2 className="text-lg font-semibold text-[#0A7CFF] mb-4 text-center">
                Edit Health & Nutrition
              </h2>

              <form onSubmit={handleSave} className="space-y-3">
                <select
                  name="sex"
                  value={editData.sex}
                  onChange={handleChange}
                  className="input"
                >
                  <option value="">Select Sex</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>

                <input
                  type="date"
                  name="dob"
                  value={editData.dob || ""}
                  onChange={handleChange}
                  className="input"
                />

                <div className="flex gap-2">
                  <input
                    name="height"
                    placeholder="Height (cm)"
                    value={editData.height || ""}
                    onChange={handleChange}
                    className="input w-1/2"
                  />
                  <input
                    name="weight"
                    placeholder="Weight (kg)"
                    value={editData.weight || ""}
                    onChange={handleChange}
                    className="input w-1/2"
                  />
                </div>

                <input
                  name="allergies"
                  placeholder="Allergies"
                  value={editData.allergies || ""}
                  onChange={handleChange}
                  className="input"
                />


                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setModalOpen(false)}
                    className="bg-gray-300 px-4 py-1 rounded"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="bg-[#0A7CFF] text-white px-4 py-1 rounded"
                  >
                    {saving ? "Saving..." : "Save"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default HealthNutritionCard;
