import React, { useState } from "react";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

const Stats = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = React.useRef(null);

  const handleOpenModal = () => setModalOpen(true);
  const handleCloseModal = () => setModalOpen(false);
  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  };
  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };
  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      // handle file upload here
      handleCloseModal();
    }
  };
  const handleFileChange = () => {
    // handle file upload here
    handleCloseModal();
  };
  const handleBrowseClick = () => {
    fileInputRef.current && fileInputRef.current.click();
  };

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
          <button
            className="bg-[#058900] text-white cursor-pointer text-sm rounded-full px-4 py-2 mt-4 flex items-center gap-2"
            onClick={handleOpenModal}
          >
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

      {/* Modal for uploading lung x-ray */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-xl shadow-lg p-6 min-w-[320px] max-w-[90vw] flex flex-col items-center">
            <h2 className="text-lg font-bold text-[#0A7CFF] mb-4">
              Upload Lung X-ray
            </h2>
            <div
              className={`w-full flex flex-col items-center justify-center border-2 border-dashed rounded-xl transition-colors duration-200 ${
                dragActive
                  ? "border-[#0A7CFF] bg-[#F0F6FF]"
                  : "border-[#BFD6FF] bg-[#F8FBFF]"
              }`}
              style={{ minHeight: 140 }}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={handleBrowseClick}
            >
              <input
                type="file"
                accept="image/*"
                className="hidden"
                ref={fileInputRef}
                onChange={handleFileChange}
              />
              <div className="flex flex-col items-center justify-center py-6 cursor-pointer select-none">
                <svg
                  width="40"
                  height="40"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="#0A7CFF"
                  className="mb-2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5-5m0 0l5 5m-5-5v12"
                  />
                </svg>
                <span className="text-[#0A7CFF] font-medium">
                  Drag & drop or <span className="underline">browse</span> to
                  upload
                </span>
                <span className="text-xs text-gray-400 mt-1">
                  JPG, PNG, or JPEG (max 10MB)
                </span>
              </div>
            </div>
            <button
              onClick={handleCloseModal}
              className="bg-[#0A7CFF] text-white rounded px-4 py-2 hover:bg-[#005DE0] mt-6"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Stats;
