import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "../Components/Navbar";
import { toast } from "react-hot-toast";

const MoreInfo = () => {
  const API_BASE_URL = import.meta.env.VITE_REACT_APP_BACKEND_URL;
  const navigate = useNavigate();
  const email = localStorage.getItem("email");

  const [formData, setFormData] = useState({
    dob: "",
    sex: "",
    height: "",
    weight: "",
    allergies: "",
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.dob ||
      !formData.sex ||
      !formData.height ||
      !formData.weight
    ) {
      toast.error("Please fill all required fields");
      return;
    }

    try {
      await axios.post(`${API_BASE_URL}/api/health`, {
        email,
        dob: formData.dob,
        sex: formData.sex,
        height: formData.height,
        weight: formData.weight,
        allergies: formData.allergies,
      });

      toast.success("Health profile saved");
      navigate("/signup/cf"); // STEP-3
    } catch (err) {
      console.error(err);
      toast.error("Failed to save health profile");
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
              Health Information
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="date"
                name="dob"
                value={formData.dob}
                onChange={handleChange}
                className="input w-full"
                required
              />

              <select
                name="sex"
                value={formData.sex}
                onChange={handleChange}
                className="input w-full"
                required
              >
                <option value="">Select Sex</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>

              <input
                type="number"
                name="height"
                placeholder="Height (cm)"
                value={formData.height}
                onChange={handleChange}
                className="input w-full"
                required
              />

              <input
                type="number"
                name="weight"
                placeholder="Weight (kg)"
                value={formData.weight}
                onChange={handleChange}
                className="input w-full"
                required
              />

              <input
                type="text"
                name="allergies"
                placeholder="Allergies (if any)"
                value={formData.allergies}
                onChange={handleChange}
                className="input w-full"
              />

              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 rounded-md font-semibold"
              >
                Continue
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MoreInfo;
