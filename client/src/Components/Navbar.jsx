import React, { useState } from "react";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="mt-4 text-black font-dm-sans">
      <nav className="flex items-center justify-between px-4 py-2 md:w-[70vw] w-[80vw] border border-white rounded-full mx-auto">
        <div>Logo</div>
        <button
          className="md:hidden flex items-center px-3 py-2 "
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
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
        </button>

        <ul className="hidden md:flex space-x-12 ml-auto text-white">
          <li>
            <a href="/" className="hover:underline">
              Home
            </a>
          </li>
          <li>
            <a href="/login" className="hover:underline">
              Login/Signup
            </a>
          </li>
          <li>
            <a href="/dashboard" className="hover:underline">
              Dashboard
            </a>
          </li>
        </ul>
      </nav>

      <div className="relative md:hidden">
        {menuOpen && (
          <div className="absolute right-4 mt-2 w-40 bg-white rounded shadow-lg z-50">
            <ul className="flex flex-col py-2">
              <li>
                <a
                  href="/"
                  className="block px-4 py-2 hover:bg-gray-100"
                  onClick={() => setMenuOpen(false)}
                >
                  Home
                </a>
              </li>
              <li>
                <a
                  href="/login"
                  className="block px-4 py-2 hover:bg-gray-100"
                  onClick={() => setMenuOpen(false)}
                >
                  Login/Signup
                </a>
              </li>
              <li>
                <a
                  href="/dashboard"
                  className="block px-4 py-2 hover:bg-gray-100"
                  onClick={() => setMenuOpen(false)}
                >
                  Dashboard
                </a>
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
