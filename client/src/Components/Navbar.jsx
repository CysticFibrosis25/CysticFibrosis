import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const isDarkPage =
    location.pathname === "/chatbot" ||
    location.pathname === "/dashboard" ||
    location.pathname === "/fvc-prediction" ||
    location.pathname === "/food";

  useEffect(() => {
    const status = localStorage.getItem("isLoggedIn");
    setIsLoggedIn(status === "true");
  }, [location.pathname]);

  const handleLogout = () => {
    localStorage.clear();
    setIsLoggedIn(false);
    navigate("/login");
  };

  /* 🔹 CHANGE 1: Define nav items clearly */
  const publicNavItems = [
    { label: "Home", path: "/" },
    { label: "Login / Signup", path: "/login" },
  ];

  const privateNavItems = [
    { label: "Home", path: "/" },
    { label: "Dashboard", path: "/dashboard" },
    { label: "FVC Prediction", path: "/fvc-prediction" },
    { label: "Nutrition Log", path: "/food" },
    { label: "Chatbot", path: "/chatbot" },
  ];

  const navItems = isLoggedIn ? privateNavItems : publicNavItems;

  return (
    <motion.div
      className={`mt-4 font-dm-sans ${
        isDarkPage ? "text-black" : "text-white"
      }`}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <nav
        className={`flex items-center justify-between px-4 py-2 md:w-[70vw] w-[90vw] rounded-full mx-auto ${
          isDarkPage ? "border-black" : "border-white"
        } border`}
      >
        {/* Logo */}
        <motion.div
          className="text-md font-bold cursor-pointer"
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 300 }}
          onClick={() => navigate("/")}
        >
          BREATHE <span className="text-[#260AFF]">WELL</span>
        </motion.div>

        {/* Mobile menu button */}
        <motion.button
          className={`md:hidden flex items-center px-3 ${
            isDarkPage ? "text-black" : "text-white"
          }`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          animate={{ rotate: menuOpen ? 90 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <svg
            className="h-6 w-6"
            fill="none"
            stroke={isDarkPage ? "black" : "white"}
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </motion.button>

        {/* Desktop nav */}
        <motion.ul
          className={`hidden md:flex space-x-6 ml-auto ${
            isDarkPage ? "text-black" : "text-white"
          }`}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {navItems.map((item, index) => (
            <motion.li
              key={item.path}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
            >
              <motion.span
                onClick={() => navigate(item.path)}
                className="cursor-pointer hover:underline"
                whileHover={{ scale: 1.05, y: -2 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                {item.label}
              </motion.span>
            </motion.li>
          ))}

          {/* 🔹 CHANGE 2: Logout only when logged in */}
          {isLoggedIn && (
            <motion.li>
              <button
                onClick={handleLogout}
                className="hover:underline font-bold text-[#FF3131]"
              >
                Logout
              </button>
            </motion.li>
          )}
        </motion.ul>
      </nav>

      {/* Mobile dropdown */}
      <div className="relative md:hidden">
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              className="absolute right-4 mt-2 w-48 rounded-4xl shadow-lg z-20 bg-white/60 backdrop-blur"
              initial={{ opacity: 0, scale: 0.95, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
            >
              <ul className="flex flex-col py-4 px-2">
                {navItems.map((item, index) => (
                  <motion.li
                    key={item.path}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <motion.div
                      onClick={() => {
                        navigate(item.path);
                        setMenuOpen(false);
                      }}
                      className="block px-4 py-2 cursor-pointer hover:bg-gray-100 text-black"
                      whileHover={{ x: 5 }}
                    >
                      {item.label}
                    </motion.div>
                  </motion.li>
                ))}

                {isLoggedIn && (
                  <motion.li>
                    <motion.div
                      onClick={handleLogout}
                      className="block px-4 py-2 cursor-pointer text-[#FF3131]"
                      whileHover={{ x: 5 }}
                    >
                      Logout
                    </motion.div>
                  </motion.li>
                )}
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default Navbar;

