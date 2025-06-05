import { howdoesthiswork } from "../constants/features";
import { motion } from "framer-motion";

const Howdoesitwork = () => {
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
        <div className="flex flex-col items-center gap-10 justify-center p-10">
          {howdoesthiswork.map((step, index) => (
            <div key={index} className="flex items-start mb-4 tracking-tighter">
              <div className="text-6xl px-3 text-[#6EABD4]">{index + 1}</div>
              <div>
                <p className="text-2xl ">{step.heading}</p>
                <p className="text-sm">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default Howdoesitwork;
