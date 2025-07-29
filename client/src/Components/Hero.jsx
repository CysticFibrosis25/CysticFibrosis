import { motion } from "framer-motion";

const Hero = () => {
  return (
    <div>
      <motion.div
        className="flex flex-col items-center justify-center h-[68vh] md:h-[60vh] lg:h-[70vh] text-white mt-8 md:mt-12 font-dm-sans tracking-tight"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <motion.div className="my-6 flex flex-col items-center justify-center">
          <div className="text-4xl md:text-7xl font-medium mb-4 ">
            BREATHE <span className="text-[#005DE0]">WELL</span>
          </div>
          <p
            className="mb-6 text-sm md:text-[1rem] text-black w-[320px] text-center "
            transition={{ duration: 1, delay: 0.8, ease: "easeOut" }}
          >
            Monitor your progress, get personalized insights, and feel supported
            every step of the way.
          </p>
        </motion.div>
        <motion.img
          src="/home/lungs1.png"
          alt="Hero Image"
          className="w-[80px] md:w-[100px] mb-6 breathing-animation"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4, ease: "backOut" }}
        />
        <motion.div
          className="flex flex-col md:flex-row space-y-3 md:space-y-0 md:space-x-4 w-full md:w-auto items-center mt-6"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8, ease: "easeOut" }}
        >
          <motion.button
            className="bg-[#0A7CFF] text-white font-medium cursor-pointer py-3 px-8 md:px-16 rounded-full w-4/5 md:w-auto"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            Get Started
          </motion.button>
          <motion.button
            className="bg-[#7AB7E0] text-black font-medium py-3 px-8 md:px-16 cursor-pointer rounded-full w-4/5 md:w-auto"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            login
          </motion.button>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Hero;
