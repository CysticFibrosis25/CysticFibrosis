import Userdetais from "../Components/Dashboard/Userdetais";
import Footer from "../Components/Footer";
import Navbar from "../Components/Navbar";
import Stats from "../Components/Dashboard/Stats";
import { Healthtips2 } from "../Components/Healthtips2";
import { motion } from "framer-motion";
import Foodsummary from "../Components/Dashboard/Foodsummary";

const Dashboard = () => {
  return (
    <div className="h-full  font-dm-sans flex flex-col">
      <Navbar />
      <div className="font-dm-sans text-black py-8 text-2xl md:text-3xl mt-8 text-center tracking-tight w-full">
        <p className="font-medium">
          Welcome back, <span className="text-[#260AFF]">B V Vivek</span>
        </p>
        <p className="text-sm">Let&apos;s help you thrive today!</p>
      </div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <Userdetais />
        <Stats />
        <Foodsummary />
        <Healthtips2 />
        <Footer />
      </motion.div>
    </div>
  );
};

export default Dashboard;
