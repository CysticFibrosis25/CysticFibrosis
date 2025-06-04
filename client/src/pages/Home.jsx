import { motion } from "framer-motion";
import Navbar from "../Components/Navbar";
import Features from "../Components/Features";
import Hero from "../Components/Hero";
import Howdoesitwork from "../Components/Howdoesitwork";
import Healthtips from "../Components/Healthtips";
import Footer from "../Components/Footer";

const Home = () => {
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
