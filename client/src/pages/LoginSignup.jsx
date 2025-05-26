import React, { useState } from "react";
import Navbar from "../Components/Navbar";

const LoginSignup = () => {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="min-h-screen relative font-dm-sans tracking-tight">
      <img
        src="/home/heroimage.png"
        alt="Hero"
        className="w-full h-[100vh]  object-cover absolute top-0 left-0 z-0"
      />
      <div className="absolute top-0 left-0 w-full z-10">
        <Navbar />
        <div className="flex flex-col items-center justify-center min-h-[60vh] pt-16">
          <div className="bg-white/80 backdrop-blur-md rounded-lg shadow-sm p-6 sm:p-10 w-[90vw] max-w-md flex flex-col items-center">
            <h2 className="text-2xl sm:text-3xl font-bold mb-4 text-[#0A7CFF] tracking-tight">
              {isLogin ? "Welcome Back" : "Create Account"}
            </h2>
            <form className="w-full flex flex-col gap-4">
              {!isLogin && (
                <input
                  type="text"
                  placeholder="Name"
                  className="px-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#0A7CFF]"
                />
              )}
              <input
                type="email"
                placeholder="Email"
                className="px-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#0A7CFF]"
              />
              <input
                type="password"
                placeholder="Password"
                className="px-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#0A7CFF]"
              />
              {!isLogin && (
                <input
                  type="password"
                  placeholder="Confirm Password"
                  className="px-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#0A7CFF]"
                />
              )}
              <button
                type="submit"
                className="bg-[#0A7CFF] text-white font-medium py-2 rounded-full mt-2 hover:bg-[#095ec2] transition"
              >
                {isLogin ? "Login" : "Sign Up"}
              </button>
            </form>
            <div className="mt-4 text-sm text-gray-700">
              {isLogin ? (
                <>
                  Don't have an account?{" "}
                  <button
                    className="text-[#0A7CFF] hover:underline focus:outline-none"
                    onClick={() => setIsLogin(false)}
                  >
                    Sign up
                  </button>
                </>
              ) : (
                <>
                  Already have an account?{" "}
                  <button
                    className="text-[#0A7CFF] hover:underline focus:outline-none"
                    onClick={() => setIsLogin(true)}
                  >
                    Login
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginSignup;
