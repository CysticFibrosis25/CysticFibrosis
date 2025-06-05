import Userdetais from "../Components/Dashboard/Userdetais";
import Footer from "../Components/Footer";
import Navbar from "../Components/Navbar";
import Stats from "../Components/Dashboard/Stats";
import { Healthtips2 } from "../Components/Healthtips2";

const Dashboard = () => {
  return (
    <div className="h-full  font-dm-sans flex flex-col">
      <Navbar />
      <div className="font-dm-sans text-black py-8 text-2xl md:text-3xl mt-8 text-center tracking-tighter w-full">
        <p className="font-medium">
          Welcome back, <span className="text-[#260AFF]">B V Vivek</span>
        </p>
        <p className="text-sm">Let&apos;s help you thrive today!</p>
      </div>
      <Userdetais />
      <Stats />
      <Healthtips2 />
      <Footer />
    </div>
  );
};

export default Dashboard;
