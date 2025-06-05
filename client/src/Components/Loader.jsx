import React from "react";

const Loader = () => {
  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-gradient-to-b from-[#319CEA] to-[#5FBBFF]">
      <div className="relative flex items-center justify-center mb-6">
        {/* Simple, modern spinner */}
        <span className="inline-block w-24 h-24 rounded-full border-4 border-white/60 border-t-transparent animate-spin-slow"></span>
        <img
          src="/home/lungs1.png"
          alt="Loading..."
          className="absolute w-12 h-12 "
        />
      </div>
      <div className="text-white text-2xl font-bold tracking-tight font-dm-sans">
        BREATHE <span className="text-[#005DE0]">WELL</span>
      </div>
      <div className="text-white/80 text-sm mt-2 font-dm-sans tracking-tight">
        Loading your experience...
      </div>
    </div>
  );
};

export default Loader;
