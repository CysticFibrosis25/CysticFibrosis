import React, { useState, useEffect } from "react";
import axios from "axios";
import { AnimatePresence, motion } from "framer-motion";
import EditIcon from "@mui/icons-material/Edit";
import ArrowUpIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownIcon from "@mui/icons-material/ArrowDownward";
import toast from "react-hot-toast";

const PresentUserProfile = () => {
  const API_BASE_URL = import.meta.env.VITE_REACT_APP_BACKEND_URL;

  const [profile, setProfile] = useState(null);
  const [editData, setEditData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [expanded, setExpanded] = useState(true);

  const cfTypes = [
    "Class I - No protein production",
    "Class II - Misfolded protein",
    "Class III - Channel gating defect",
    "Class IV - Conductance defect",
    "Class V - Reduced protein production",
    "Unknown",
  ];

  const allSymptoms = [
    "Wheezing",
    "Chronic cough",
    "Shortness of breath",
    "Weight loss",
    "Fatigue",
    "Recurrent lung infections",
  ];

  useEffect(() => {
    const fetchCFProfile = async () => {
      try {
        const email = localStorage.getItem("email");
        if (!email) return;

        const res = await axios.get(
          `${API_BASE_URL}/api/cf?email=${email}`
        );

        setProfile(res.data);
      } catch (err) {
        console.error("Failed to fetch CF profile:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCFProfile();
  }, [API_BASE_URL]);

  const openEditModal = () => {
    setEditData(profile);
    setModalOpen(true);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (type === "checkbox") {
      const updatedSymptoms = checked
        ? [...(editData.symptoms || []), value]
        : editData.symptoms.filter((s) => s !== value);

      setEditData({ ...editData, symptoms: updatedSymptoms });
    } else if (name.startsWith("emergency_contact.")) {
      const field = name.split(".")[1];
      setEditData({
        ...editData,
        emergency_contact: {
          ...editData.emergency_contact,
          [field]: value,
        },
      });
    } else {
      setEditData({ ...editData, [name]: value });
    }
  };

  const saveCFProfile = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      await axios.put(`${API_BASE_URL}/api/cf`, {
        email: localStorage.getItem("email"),
        cf_type: editData.cf_type,
        lung_transplant: editData.lung_transplant,
        symptoms: editData.symptoms,
        other_conditions: editData.other_conditions,
        medications: editData.medications,
      });

      setProfile(editData);
      toast.success("CF profile updated successfully");
      setModalOpen(false);
    } catch (err) {
      toast.error("Failed to update CF profile");
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

  if (!profile?.cf_type) {
    return (
      <div className="text-center text-gray-500 mt-10">
        CF profile not completed yet.
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
            Cystic Fibrosis Profile
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
              {expanded ? <ArrowUpIcon /> : <ArrowDownIcon />}
            </button>
          </div>
        </div>

        {/* Content */}
        {expanded && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-6 text-sm">
            <p>
              <strong>CF Type:</strong> {profile.cf_type}
            </p>
            <br/>
            <p>
              <strong>Lung Transplant:</strong> {profile.lung_transplant}
            </p>
            <p className="md:col-span-2">
              <strong>Symptoms:</strong>{" "}
              {profile.symptoms?.length
                ? profile.symptoms.join(", ")
                : "None selected"}
            </p>
            <p className="md:col-span-2">
              <strong>Other Conditions:</strong>{" "}
              {profile.other_conditions || "None reported"}
            </p>
            <p className="md:col-span-2">
              <strong>Medications:</strong>{" "}
              {profile.medications || "None reported"}
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
                Edit CF Profile
              </h2>

              <form onSubmit={saveCFProfile} className="space-y-3">
                <select
                  name="cf_type"
                  value={editData.cf_type}
                  onChange={handleChange}
                  className="input"
                  required
                >
                  <option value="">Select CF Type</option>
                  {cfTypes.map((t) => (
                    <option key={t}>{t}</option>
                  ))}
                </select>

                <select
                  name="lung_transplant"
                  value={editData.lung_transplant}
                  onChange={handleChange}
                  className="input"
                  required
                >
                  <option value="">Lung Transplant?</option>
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>

                <fieldset className="border p-2 rounded">
                  <legend className="text-sm font-medium">Symptoms</legend>
                  <div className="grid grid-cols-2 gap-2">
                    {allSymptoms.map((s) => (
                      <label key={s} className="flex gap-2 text-sm">
                        <input
                          type="checkbox"
                          value={s}
                          checked={editData.symptoms?.includes(s)}
                          onChange={handleChange}
                        />
                        {s}
                      </label>
                    ))}
                  </div>
                </fieldset>

                <input
                  type="text"
                  name="other_conditions"
                  placeholder="Other Conditions"  
                  value={editData.other_conditions || ""}
                  onChange={handleChange}
                  className="input"
                />
                <input
                  type="text"
                  name="medications"
                  placeholder="Medications"
                  value={editData.medications || ""}
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

export default PresentUserProfile;
