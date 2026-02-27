import React, { useState, useEffect, useRef } from "react";
import {
  predictFVC,
  fetchFVCGraphHistory,
} from "../services/predictionService";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { Line } from "react-chartjs-2";
import axios from "axios";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";

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
import { toast } from "react-hot-toast";

Chart.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  annotationPlugin
);

const FvcPrediction = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [fvc, setFvc] = useState("");
  const [result, setResult] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [history, setHistory] = useState([]);
  const [criticalWeek, setCriticalWeek] = useState(null);
  const fileInputRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);

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
      toast.error("Please enter FVC/upload a file!");
      return;
    }

    const formData = new FormData();
    formData.append("ct_scan", selectedFile);
    formData.append("fvc", fvc);
    formData.append("email", email);

    try {
      setIsLoading(true);
      const response = await predictFVC(formData);
      setResult(response.data);
      fetchHistory();
      toast.success("Prediction successful!");
      setIsLoading(false);
    } catch (error) {
      toast.error(error.response?.data?.error || "Prediction failed");
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
          const weeks = Math.max(
            0,
            Math.floor((latest.fvc - 1000) / Math.abs(slope))
          );
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
      new Date(h.timestamp).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
      })
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
      projectedLabels.push(
        projectedDate.toLocaleDateString("en-IN", {
          day: "2-digit",
          month: "short",
        })
      );
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

  const renderFormattedMessage = (msg) => {
    if (!msg) return null;

    const lines = msg.split("\n").filter((line) => line.trim() !== "");
    return lines.map((line, i) => {
      if (
        line.startsWith("🌟") ||
        line.startsWith("🔄") ||
        line.startsWith("⚠️")
      ) {
        return (
          <h3 key={i} className="text-lg font-semibold text-[#0A7CFF] mt-4">
            {line}
          </h3>
        );
      } else if (
        line.startsWith("🩺") ||
        line.startsWith("🫁") ||
        line.startsWith("🚨")
      ) {
        return (
          <h4 key={i} className="text-base font-semibold mt-3">
            {line}
          </h4>
        );
      } else if (line.startsWith("-")) {
        return (
          <li key={i} className="ml-6 list-disc text-sm text-gray-700">
            {line.slice(1).trim()}
          </li>
        );
      } else {
        return (
          <p key={i} className="text-sm text-gray-800 mt-2">
            {line}
          </p>
        );
      }
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F7F9FC]">
      <Navbar />

      <main className="flex-1 w-full px-4 md:px-8 py-8">
        <div className="max-w-7xl mx-auto flex flex-col font-dm-sans gap-6 items-center"></div>
    <div className="w-full flex flex-col font-dm-sans gap-6 p-4 items-center">
      {/* Health Card */}
      <div className="w-full md:w-[320px] border border-[#7DE07A] bg-gradient-to-br from-[#D0FFCF] to-[#d0ffcf60] rounded-3xl relative overflow-hidden">
        <img
          src="/home/lungs1.png"
          alt="Lung"
          className="absolute -bottom-8 -right-10 w-32 h-32"
        />
        <div className="px-6 py-4">
          <p className="text-xl font-medium">Lung Health</p>
          <p className="text-3xl font-semibold">
            {result ? `${result.slope.toFixed(1)} mL/week` : "Stable"}
          </p>
          <p className="text-xs">
            {result ? "last updated now" : "last checked 3 days ago"}
          </p>
          <button
            onClick={handleOpenModal}
            className="bg-gradient-to-r cursor-pointer from-[#058900] to-[#07bb01] text-white text-sm rounded-full px-4 py-2 mt-4 flex items-center gap-2"
          >
            Check today&apos;s Health{" "}
            <ArrowForwardIcon style={{ fontSize: 18 }} />
          </button>
        </div>
      </div>

      {/* Upload Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-xl shadow-lg p-6 min-w-[320px] max-w-[90vw] flex flex-col items-center">
            <h2 className="text-lg font-bold text-[#0A7CFF] mb-4">
              Upload Lung Scan
            </h2>
            <input
              type="number"
              value={fvc}
              onChange={(e) => setFvc(e.target.value)}
              className="w-full p-2 border rounded mb-4"
              placeholder="Current FVC (mL)"
            />
            <div
              className={`w-full flex flex-col items-center justify-center border-2 border-dashed rounded-xl ${
                dragActive
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-300 bg-gray-50"
              } min-h-[140px] cursor-pointer`}
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
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                onChange={handleFileChange}
              />
              <p className="text-sm text-gray-600">
                Drag & drop or click to upload ZIP
              </p>
              {selectedFile && (
                <div className="flex flex-col items-center gap-2 mt-2 p-2">
                  <CheckCircleIcon style={{ color: "#4caf50" }} />
                  <span className="text-xs text-green-700 font-medium">
                    {selectedFile.name}
                  </span>
                </div>
              )}
            </div>
            <div className="flex gap-4 ">
              {isLoading ? (
                <div className="inline-block w-6 h-6 border-4 mt-6 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <div className="flex gap-4 mt-6">
                  <button
                    className="bg-[#0A7CFF] cursor-pointer text-white px-4 py-2 rounded"
                    onClick={handleSubmitClick}
                  >
                    Submit
                  </button>
                  <button
                    className="bg-gray-300 cursor-pointer  text-gray-800 px-4 py-2 rounded"
                    onClick={handleCloseModal}
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Chart */}
      {history.length > 0 ? (
        <div className="w-full max-w-4xl bg-white mt-6">
          <Line data={generateChartData()} options={chartOptions} />
          <div className="mt-6 p-4 border border-gray-300 rounded-xl bg-white w-full max-w-4xl">
            <h3 className="text-lg font-bold text-[#0A7CFF] mb-2">
              📋 Lung Health Report
            </h3>
            {result?.message ? (
              <div className="space-y-1">
                {renderFormattedMessage(result.message)}
              </div>
            ) : (
              <p className="text-gray-500">
                You’re currently stable. Track regularly for updates.
              </p>
            )}
            {criticalWeek !== null && (
              <p className="text-red-500 mt-4 font-medium">
                ⚠️ Estimated time to reach 1000 mL:{" "}
                <strong>{criticalWeek} weeks</strong>
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
      </main>

      <Footer />
    </div>
  );
};
export default FvcPrediction;