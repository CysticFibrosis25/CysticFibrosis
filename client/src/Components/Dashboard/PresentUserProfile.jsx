import React, { useState, useEffect } from "react";
import axios from "axios";
import { AnimatePresence, motion } from "framer-motion";
import EditIcon from "@mui/icons-material/Edit";
import ArrowUpIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownIcon from "@mui/icons-material/ArrowDownward";

const PresentUserDetails = () => {
  const API_BASE_URL = import.meta.env.VITE_REACT_APP_BACKEND_URL;
  const [profile, setProfile] = useState(null);
  const [editData, setEditData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(true);

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
    const fetchInfo = async () => {
      const email = localStorage.getItem("email");
      if (!email) return;
      try {
        const res = await axios.get(
          `${API_BASE_URL}/auth/user/details?email=${email}`
        );
        setProfile(res.data);
      } catch (err) {
        console.error("Failed to fetch profile:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchInfo();
  }, [API_BASE_URL]);

  const calculateAge = (dob) => {
    if (!dob) return "";
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) age--;
    return age;
  };

  const openEditModal = () => {
    setEditData(profile);
    setModalOpen(true);
  };

  const handleEditChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (type === "checkbox") {
      const updatedSymptoms = checked
        ? [...editData.symptoms, value]
        : editData.symptoms.filter((sym) => sym !== value);
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

  const handleSave = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const email = localStorage.getItem("email");
      await axios.put(`${API_BASE_URL}/auth/user/update`, {
        ...editData,
        email,
      });
      setProfile(editData);
      setModalOpen(false);
    } catch (err) {
      console.error("Failed to save profile:", err);
      alert("Update failed.");
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="w-full flex justify-center items-center py-16">
        <div className="flex space-x-2">
          <div className="w-2 h-2 bg-[#0A7CFF] rounded-full animate-bounce [animation-delay:-0.3s]"></div>
          <div className="w-2 h-2 bg-[#0A7CFF] rounded-full animate-bounce [animation-delay:-0.15s]"></div>
          <div className="w-2 h-2 bg-[#0A7CFF] rounded-full animate-bounce"></div>
        </div>
      </div>
    );
  }

  if (!profile || !profile.cf_type) {
    return (
      <div className="text-center text-gray-500 mt-10">
        No extended profile info found.
      </div>
    );
  }

  return (
    <>
      <motion.div
        className="w-[95%] md:w-[70%] mx-auto mt-4 bg-white/80 rounded-4xl border border-[#BDC0C2]  font-dm-sans tracking-tight "
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <div className="flex justify-between  border-[#ececec] items-center px-6 py-3  ">
          <h2 className="text-xl font-bold text-left  text-[#0A7CFF]">
            User Profile
          </h2>
          <div className="flex items-center space-x-2">
            <button
              onClick={openEditModal}
              className=" text-white bg-[#0A7CFF] w-[100px] cursor-pointer p-1 rounded-full shadow hover:bg-[#005DE0]"
            >
              <EditIcon style={{ fontSize: 18 }} />
            </button>
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="text-white bg-[#0A7CFF] cursor-pointer  p-1 rounded-full "
            >
              <div>{dropdownOpen ? <ArrowUpIcon /> : <ArrowDownIcon />}</div>
            </button>
          </div>
        </div>

        {dropdownOpen && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-6 border border-t-2 border-[#ececec] text-sm">
            <p>
              <strong>CF Type:</strong> {profile.cf_type}
            </p>
            <p>
              <strong>DOB:</strong> {profile.dob}
            </p>
            <p>
              <strong>Calculated Age:</strong> {calculateAge(profile.dob)} years
            </p>
            <p>
              <strong>Lung Transplant:</strong> {profile.lung_transplant}
            </p>
            <p>
              <strong>Symptoms:</strong> {profile.symptoms?.join(", ")}
            </p>
            <p>
              <strong>Other Conditions:</strong> {profile.other_conditions}
            </p>
            <p>
              <strong>Medications:</strong> {profile.medications}
            </p>
            <p>
              <strong>Allergies:</strong> {profile.allergies}
            </p>
            <p className="col-span-2">
              <strong>Emergency Contact:</strong>{" "}
              {profile.emergency_contact?.name} (
              {profile.emergency_contact?.relation}) –{" "}
              {profile.emergency_contact?.phone}
            </p>
          </div>
        )}
      </motion.div>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
          <div className="bg-white rounded-xl p-6 w-[90%] max-w-lg backdrop-blur-2xl">
            <h2 className="text-lg font-semibold text-[#0A7CFF] mb-4 text-center">
              Edit Extended Profile
            </h2>
            <form className="space-y-3" onSubmit={handleSave}>
              <select
                name="cf_type"
                value={editData.cf_type}
                onChange={handleEditChange}
                className="input"
                required
              >
                <option value="">Select CF Type</option>
                {cfTypes.map((type) => (
                  <option key={type}>{type}</option>
                ))}
              </select>

              <input
                type="date"
                name="dob"
                value={editData.dob}
                onChange={handleEditChange}
                className="input"
                required
              />

              <select
                name="lung_transplant"
                value={editData.lung_transplant}
                onChange={handleEditChange}
                className="input"
                required
              >
                <option value="">Lung Transplant?</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>

              <fieldset className="border border-gray-300 p-2 rounded">
                <legend className="text-sm font-medium text-gray-700 mb-1">
                  Symptoms
                </legend>
                <div className="grid grid-cols-2 gap-2">
                  {allSymptoms.map((sym) => (
                    <label
                      key={sym}
                      className="flex items-center gap-2 text-sm"
                    >
                      <input
                        type="checkbox"
                        value={sym}
                        checked={editData.symptoms?.includes(sym)}
                        onChange={handleEditChange}
                      />
                      {sym}
                    </label>
                  ))}
                </div>
              </fieldset>

              <input
                type="text"
                name="other_conditions"
                placeholder="Other Conditions"
                value={editData.other_conditions}
                onChange={handleEditChange}
                className="input"
              />
              <input
                type="text"
                name="medications"
                placeholder="Medications"
                value={editData.medications}
                onChange={handleEditChange}
                className="input"
              />
              <input
                type="text"
                name="allergies"
                placeholder="Allergies"
                value={editData.allergies}
                onChange={handleEditChange}
                className="input"
              />

              {/* Emergency Contact */}
              <input
                type="text"
                name="emergency_contact.name"
                placeholder="Emergency Contact Name"
                value={editData.emergency_contact?.name || ""}
                onChange={handleEditChange}
                className="input"
              />
              <input
                type="text"
                name="emergency_contact.relation"
                placeholder="Relation"
                value={editData.emergency_contact?.relation || ""}
                onChange={handleEditChange}
                className="input"
              />
              <input
                type="tel"
                name="emergency_contact.phone"
                placeholder="Phone"
                value={editData.emergency_contact?.phone || ""}
                onChange={handleEditChange}
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
                  disabled={isSaving}
                  className="bg-[#0A7CFF] text-white px-4 py-1 rounded hover:bg-[#005DE0]"
                >
                  {isSaving ? "Saving..." : "Save"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default PresentUserDetails;
