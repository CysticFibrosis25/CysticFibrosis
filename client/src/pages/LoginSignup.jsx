import React, { useState } from "react";
import Navbar from "../Components/Navbar";

const LoginSignup = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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
          <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl p-6 sm:p-10 w-[92vw] max-w-md flex flex-col items-center border border-[#0A7CFF]/20">
            <h2 className="text-3xl sm:text-4xl font-extrabold mb-2 text-[#0A7CFF] tracking-tight drop-shadow-lg">
              {isLogin ? "Welcome Back" : "Create Account"}
            </h2>
            <p className="text-gray-600 text-xs sm:text-sm mb-6 text-center max-w-xs">
              {isLogin
                ? "Login to access your dashboard and personalized insights."
                : "Sign up to start your journey to better respiratory health!"}
            </p>
            <form className="w-full flex flex-col gap-4">
              {!isLogin && (
                <input
                  type="text"
                  placeholder="Name"
                  className="px-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#0A7CFF] bg-white/80 placeholder-gray-400"
                />
              )}
              <input
                type="email"
                placeholder="Email"
                className="px-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#0A7CFF] bg-white/80 placeholder-gray-400"
              />
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  className="px-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#0A7CFF] bg-white/80 placeholder-gray-400 w-full pr-10"
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                  tabIndex={-1}
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6 text-cyan-700 "
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                      />
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6 text-cyan-800 "
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                  )}
                </button>
              </div>
              {!isLogin && (
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm Password"
                    className="px-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#0A7CFF] bg-white/80 placeholder-gray-400 w-full pr-10"
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                    tabIndex={-1}
                    onClick={() => setShowConfirmPassword((v) => !v)}
                    aria-label={
                      showConfirmPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showConfirmPassword ? (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6 text-cyan-700 "
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                        />
                      </svg>
                    ) : (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6 text-cyan-800 "
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                        />
                      </svg>
                    )}
                  </button>
                </div>
              )}
              <button
                type="submit"
                className="bg-gradient-to-r from-[#0A7CFF] to-[#7AB7E0] text-white font-semibold py-2 rounded-full mt-2 shadow hover:from-[#095ec2] hover:to-[#5fa6d6] transition-all duration-200"
              >
                {isLogin ? "Login" : "Sign Up"}
              </button>
            </form>
            <div className="mt-4 text-sm text-gray-700">
              {isLogin ? (
                <>
                  Don't have an account?{" "}
                  <button
                    className="text-[#0A7CFF] hover:underline focus:outline-none font-semibold"
                    onClick={() => setIsLogin(false)}
                  >
                    Sign up
                  </button>
                </>
              ) : (
                <>
                  Already have an account?{" "}
                  <button
                    className="text-[#0A7CFF] hover:underline focus:outline-none font-semibold"
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
