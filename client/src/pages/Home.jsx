import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Navbar from "../Components/Navbar";
import Features from "../Components/Features";
import Hero from "../Components/Hero";
import Howdoesitwork from "../Components/Howdoesitwork";
import Healthtips from "../Components/Healthtips";
import Footer from "../Components/Footer";
import Loader from "../Components/Loader";

const Home = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1800);
    return () => clearTimeout(timer);
  }, []);

  if (loading) return <Loader />;

  return (
    <div className="relative">
      <img
        src="/home/heroimage.png"
        alt="Hero"
        className="w-full h-[160vh] md:h-[150vh] object-cover"
      />
      <div className="absolute top-0 left-0 w-full z-10">
        <Navbar />
        <Hero />
        <Features />
      </div>
      <Howdoesitwork />
      <Healthtips />
      <Footer />
    </div>
  );
};

export default Home;
