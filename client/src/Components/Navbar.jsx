import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate(); // Add this line
  const isChatbot =
    window.location.pathname === "/chatbot" ||
    window.location.pathname === "/dashboard";

  useEffect(() => {
    const status = localStorage.getItem("isLoggedIn");
    setIsLoggedIn(status === "true");
  }, [window.location.pathname]);

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    setIsLoggedIn(false);
    navigate("/login"); // Ensure navigation after logout
  };

  return (
    <motion.div
      className={`mt-4 font-dm-sans ${isChatbot ? "text-black" : "text-white"}`}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <nav
        className={`flex items-center justify-between px-4 py-2 md:w-[70vw] w-[90vw] rounded-full mx-auto ${
          isChatbot ? "border-black" : "border-white"
        } border`}
      >
        <motion.div
          className="text-md font-bold"
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          Logo
        </motion.div>

        <motion.button
          className={`md:hidden flex items-center px-3  ${
            isChatbot ? "text-black" : "text-white"
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
            stroke={isChatbot ? "black" : "white"}
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </motion.button>

        <motion.ul
          className={`hidden md:flex space-x-6 ml-auto ${
            isChatbot ? "text-black" : "text-white"
          }`}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {["Home", "Dashboard", "Chatbot"].map((item, index) => {
            let href = "/";
            if (item === "Dashboard") href = "/dashboard";
            else if (item === "Chatbot") href = "/chatbot";
            return (
              <motion.li
                key={item}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
              >
                <motion.a
                  href={href}
                  className={`hover:underline ${
                    isChatbot ? "text-black" : "text-white"
                  }`}
                  whileHover={{ scale: 1.05, y: -2 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  {item}
                </motion.a>
              </motion.li>
            );
          })}
          {isLoggedIn ? (
            <motion.li>
              <button
                onClick={handleLogout}
                className={`hover:underline ${
                  isChatbot ? "text-black" : "text-white"
                }`}
              >
                Logout
              </button>
            </motion.li>
          ) : (
            <motion.li>
              <a
                href="/login"
                className={`hover:underline ${
                  isChatbot ? "text-black" : "text-white"
                }`}
              >
                Login/Signup
              </a>
            </motion.li>
          )}
        </motion.ul>
      </nav>

      <div className="relative md:hidden">
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              className="absolute right-4 mt-2 w-40 rounded-4xl shadow-lg z-20 bg-white/50 backdrop-blur"
              initial={{ opacity: 0, scale: 0.95, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
            >
              <ul className="flex flex-col py-4 px-2">
                {[
                  { name: "Home", href: "/" },
                  { name: "Dashboard", href: "/dashboard" },
                  { name: "Chatbot", href: "/chatbot" },
                  isLoggedIn
                    ? { name: "Logout", href: "#", onClick: handleLogout }
                    : { name: "Login/Signup", href: "/login" },
                ].map((item, index) => (
                  <motion.li
                    key={item.name}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <motion.a
                      href={item.href}
                      className={`block px-4 py-2 hover:bg-gray-100 ${
                        isChatbot
                          ? "text-black hover:bg-black/60"
                          : "text-black"
                      }`}
                      onClick={() => {
                        if (item.onClick) item.onClick();
                        setMenuOpen(false);
                      }}
                      whileHover={
                        isChatbot
                          ? { backgroundColor: "#222", x: 5 }
                          : { backgroundColor: "#f3f4f6", x: 5 }
                      }
                      transition={{ duration: 0.2 }}
                    >
                      {item.name}
                    </motion.a>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default Navbar;
