import React, { useState, useEffect } from "react";
import EditIcon from "@mui/icons-material/Edit";
import axios from "axios";
import DeleteIcon from "@mui/icons-material/Delete";
import { motion } from "framer-motion";

const Userdetais = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState(null);
  const [profile, setProfile] = useState({});
  const [remainders, setRemainders] = useState([]);
  const [editProfile, setEditProfile] = useState({});
  const [newRemainder, setNewRemainder] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const API_BASE_URL =
    import.meta.env.VITE_REACT_APP_BACKEND_URL || "https://localhost:5000";

  useEffect(() => {
    const fetchUserData = async () => {
      setIsLoading(true);
      try {
        const email = localStorage.getItem("email");
        if (!email) {
          console.error("Email is missing — user not logged in?");
          setIsLoading(false);
          return;
        }
        const response = await axios.get(
          `${API_BASE_URL}/auth/user/details?email=${email}`
        );
        setProfile(response.data);
        setRemainders(response.data.reminders);
        setEditProfile(response.data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [API_BASE_URL]);

  const handleOpenModal = (type) => {
    setModalType(type);
    if (type === "edit") setEditProfile(profile);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setModalType(null);
    setNewRemainder("");
  };

  const handleProfileChange = (e) => {
    setEditProfile({ ...editProfile, [e.target.name]: e.target.value });
  };

  const handleProfileSave = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const email = localStorage.getItem("email");
      await axios.put(`${API_BASE_URL}/auth/user/update`, {
        ...editProfile,
        email,
      });
      setProfile(editProfile);
      handleCloseModal();
    } catch (error) {
      console.error("Error saving profile:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleRemainderAdd = async (e) => {
    e.preventDefault();
    if (newRemainder.trim()) {
      setIsSaving(true);
      try {
        const email = localStorage.getItem("email");
        await axios.post(`${API_BASE_URL}/auth/user/reminders`, {
          email,
          reminder: newRemainder,
        });
        setRemainders([newRemainder, ...remainders]);
        setNewRemainder("");
        handleCloseModal();
      } catch (error) {
        console.error("Error adding reminder:", error);
      } finally {
        setIsSaving(false);
      }
    }
  };

  const handleRemainderDelete = async (reminder) => {
    const email = localStorage.getItem("email");
    await axios.delete(`${API_BASE_URL}/auth/user/reminders`, {
      data: { email, reminder },
    });
    setRemainders(remainders.filter((r) => r !== reminder));
  };

  return (
    <div className="w-[95%] md:w-[70%] flex md:flex-row flex-col gap-3 mx-auto mt-4 mb-2">
      {isLoading ? (
        <div className="w-full flex justify-center items-center py-16">
          <div className="flex space-x-2">
            <div className="w-2 h-2 bg-[#0A7CFF] rounded-full animate-bounce [animation-delay:-0.3s]"></div>
            <div className="w-2 h-2 bg-[#0A7CFF] rounded-full animate-bounce [animation-delay:-0.15s]"></div>
            <div className="w-2 h-2 bg-[#0A7CFF] rounded-full animate-bounce"></div>
          </div>
        </div>
      ) : (
        <>
          <motion.div
            className="flex flex-row border border-[#BDC0C2] rounded-full font-dm-sans items-center w-full"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className="p-2 flex-shrink-0">
              <img
                src="/dashboard/profile.jpeg"
                alt="Profile"
                className="md:w-32 md:h-32 w-28 h-28 rounded-full mx-auto object-cover"
              />
            </div>
            <div className="items-start justify-center flex-1 min-w-0">
              <div className="flex flex-col items-start justify-center text-xs md:text-sm font-medium tracking-tighter gap-2 p-4 min-w-0">
                <p className="truncate w-full">{profile.name}</p>
                <p className="truncate w-full">{profile.email}</p>
                <p className="truncate w-full">{profile.phone}</p>
                <div className="flex flex-row items-center gap-4 w-full">
                  <p>Age: {profile.age} yrs</p>
                  <p>Weight: {profile.weight} kg</p>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-center pr-8 h-full">
              <button
                className="bg-[#0A7CFF] text-white rounded-full font-semibold tracking-tight hover:bg-[#005DE0] transition duration-300 flex items-center justify-center h-[100px] w-8 text-2xl"
                style={{ minHeight: "2rem" }}
                onClick={() => handleOpenModal("edit")}
              >
                <EditIcon style={{ fontSize: 20 }} />
              </button>
            </div>
          </motion.div>
          <motion.div
            className="flex flex-row border border-[#BDC0C2] rounded-full font-dm-sans items-center w-full mx-auto h-[150px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className="flex-1 flex flex-col justify-center gap-1 px-4 ">
              <p className="font-bold text-sm text-[#000] pl-6">Reminders</p>
              <div className="list-disc ml-4 max-h-24 text-black overflow-y-auto">
                {remainders && remainders.length > 0 ? (
                  remainders.map((reminder, index) => (
                    <div
                      key={index}
                      className="bg-[#7ADBE0] px-4 py-2 max-w-[95%] text-xs md:text-sm rounded-full mb-2 flex justify-between"
                    >
                      {reminder}
                      <button onClick={() => handleRemainderDelete(reminder)}>
                        <DeleteIcon
                          style={{ fontSize: 18, color: "#FF3131" }}
                        />
                      </button>
                    </div>
                  ))
                ) : (
                  <div className="text-gray-500 italic text-center py-2">
                    No reminders set!
                  </div>
                )}
              </div>
            </div>
            <div className="flex items-center justify-center px-8 h-full">
              <button
                className="bg-[#0A7CFF] text-white rounded-full font-semibold tracking-tight hover:bg-[#005DE0] transition duration-300 flex items-center justify-center h-[100px] w-8 text-2xl"
                onClick={() => handleOpenModal("add")}
              >
                +
              </button>
            </div>
          </motion.div>
        </>
      )}
      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white/90 backdrop-blur-3xl rounded-4xl shadow-lg p-6 min-w-[300px] max-w-[90vw]">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold text-[#0A7CFF]">
                {modalType === "edit" ? "Edit Profile" : "Add Remainder"}
              </h2>
              <button
                onClick={handleCloseModal}
                className="text-gray-500 hover:text-[#0A7CFF] text-2xl font-bold"
              >
                &times;
              </button>
            </div>
            {modalType === "edit" ? (
              <form
                className="flex flex-col gap-3"
                onSubmit={handleProfileSave}
              >
                <input
                  className="border rounded-full px-3 py-2"
                  placeholder="Name"
                  name="name"
                  value={editProfile.name}
                  onChange={handleProfileChange}
                />
                <input
                  className="border rounded-full px-3 py-2"
                  placeholder="Email"
                  name="email"
                  value={editProfile.email}
                  onChange={handleProfileChange}
                />
                <input
                  className="border rounded-full px-3 py-2"
                  placeholder="Phone"
                  name="phone"
                  value={editProfile.phone}
                  onChange={handleProfileChange}
                />
                <div className="flex gap-2">
                  <input
                    className="border rounded-full px-3 py-2 w-1/2"
                    placeholder="Age"
                    name="age"
                    value={editProfile.age}
                    onChange={handleProfileChange}
                  />
                  <input
                    className="border rounded-full px-3 py-2 w-1/2"
                    placeholder="Weight"
                    name="weight"
                    value={editProfile.weight}
                    onChange={handleProfileChange}
                  />
                </div>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="bg-[#0A7CFF] text-white rounded-full px-4 py-2 mt-2 hover:bg-[#005DE0] flex items-center justify-center"
                >
                  {isSaving ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Saving...
                    </>
                  ) : (
                    "Save"
                  )}
                </button>
              </form>
            ) : (
              <form
                className="flex flex-col gap-3"
                onSubmit={handleRemainderAdd}
              >
                <input
                  className="border rounded-full px-3 py-2"
                  placeholder="Remainder details..."
                  value={newRemainder}
                  onChange={(e) => setNewRemainder(e.target.value)}
                />
                <button
                  type="submit"
                  disabled={isSaving}
                  className="bg-[#0A7CFF] text-white rounded-full px-4 py-2 mt-2 hover:bg-[#005DE0] flex items-center justify-center"
                >
                  {isSaving ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Adding...
                    </>
                  ) : (
                    "Add"
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Userdetais;
