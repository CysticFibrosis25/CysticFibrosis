import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../Components/Navbar";
import axios from "axios";
import { toast } from "react-hot-toast";

const LoginSignup = () => {
  const API_BASE_URL = import.meta.env.VITE_REACT_APP_BACKEND_URL;
  const navigate = useNavigate();

  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    password: "",
    confirmPassword: "",
    emergency_name: "",
    emergency_relation: "",
    emergency_phone: "",
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isLogin) {
      if (!formData.email || !formData.password) {
        toast.error("Please enter email and password");
        return;
      }

      try {
        setLoading(true);

        await axios.post(`${API_BASE_URL}/auth/login`, {
          email: formData.email.trim(),
          password: formData.password,
        });

        localStorage.setItem("email", formData.email.trim());
        localStorage.setItem("isLoggedIn", "true");

        toast.success("Login successful!");
        navigate("/dashboard");
      } catch (err) {
        toast.error(err.response?.data?.message || "Login failed");
      } finally {
        setLoading(false);
      }
    } else {
      const {
        name,
        phone,
        email,
        password,
        confirmPassword,
        emergency_name,
        emergency_relation,
        emergency_phone,
      } = formData;

      if (
        !name ||
        !phone ||
        !email ||
        !password ||
        !confirmPassword ||
        !emergency_name ||
        !emergency_relation ||
        !emergency_phone
      ) {
        toast.error("Please fill all fields");
        return;
      }

      if (password !== confirmPassword) {
        toast.error("Passwords do not match");
        return;
      }

      try {
        setLoading(true);

        await axios.post(`${API_BASE_URL}/auth/signup`, {
          name: name.trim(),
          phone: phone.trim(),
          email: email.trim(),
          password,
          emergency_contact: {
            name: emergency_name.trim(),
            relation: emergency_relation.trim(),
            phone: emergency_phone.trim(),
          },
        });

        localStorage.setItem("email", email.trim());
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("onboardingStep", "health"); // ✅ IMPORTANT

        toast.success("Signup successful!");
        navigate("/moreinfo"); // Step-2
      } catch (err) {
        toast.error(err.response?.data?.message || "Signup failed");
      } finally {
        setLoading(false);
      }
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
          <div className="bg-white/80 backdrop-blur-md rounded-lg p-8 max-w-md w-full">
            <h2 className="text-3xl font-bold mb-6 text-center">
              {isLogin ? "Login" : "Signup"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <>
                  <input
                    type="text"
                    name="name"
                    placeholder="Name"
                    value={formData.name}
                    onChange={handleChange}
                    className="input"
                  />
                   <br /> 
                  <input
                    type="tel"
                    name="phone"
                    placeholder="Contact Number"
                    value={formData.phone}
                    onChange={handleChange}
                    className="input"
                  />
                  <br />
                  <input
                    type="text"
                    name="emergency_name"
                    placeholder="Emergency Contact Name"
                    value={formData.emergency_name}
                    onChange={handleChange}
                    className="input"
                  />
                  <br/>
                  <input
                    type="text"
                    name="emergency_relation"
                    placeholder="Relation"
                    value={formData.emergency_relation}
                    onChange={handleChange}
                    className="input"
                  />
                  <br/>
                  <input
                    type="tel"
                    name="emergency_phone"
                    placeholder="Emergency Contact Phone"
                    value={formData.emergency_phone}
                    onChange={handleChange}
                    className="input"
                  />
                </>
              )}
              <br/>
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                className="input"
              />
              <br/>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                  className="input"
                />
                <br/>
                <button
                  type="button"
                  onClick={() => setShowPassword((p) => !p)}
                  className="absolute right-3 top-2 text-sm text-gray-500"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>

              {!isLogin && (
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    placeholder="Confirm Password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="input"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword((p) => !p)}
                    className="absolute right-3 top-2 text-sm text-gray-500"
                  >
                    {showConfirmPassword ? "Hide" : "Show"}
                  </button>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white py-2 rounded-md font-semibold"
              >
                {loading ? "Please wait..." : isLogin ? "Login" : "Signup"}
              </button>
            </form>

            <p className="mt-4 text-center text-gray-700">
              {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
              <button
                onClick={() => setIsLogin((p) => !p)}
                className="text-blue-600 font-semibold"
              >
                {isLogin ? "Signup" : "Login"}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginSignup;
