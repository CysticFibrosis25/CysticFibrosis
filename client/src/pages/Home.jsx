import React from "react";
import Navbar from "../Components/Navbar";
import Features from "../Components/Features";

const Home = () => {
  return (
    <div className="relative">
      <img
        src="/home/heroimage.png"
        alt="Hero"
        className="w-full h-[1050px] object-cover"
      />
      <div className="absolute top-0 left-0 w-full z-10">
        <Navbar />
        <div className="flex flex-col items-center justify-center h-[50vh] md:h-[60vh] lg:h-[60vh] text-white mt-8 md:mt-12 font-dm-sans tracking-tight">
          <div className="my-6 flex flex-col items-center justify-center">
            <div className="text-4xl md:text-6xl font-medium mb-4 ">
              BREATHE <span className="text-[#005DE0]">WELL</span>
            </div>
            <p className="mb-6 text-sm md:text-sm text-black w-[250px] text-center">
              Monitor your progress, get personalized insights, and feel
              supported every step of the way.
            </p>
          </div>
          <img
            src="/home/lungs1.png"
            alt="Hero Image"
            className="w-[80px] md:w-[100px] mb-6"
          />
          <div className="flex flex-col md:flex-row space-y-3 md:space-y-0 md:space-x-4 w-full md:w-auto items-center mt-6 ">
            <button className="bg-[#0A7CFF] text-white font-medium py-3 px-8 md:px-16 rounded-full w-4/5 md:w-auto">
              Get Started
            </button>
            <button className="bg-[#7AB7E0] text-black font-medium py-3 px-8 md:px-16 rounded-full w-4/5  md:w-auto">
              login
            </button>
          </div>
        </div>
        <div>
          <Features />
        </div>
      </div>
    </div>
  );
};

export default Home;
