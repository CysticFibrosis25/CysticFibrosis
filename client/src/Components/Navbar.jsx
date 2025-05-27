import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <motion.div
      className="mt-4 text-black font-dm-sans"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <nav className="flex items-center justify-between px-4 py-2 md:w-[70vw] w-[90vw] border border-white rounded-full mx-auto">
        <motion.div
          className="text-lg font-bold"
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          Logo
        </motion.div>

        <motion.button
          className="md:hidden flex items-center px-3 py-2"
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
            stroke="white"
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
          className="hidden md:flex space-x-6 ml-auto text-white"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {["Home", "Login/Signup", "Dashboard"].map((item, index) => (
            <motion.li
              key={item}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
            >
              <motion.a
                href={
                  item === "Home"
                    ? "/"
                    : item === "Login/Signup"
                    ? "/login"
                    : "/dashboard"
                }
                className="hover:underline"
                whileHover={{ scale: 1.05, y: -2 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                {item}
              </motion.a>
            </motion.li>
          ))}
        </motion.ul>
      </nav>

      <div className="relative md:hidden">
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              className="absolute right-4 mt-2 w-40 bg-white/50 backdrop-blur rounded-4xl shadow-lg z-20"
              initial={{ opacity: 0, scale: 0.95, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
            >
              {" "}
              <ul className="flex flex-col py-4 px-2">
                {[
                  { name: "Home", href: "/" },
                  { name: "Dashboard", href: "/dashboard" },
                  { name: "Login/Signup", href: "/login" },
                ].map((item, index) => (
                  <motion.li
                    key={item.name}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <motion.a
                      href={item.href}
                      className="block px-4 py-2 hover:bg-gray-100"
                      onClick={() => setMenuOpen(false)}
                      whileHover={{ backgroundColor: "#f3f4f6", x: 5 }}
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
