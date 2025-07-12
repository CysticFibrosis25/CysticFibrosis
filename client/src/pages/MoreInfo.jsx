import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "../Components/Navbar";
import { toast } from "react-toastify";

const MoreInfo = () => {
  const API_BASE_URL = import.meta.env.VITE_REACT_APP_BACKEND_URL;
  const navigate = useNavigate();
  const email = localStorage.getItem("email");

  const [formData, setFormData] = useState({
    cf_type: "",
    dob: "",
    lung_transplant: "",
    symptoms: [],
    other_conditions: "",
    medications: "",
    allergies: "",
    emergency_contact_name: "",
    emergency_contact_relation: "",
    emergency_contact_phone: "",
  });

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

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (type === "checkbox") {
      setFormData((prev) => {
        const updatedSymptoms = checked
          ? [...prev.symptoms, value]
          : prev.symptoms.filter((sym) => sym !== value);
        return { ...prev, symptoms: updatedSymptoms };
      });
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      email,
      cf_type: formData.cf_type,
      dob: formData.dob,
      lung_transplant: formData.lung_transplant,
      symptoms: formData.symptoms,
      other_conditions: formData.other_conditions,
      medications: formData.medications,
      allergies: formData.allergies,
      emergency_contact: {
        name: formData.emergency_contact_name,
        relation: formData.emergency_contact_relation,
        phone: formData.emergency_contact_phone,
      },
    };

    try {
      await axios.put(`${API_BASE_URL}/auth/user/update`, payload);
      toast.success("Onboarding Info added successfully! Please login.");
      localStorage.clear();
      navigate("/login");
    } catch (err) {
      toast.error("Failed to update information. Please try again.");
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen relative font-dm-sans tracking-tight">
      <img
        src="/home/heroimage.png"
        alt="Hero"
        className="w-full h-[100vh] object-cover absolute top-0 left-0 z-0"
      />
      <div className="absolute top-0 left-0 w-full z-10">
        <Navbar />
        <div className="flex flex-col items-center justify-center min-h-[60vh] pt-16">
          <div className="bg-white/80 backdrop-blur-md rounded-lg p-8 max-w-md w-full shadow-lg">
            <h2 className="text-2xl font-bold mb-6 text-center text-[#0A7CFF]">
              More Patient Information
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="mb-4">
                <select name="cf_type" value={formData.cf_type} onChange={handleChange} required className="input w-full">
                  <option value="">Select CF Type</option>
                  {cfTypes.map((type) => (
                    <option key={type}>{type}</option>
                  ))}
                </select>
              </div>

              <div className="mb-4">
                <input type="date" name="dob" value={formData.dob} onChange={handleChange} className="input w-full" required />
              </div>

              <div className="mb-4">
                <select name="lung_transplant" value={formData.lung_transplant} onChange={handleChange} className="input w-full" required>
                  <option value="">Lung Transplant?</option>
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>
              </div>

              <fieldset className="border border-gray-300 p-3 rounded-md mb-4">
                <legend className="text-sm font-medium text-gray-700 mb-2">Symptoms</legend>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {allSymptoms.map((sym) => (
                    <label key={sym} className="text-sm flex items-center gap-2">
                      <input
                        type="checkbox"
                        value={sym}
                        checked={formData.symptoms.includes(sym)}
                        onChange={handleChange}
                      />
                      {sym}
                    </label>
                  ))}
                </div>
              </fieldset>

              <div className="mb-4">
                <input type="text" name="other_conditions" placeholder="Other Conditions" value={formData.other_conditions} onChange={handleChange} className="input w-full" />
              </div>

              <div className="mb-4">
                <input type="text" name="medications" placeholder="Current Medications" value={formData.medications} onChange={handleChange} className="input w-full" />
              </div>

              <div className="mb-4">
                <input type="text" name="allergies" placeholder="Allergies" value={formData.allergies} onChange={handleChange} className="input w-full" />
              </div>

              <div className="mb-4">
                <input type="text" name="emergency_contact_name" placeholder="Emergency Contact Name" value={formData.emergency_contact_name} onChange={handleChange} className="input w-full" />
              </div>

              <div className="mb-4">
                <input type="text" name="emergency_contact_relation" placeholder="Relation" value={formData.emergency_contact_relation} onChange={handleChange} className="input w-full" />
              </div>

              <div className="mb-4">
                <input type="tel" name="emergency_contact_phone" placeholder="Phone" value={formData.emergency_contact_phone} onChange={handleChange} className="input w-full" />
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 rounded-md font-semibold"
              >
                Save & Continue
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MoreInfo;
