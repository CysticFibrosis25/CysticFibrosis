import React from "react";
import { features } from "../constants/features";

const Features = () => {
  return (
    <div className="py-12">
      <div className="max-w-6xl mx-auto px-2 sm:px-4 grid grid-cols-2 gap-1 md:grid-cols-4">
        {features.map((feature, idx) => (
          <div
            key={idx}
            className="relative min-h-[250px] sm:min-h-[300px] flex flex-col items-center text-start p-5 sm:p-6 rounded-md bg-[#fdffff30] backdrop-blur font-dm-sans tracking-tighter overflow-hidden"
          >
            <div className="flex flex-col justify-between gap-2 sm:gap-4 w-full">
              <h3 className="text-base sm:text-xl font-bold mb-1 sm:mb-2 w-full sm:w-[180px]">
                {feature.heading}
              </h3>
              <p className="text-black text-xs sm:text-sm leading-tight">
                {feature.description}
              </p>
            </div>
            <img
              src={feature.imageUrl}
              alt={feature.heading}
              className="absolute -bottom-6 -left-4 w-28 h-28 sm:w-32 sm:h-32 mb-2 object-contain"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Features;
