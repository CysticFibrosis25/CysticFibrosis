// import React, { useState } from "react";
// import { preditFVC} from "../../services/predictionService"; // Adjust the import path as needed
// import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

// const Stats = () => {
//   const [modalOpen, setModalOpen] = useState(false);
//   const [dragActive, setDragActive] = useState(false);
//   const fileInputRef = React.useRef(null);
//   const [fvc, setFvc] = useState('');
//   const [result, setResult] = useState(null);

//   const handleOpenModal = () => setModalOpen(true);
//   const handleCloseModal = () => setModalOpen(false);
//   const handleDragOver = (e) => {
//     e.preventDefault();
//     e.stopPropagation();
//     setDragActive(true);
//   };
//   const handleDragLeave = (e) => {
//     e.preventDefault();
//     e.stopPropagation();
//     setDragActive(false);
//   };
//   const handleDrop = (e) => {
//     e.preventDefault();
//     e.stopPropagation();
//     setDragActive(false);
//     if (e.dataTransfer.files && e.dataTransfer.files[0]) {
//       // handle file upload here
//       handleCloseModal();
//     }
//   };
//   const handleFileChange = () => {
//     // handle file upload here
//     handleCloseModal();
//   };
//   const handleBrowseClick = () => {
//     fileInputRef.current && fileInputRef.current.click();
//   };

//   return (
//     <div className="w-full flex flex-col md:flex-row font-dm-sans tracking-tight gap-2 md:gap-2 p-2 md:justify-center items-center md:items-center">
//       <div className="w-full md:w-[320px] md:max-w-xs md:mx-0 relative border border-[#7DE07A] bg-gradient-to-br from-[#D0FFCF] to-[#d0ffcf60] rounded-3xl overflow-hidden flex-shrink-0">
//         <img
//           src="/home/lungs1.png"
//           alt="Lung Health"
//           className=" absolute -bottom-8 -right-10 w-32 h-32 object-cover rounded-lg"
//         />
//         <div className="px-6 py-2">
//           <p className="text-xl font-medium py-2">Lung Health</p>
//           <div className="flex flex-col">
//             <p className="text-3xl font-semibold">Stable</p>
//             <p className="text-xs tracking-tighter">last checked 3 days ago</p>
//           </div>
//           <button
//             className="bg-gradient-to-r from-[#058900] to-[#07bb01] text-white cursor-pointer text-sm rounded-full px-4 py-2 mt-4 flex items-center gap-2"
//             onClick={handleOpenModal}
//           >
//             Check today&apos;s Health{" "}
//             <ArrowForwardIcon style={{ fontSize: 18 }} />
//           </button>
//         </div>
//       </div>
//       <div className="w-full md:min-w-[380px] md:max-w-xs relative border border-[#E0DE7A] bg-gradient-to-br from-[#FEFFCF] to-[#feffcf60] rounded-3xl overflow-hidden flex-shrink-0">
//         <img
//           src="/dashboard/calories_1.png"
//           alt="Calories"
//           className=" absolute -bottom-6 -right-4 w-32 h-40 object-cover rounded-lg"
//         />
//         <div className="px-6 py-4">
//           <p className="text-xl font-medium py-2">Calories Logged Today</p>
//           <div className="flex flex-col">
//             <p className="text-xs bg-[#E0DE7A] w-[100px] px-4 py-1 rounded-full font-semibold">
//               {new Date().toLocaleDateString()}
//             </p>
//           </div>
//           <div className=" text-[#ACA700] text-2xl font-medium w-[200px] md:w-full rounded-full py-2 mt-4">
//             2,500 kcal/3,000 kcal
//           </div>
//         </div>
//       </div>
//       <div className="w-full md:w-[320px] md:max-w-xs relative border border-[#7ADEE0] bg-gradient-to-br from-[#CFFFF9] to-[#cffff960] rounded-3xl overflow-hidden flex-shrink-0">
//         <img
//           src="/dashboard/enzymes_1.png"
//           alt="Lung Health"
//           className=" absolute -bottom-5 -right-5 w-32 h-36 object-cover rounded-lg"
//         />
//         <div className="px-6 py-4">
//           <p className="text-xl font-medium py-2">Enzyme Estimate</p>
//           <div className="flex flex-col">
//             <p className="text-xs bg-[#7ADBE0] w-[100px] px-4 py-1 rounded-full font-semibold">
//               {new Date().toLocaleDateString()}
//             </p>
//           </div>
//           <div className=" text-[#00AC9B] text-2xl font-medium rounded-full  py-2 mt-4">
//             5,500 LU
//           </div>
//         </div>
//       </div>
//       {modalOpen && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
//           <div className="bg-white rounded-xl shadow-lg p-6 min-w-[320px] max-w-[90vw] flex flex-col items-center">
//             <h2 className="text-lg font-bold text-[#0A7CFF] mb-4">
//               Upload Lung X-ray
//             </h2>
//             <div
//               className={`w-full flex flex-col items-center justify-center border-2 border-dashed rounded-xl transition-colors duration-200 ${
//                 dragActive
//                   ? "border-[#0A7CFF] bg-[#F0F6FF]"
//                   : "border-[#BFD6FF] bg-[#F8FBFF]"
//               }`}
//               style={{ minHeight: 140 }}
//               onDragOver={handleDragOver}
//               onDragLeave={handleDragLeave}
//               onDrop={handleDrop}
//               onClick={handleBrowseClick}
//             >
//               <input
//                 type="file"
//                 accept="image/*,.zip,.rar,.7z"
//                 className="hidden"
//                 ref={fileInputRef}
//                 onChange={handleFileChange}
//               />
//               <div className="flex flex-col items-center justify-center py-6 cursor-pointer select-none">
//                 <svg
//                   width="40"
//                   height="40"
//                   fill="none"
//                   viewBox="0 0 24 24"
//                   stroke="#0A7CFF"
//                   className="mb-2"
//                 >
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     strokeWidth="2"
//                     d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5-5m0 0l5 5m-5-5v12"
//                   />
//                 </svg>
//                 <span className="text-[#0A7CFF] font-medium">
//                   Drag & drop or <span className="underline">browse</span> to
//                   upload
//                 </span>
//                 <span className="text-xs text-gray-400 mt-1">
//                   JPG, PNG, JPEG, ZIP, RAR, 7Z (max 10MB)
//                 </span>
//               </div>
//             </div>
//             <button
//               onClick={handleCloseModal}
//               className="bg-[#0A7CFF] text-white rounded px-4 py-2 hover:bg-[#005DE0] mt-6"
//             >
//               Cancel
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Stats;

import React, { useState, useEffect, useRef } from "react";
import { predictFVC, fetchFVCGraphHistory } from "../../services/predictionService";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { Line } from "react-chartjs-2";
import {
  Chart,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import annotationPlugin from "chartjs-plugin-annotation";

Chart.register(LineElement, CategoryScale, LinearScale, PointElement, Title, Tooltip, Legend, Filler, annotationPlugin);

const Stats = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [fvc, setFvc] = useState("");
  const [result, setResult] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [history, setHistory] = useState([]);
  const [criticalWeek, setCriticalWeek] = useState(null);
  const fileInputRef = useRef(null);

  const handleOpenModal = () => setModalOpen(true);
  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedFile(null);
    setFvc("");
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) setSelectedFile(e.target.files[0]);
  };

  const handleSubmitClick = async () => {
    const email = localStorage.getItem("email");
    if (!selectedFile || !fvc || !email) {
      alert("Please enter FVC, upload a file, and ensure you're logged in.");
      return;
    }

    const formData = new FormData();
    formData.append("ct_scan", selectedFile);
    formData.append("fvc", fvc);
    formData.append("email", email);

    try {
      const response = await predictFVC(formData);
      setResult(response.data);
      fetchHistory(); // ✅ Re-fetch for updated chart
    } catch (error) {
      alert(error.response?.data?.error || "Prediction failed");
    } finally {
      handleCloseModal();
    }
  };

  const fetchHistory = async () => {
    const email = localStorage.getItem("email");
    if (!email) return;

    try {
      const data = await fetchFVCGraphHistory(email);
      setHistory(data);

      // Optional: estimate weeks to reach 1000mL
      if (data.length > 0) {
        const latest = data[data.length - 1];
        const slope = latest.slope;
        if (slope < 0) {
          const weeks = Math.max(0, Math.floor((latest.fvc - 1000) / Math.abs(slope)));
          setCriticalWeek(weeks);
        }
      }
    } catch (e) {
      console.error("Error fetching FVC history:", e);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  // ================== Chart Processing ===================

  const generateChartData = () => {
    if (history.length === 0) return null;

    const labels = history.map((h) =>
      new Date(h.timestamp).toLocaleDateString("en-IN", { day: "2-digit", month: "short" })
    );

    const actualFVCs = history.map((h) => h.fvc);
    const slope = history[history.length - 1].slope;
    const lastFVC = actualFVCs[actualFVCs.length - 1];

    const projectedWeeks = 10;
    const projectedLabels = [...labels];
    const projectedFVCs = [...actualFVCs];

    let projectedDate = new Date(history[history.length - 1].timestamp);

    for (let i = 1; i <= projectedWeeks; i++) {
      projectedDate.setDate(projectedDate.getDate() + 7);
      projectedLabels.push(projectedDate.toLocaleDateString("en-IN", { day: "2-digit", month: "short" }));
      projectedFVCs.push(Math.max(0, lastFVC + slope * i));
    }

    return {
      labels: projectedLabels,
      datasets: [
        {
          label: "Actual FVC",
          data: actualFVCs,
          borderColor: "#0A7CFF",
          backgroundColor: "#0A7CFF",
          tension: 0.3,
          pointRadius: 5,
          fill: false,
        },
        {
          label: "Projected FVC",
          data: projectedFVCs.slice(actualFVCs.length),
          borderColor: "#FF5E5E",
          borderDash: [6, 4],
          tension: 0.3,
          pointRadius: 3,
          fill: false,
        },
      ],
    };
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { display: true },
      tooltip: { mode: "index", intersect: false },
      annotation: {
        annotations: criticalWeek
          ? {
              line1: {
                type: "line",
                xMin: history.length - 1 + criticalWeek,
                xMax: history.length - 1 + criticalWeek,
                borderColor: "red",
                borderWidth: 2,
                label: {
                  content: "1000 mL Threshold",
                  enabled: true,
                  position: "end",
                },
              },
            }
          : {},
    },
    scales: {
      y: {
        beginAtZero: false,
        min: 0,
        title: { display: true, text: "FVC (mL)" },
        ticks: { stepSize: 500 },
      },
      x: {
        title: { display: true, text: "Date" },
      },
    },
  },
};

  return (
    <div className="w-full flex flex-col font-dm-sans gap-6 p-4 items-center">
      {/* Health Card */}
      <div className="w-full md:w-[320px] border border-[#7DE07A] bg-gradient-to-br from-[#D0FFCF] to-[#d0ffcf60] rounded-3xl relative overflow-hidden">
        <img src="/home/lungs1.png" alt="Lung" className="absolute -bottom-8 -right-10 w-32 h-32" />
        <div className="px-6 py-4">
          <p className="text-xl font-medium">Lung Health</p>
          <p className="text-3xl font-semibold">{result ? `${result.slope.toFixed(1)} mL/week` : "Stable"}</p>
          <p className="text-xs">{result ? "last updated now" : "last checked 3 days ago"}</p>
          <button onClick={handleOpenModal} className="bg-gradient-to-r from-[#058900] to-[#07bb01] text-white text-sm rounded-full px-4 py-2 mt-4 flex items-center gap-2">
            Check today&apos;s Health <ArrowForwardIcon style={{ fontSize: 18 }} />
          </button>
        </div>
      </div>

      {/* Upload Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-xl shadow-lg p-6 min-w-[320px] max-w-[90vw] flex flex-col items-center">
            <h2 className="text-lg font-bold text-[#0A7CFF] mb-4">Upload Lung Scan</h2>
            <input
              type="number"
              value={fvc}
              onChange={(e) => setFvc(e.target.value)}
              className="w-full p-2 border rounded mb-4"
              placeholder="Current FVC (mL)"
            />
            <div
              className={`w-full flex items-center justify-center border-2 border-dashed rounded-xl ${dragActive ? "border-blue-500 bg-blue-50" : "border-gray-300 bg-gray-50"} min-h-[140px] cursor-pointer`}
              onDragOver={(e) => {
                e.preventDefault();
                setDragActive(true);
              }}
              onDragLeave={(e) => {
                e.preventDefault();
                setDragActive(false);
              }}
              onDrop={(e) => {
                e.preventDefault();
                setDragActive(false);
                if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                  setSelectedFile(e.dataTransfer.files[0]);
                }
              }}
              onClick={() => fileInputRef.current?.click()}
            >
              <input type="file" ref={fileInputRef} className="hidden" onChange={handleFileChange} />
              <p className="text-sm text-gray-600">Drag & drop or click to upload ZIP</p>
            </div>
            <div className="flex gap-4 mt-6">
              <button className="bg-[#0A7CFF] text-white px-4 py-2 rounded" onClick={handleSubmitClick}>
                Submit
              </button>
              <button className="bg-gray-300 text-gray-800 px-4 py-2 rounded" onClick={handleCloseModal}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Chart */}
      {history.length > 0 ? (
        <div className="w-full max-w-4xl mt-6">
          <Line data={generateChartData()} options={chartOptions} />
          <div className="mt-4 text-center text-sm">
            <p>
              <strong>Summary:</strong>{" "}
              {result?.message || "You’re currently stable. Track regularly for updates."}
            </p>
            {criticalWeek !== null && (
              <p className="text-red-500 mt-1">
                ⚠️ Estimated time to reach 1000 mL: <strong>{criticalWeek} weeks</strong>
              </p>
            )}
          </div>
        </div>
      ) : (
        <div className="mt-8 text-center text-gray-500 text-sm">
          <p>Start tracking now to create your lung health graph 📈</p>
        </div>
      )}
    </div>
  );
};

export default Stats;
