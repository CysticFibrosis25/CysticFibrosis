import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "../Components/Navbar";
import { toast } from "react-hot-toast";

const CFSignup = () => {
  const API_BASE_URL = import.meta.env.VITE_REACT_APP_BACKEND_URL;
  const navigate = useNavigate();
  const email = localStorage.getItem("email");

  const [formData, setFormData] = useState({
    cf_type: "",
    lung_transplant: "",
    symptoms: [],
    medications: "",
    other_conditions: "",
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
    "Recurrent lung infections",
    "Fatigue",
    "Poor weight gain",
  ];

  const handleChange = (e) => {
    const { name, value, checked, type } = e.target;

    if (type === "checkbox") {
      setFormData((prev) => ({
        ...prev,
        symptoms: checked
          ? [...prev.symptoms, value]
          : prev.symptoms.filter((s) => s !== value),
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.cf_type || !formData.lung_transplant) {
      toast.error("Please complete required fields");
      return;
    }

    try {
      await axios.post(`${API_BASE_URL}/api/cf`, {
        email,
        cf_type: formData.cf_type,
        lung_transplant: formData.lung_transplant,
        symptoms: formData.symptoms,
        medications: formData.medications,
        other_conditions: formData.other_conditions,
      });

      toast.success("CF profile saved");
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      toast.error("Failed to save CF profile");
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
              CF-Specific Information
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <select
                name="cf_type"
                value={formData.cf_type}
                onChange={handleChange}
                className="input w-full"
                required
              >
                <option value="">Select CF Type</option>
                {cfTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>

              <select
                name="lung_transplant"
                value={formData.lung_transplant}
                onChange={handleChange}
                className="input w-full"
                required
              >
                <option value="">Lung Transplant?</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>

              <fieldset className="border border-gray-300 p-3 rounded-md">
                <legend className="text-sm font-medium text-gray-700 mb-2">
                  Symptoms
                </legend>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {allSymptoms.map((sym) => (
                    <label key={sym} className="text-sm flex gap-2 items-center">
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

              <input
                type="text"
                name="medications"
                placeholder="Current Medications"
                value={formData.medications}
                onChange={handleChange}
                className="input w-full"
              />

              <input
                type="text"
                name="other_conditions"
                placeholder="Other Conditions"
                value={formData.other_conditions}
                onChange={handleChange}
                className="input w-full"
              />

              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 rounded-md font-semibold"
              >
                Finish Signup
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CFSignup;
