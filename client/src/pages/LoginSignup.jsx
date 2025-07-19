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
  const [logging, setLogging] = useState(false);
  const [signup, setSignup] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    password: "",
    confirmPassword: "",
    age: "",
    weight: "",
    height: "",
    sex: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isLogin) {
      if (!formData.email || !formData.password) {
        toast.error("Please enter email and password");
        return;
      }

      try {
        setLogging(true);
        const res = await axios.post(`${API_BASE_URL}/auth/login`, {
          email: formData.email,
          password: formData.password,
        });

        if (res.status === 200) {
          localStorage.setItem("email", formData.email);
          localStorage.setItem("isLoggedIn", "true");
          toast.success("Login successful!");
          setLogging(false);
          navigate("/dashboard");
        }
      } catch (err) {
        setLogging(false);
        toast.error(err.response?.data?.message || "Login failed");
        console.error(err);
      }
    } else {
      const {
        name,
        phone,
        email,
        password,
        confirmPassword,
        age,
        weight,
        height,
        sex,
      } = formData;

      if (
        !name ||
        !phone ||
        !email ||
        !password ||
        !confirmPassword ||
        !age ||
        !weight ||
        !height ||
        !sex
      ) {
        alert("Please fill all fields");
        return;
      }

      if (password !== confirmPassword) {
        toast.error("Passwords do not match");
        return;
      }

      try {
        setSignup(true);
        const res = await axios.post(`${API_BASE_URL}/auth/signup`, {
          name,
          phone,
          email,
          password,
          age,
          weight,
          height,
          sex,
        });

        if (res.status === 200 || res.status === 201) {
          localStorage.setItem("email", email);
          localStorage.setItem("isLoggedIn", "true");
          toast.success("Signup successful! Please login.");
          setSignup(false);

          setFormData({
            name: "",
            email: "",
            password: "",
            confirmPassword: "",
            age: "",
            weight: "",
            height: "",
            sex: "",
          });
          navigate("/moreinfo");
        }
      } catch (err) {
        toast.error(err.response?.data?.message || "Signup failed");
        setSignup(false);
        console.error(err);
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
                    required
                  />
                  <input
                    type="number"
                    name="phone"
                    placeholder="Contact No"
                    value={formData.phone}
                    onChange={handleChange}
                    className="input"
                    required
                  />
                  <input
                    type="number"
                    name="age"
                    placeholder="Age"
                    value={formData.age}
                    onChange={handleChange}
                    className="input"
                    required
                  />
                  <input
                    type="number"
                    name="weight"
                    placeholder="Weight (kg)"
                    value={formData.weight}
                    onChange={handleChange}
                    className="input"
                    required
                  />
                  <input
                    type="number"
                    name="height"
                    placeholder="Height (cm)"
                    value={formData.height}
                    onChange={handleChange}
                    className="input"
                    required
                  />
                  <select
                    name="sex"
                    value={formData.sex}
                    onChange={handleChange}
                    className="input"
                    required
                  >
                    <option value="">Select Sex</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                  </select>
                  <br />
                </>
              )}
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                className="input"
                required
              />
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                  className="input"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
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
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword((prev) => !prev)}
                    className="absolute right-3 top-2 text-sm text-gray-500"
                  >
                    {showConfirmPassword ? "Hide" : "Show"}
                  </button>
                </div>
              )}

              {logging || signup ? (
                <div className="flex justify-center mt-4">
                  <div
                    className="inline-block w-6 h-6 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"
                    role="status"
                  ></div>
                </div>
              ) : (
                <button
                  type="submit"
                  className="w-full bg-blue-600 cursor-pointer text-white py-2 rounded-md font-semibold"
                >
                  {isLogin ? "Login" : "Signup"}
                </button>
              )}
            </form>

            <p className="mt-4 text-center text-gray-700">
              {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
              <button
                onClick={() => setIsLogin((prev) => !prev)}
                className="text-blue-600 cursor-pointer font-semibold"
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
