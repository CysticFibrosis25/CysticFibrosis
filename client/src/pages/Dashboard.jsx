import Userdetais from "../Components/Dashboard/Userdetais";
import Footer from "../Components/Footer";
import { motion } from "framer-motion";
import { healthtips } from "../constants/features";
import Navbar from "../Components/Navbar";

const Dashboard = () => {
  return (
    <div className="h-full  font-dm-sans flex flex-col">
      <div className="relative">
        <img
          src="/dashboard/dashboardcloud.png"
          alt="Hero"
          className="w-full h-[50vh] md:h-[40vh] object-cover"
        />
        <div className="absolute top-0 left-0 w-full z-10">
          <Navbar />
        </div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-dm-sans text-xl md:text-3xl text-center w-full">
          <p className="font-semibold">Welcome back, Vivek</p>
          <p className="text-sm">Let&apos;s help you thrive today!</p>
        </div>
      </div>
      <Userdetais />

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
      <Footer />
    </div>
  );
};

export default Dashboard;
