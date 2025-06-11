import { howdoesthiswork } from "../constants/features";
import { motion, useInView, useAnimation } from "framer-motion";
import { useRef } from "react";
import React from "react";

const Howdoesitwork = () => {
  const stepsRef = useRef(null);
  const isInView = useInView(stepsRef, { once: false, margin: "-100px" });
  const controls = useAnimation();

  return (
    <motion.div
      className="flex flex-col items-center justify-center my-15 px-2 font-dm-sans"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.5, ease: "easeOut" }}
    >
      <div className="flex flex-col items-center justify-center ">
        <div className="flex flex-col items-center text-white justify-center px-10 py-6 text-center rounded-sm md:w-[75vw] bg-gradient-to-r from-[#319CEA] to-[#5FBBFF] tracking-tight">
          <p className="text-2xl md:text-4xl font-medium">
            How does this work?
          </p>
          <p>Onboarding is seem easy and achievable.</p>
        </div>
        <div
          className="relative flex flex-col items-center gap-10 justify-center p-10 w-full"
          ref={stepsRef}
        >
          {howdoesthiswork.map((step, index) => (
            <div
              key={index}
              className="relative flex items-center mb-4 tracking-tighter z-10 w-full md:w-1/2"
            >
              <div className="flex flex-col items-center mr-4">
                <div className="relative z-20">
                  <div className="flex items-center justify-center w-14 h-14 rounded-full bg-white  border-4 border-[#319CEA] text-3xl font-bold text-[#319CEA]">
                    {index + 1}
                  </div>
                  <span
                    className="absolute left-1/2 -translate-x-1/2 top-full w-4 h-4 rounded-full bg-gradient-to-tr from-[#319CEA] to-[#5FBBFF] border-2 border-white shadow"
                    style={{ marginTop: "-10px" }}
                  ></span>
                </div>
              </div>
              <div className="flex-1">
                <p className="text-2xl font-semibold text-[#319CEA] mb-1 ">
                  {step.heading}
                </p>
                <p className="text-sm text-gray-700 bg-white/70 rounded-lg  py-1">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default Howdoesitwork;
