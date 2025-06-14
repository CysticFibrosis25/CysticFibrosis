import React from "react";
import { healthtips } from "../constants/features";
import { motion } from "framer-motion";
const Healthtips = () => {
  return (
    <div className="mb-4 font-dm-sans">
      <div className="relative">
        <img
          src="/home/cloud2.png"
          alt="Health Tips"
          className="w-full h-[40vh] object-cover mb-4"
        />
        <div className="absolute top-12 items-center text-sm md:text-lg left-1/2 transform -translate-x-1/2 text-white text-center leading-tight tracking-tight">
          <p>
            “Inhale strength. Exhale worry. You&apos;re not alone on this
            journey”
          </p>
        </div>
      </div>
      <div className="flex flex-col text-2xl md:text-3xl px-6 py-4 font-semibold tracking-tighter text-center justify-center mb-4 ">
        <p>Health Tips for CF Warriors</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 font-dm-sans max-w-5xl mx-auto px-4">
        {healthtips.map((tip, index) => (
          <motion.div
            key={index}
            className="flex flex-row rounded-3xl border p-6 border-[#DBDBDB] items-center text-start font-dm-sans bg-white/80"
            whileHover={{ y: -3 }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
          >
            <div className="flex flex-col items-start justify-between gap-2 w-full">
              <h3 className="md:text-2xl text-xl font-medium mb-2 text-black tracking-tight">
                {tip.heading}
              </h3>
              <p className="text-gray-700 text-xs md:text-sm max-w-[90%] leading-tight">
                {tip.description}
              </p>
            </div>
            <img
              src={tip.imageUrl}
              alt={tip.heading}
              className="w-20 h-20 md:w-32 md:h-32  object-contain"
            />
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Healthtips;
