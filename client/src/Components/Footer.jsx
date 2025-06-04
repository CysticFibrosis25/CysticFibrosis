import React from "react";

const Footer = () => {
  return (
    <div className="flex md:flex-row flex-col items-center py-8 px-6 mt-10 justify-between p-4 bg-[#00254E] text-white tracking-tighter font-dm-sans">
      <p className="text-4xl ">
        BREATE <span className="text-[#260AFF]">WELL</span>{" "}
      </p>
      <div className="gap-4 opacity-80 flex md:flex-row flex-col mt-8 md:mt-0  items-center justify-center">
        <a href="#">Home</a>
        <a href="#">Dashboard</a>
        <a href="#">Chatbot</a>
        <a href="#">Login/Signup</a>
      </div>
      <p className="text-sm text-[#015a96] mt-8 md:mt-0">
        © 2025 Breathe Well. All rights reserved.
      </p>
    </div>
  );
};

export default Footer;
