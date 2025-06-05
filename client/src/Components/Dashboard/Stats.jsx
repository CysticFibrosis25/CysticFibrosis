import React from "react";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

const Stats = () => {
  return (
    <div className="w-full flex flex-col md:flex-row font-dm-sans tracking-tight gap-2 md:gap-4 p-2 md:justify-center md:items-center">
      <div className="w-full md:w-[320px] max-w-xs mx-auto md:mx-0 relative border border-[#7DE07A] bg-[#D0FFCF] rounded-3xl overflow-hidden flex-shrink-0">
        <img
          src="/home/lungs1.png"
          alt="Lung Health"
          className=" absolute -bottom-8 -right-10 w-32 h-32 object-cover rounded-lg"
        />
        <div className="px-6 py-2">
          <p className="text-xl font-medium py-2">Lung Health</p>
          <div className="flex flex-col">
            <p className="text-3xl font-semibold">Stable</p>
            <p className="text-xs tracking-tighter">last checked 3 days ago</p>
          </div>
          <button className="bg-[#058900] text-white cursor-pointer text-sm rounded-full px-4 py-2 mt-4 flex items-center gap-2">
            Check today&apos;s Health{" "}
            <ArrowForwardIcon style={{ fontSize: 18 }} />
          </button>
        </div>
      </div>
      <div className="w-full md:min-w-[380px] max-w-xs mx-auto md:mx-0 relative border border-[#E0DE7A] bg-[#FEFFCF] rounded-3xl overflow-hidden flex-shrink-0">
        <img
          src="/dashboard/calories_1.png"
          alt="Calories"
          className=" absolute -bottom-6 -right-4 w-32 h-40 object-cover rounded-lg"
        />
        <div className="px-6 py-4">
          <p className="text-xl font-medium py-2">Calories Logged Today</p>
          <div className="flex flex-col">
            <p className="text-xs bg-[#E0DE7A] w-[100px] px-4 py-1 rounded-full font-semibold">
              {new Date().toLocaleDateString()}
            </p>
          </div>
          <div className=" text-[#ACA700] text-2xl font-medium w-[200px] md:w-full rounded-full py-2 mt-4">
            2,500 kcal/3,000 kcal
          </div>
        </div>
      </div>
      <div className="w-full md:w-[320px] max-w-xs mx-auto md:mx-0 relative border border-[#7ADEE0] bg-[#CFFFF9] rounded-3xl overflow-hidden flex-shrink-0">
        <img
          src="/dashboard/enzymes_1.png"
          alt="Lung Health"
          className=" absolute -bottom-5 -right-5 w-32 h-36 object-cover rounded-lg"
        />
        <div className="px-6 py-4">
          <p className="text-xl font-medium py-2">Enzyme Estimate</p>
          <div className="flex flex-col">
            <p className="text-xs bg-[#7ADBE0] w-[100px] px-4 py-1 rounded-full font-semibold">
              {new Date().toLocaleDateString()}
            </p>
          </div>
          <div className=" text-[#00AC9B] text-2xl font-medium rounded-full  py-2 mt-4">
            5,500 LU
          </div>
        </div>
      </div>
    </div>
  );
};

export default Stats;
