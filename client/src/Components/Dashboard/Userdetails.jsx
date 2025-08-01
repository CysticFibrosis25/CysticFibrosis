import React, { useState, useEffect } from "react";
import EditIcon from "@mui/icons-material/Edit";
import axios from "axios";
import DeleteIcon from "@mui/icons-material/Delete";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";

const Userdetails = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState(null);
  const [profile, setProfile] = useState({});
  const [remainders, setRemainders] = useState([]);
  const [editProfile, setEditProfile] = useState({});
  const [newRemainder, setNewRemainder] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [profileImage, setProfileImage] = useState(null);

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
        toast.success("User data fetched successfully!");
      } catch (error) {
        console.error("Error fetching user data:", error);
        toast.error("Failed to fetch user data.");
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
      toast.success("Profile updated successfully!");
      handleCloseModal();
    } catch (error) {
      console.error("Error saving profile:", error);
      toast.error("Failed to save profile.");
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
        toast.success("Reminder added successfully!");
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
    toast.success("Reminder deleted successfully!");
  };

  return (
    <div className="w-[95%] md:w-[70%] flex md:flex-row flex-col gap-2 mx-auto mt-4 mb-2">
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
            className="flex flex-row border border-[#BDC0C2] backdrop-blur-lg rounded-full font-dm-sans items-center w-full"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className="p-2 flex-shrink-0 ">
              <img
                src={
                  profile?.profile_image
                    ? `data:image/jpeg;base64,${profile.profile_image}`
                    : "dashboard/default-user.png"
                }
                alt="User Profile"
                className="md:w-32 md:h-32 w-24 h-24 rounded-full mx-auto object-cover"
              />
            </div>
            <div className="items-start justify-center flex-1 min-w-0">
              <div className="flex flex-col items-start justify-center text-xs md:text-sm font-medium tracking-tighter gap-2 p-4 min-w-0">
                <p className="truncate w-full">{profile.name}</p>
                <p className="truncate w-full">{profile.email}</p>
                <p className="truncate w-full">{profile.phone}</p>
                <div className="flex flex-row items-center gap-4 w-full">
                  <p className="">Age: {profile.age} yrs</p>
                  <p className="">Weight: {profile.weight} kg</p>
                  <p className="">Sex: {profile.sex}</p>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-center pr-8 h-full">
              <button
                className="bg-[#0A7CFF] text-white rounded-full font-semibold tracking-tight hover:bg-[#005DE0] transition duration-300 flex items-center justify-center h-[80px] md:h-[100px] w-8 text-2xl"
                style={{ minHeight: "2rem" }}
                onClick={() => handleOpenModal("edit")}
              >
                <EditIcon style={{ fontSize: 20 }} />
              </button>
            </div>
          </motion.div>
          <motion.div
            className="flex flex-row border border-[#BDC0C2] backdrop-blur-lg rounded-full font-dm-sans items-center w-full mx-auto h-[140px] md:h-[150px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className="flex-1 flex flex-col gap-1 px-2 ">
              <p className="font-medium text-sm text-[#000] pl-10 mb-2 ">
                Reminders ({remainders.length})
              </p>
              <div className="list-disc ml-4 max-h-20 text-black overflow-y-auto">
                {remainders && remainders.length > 0 ? (
                  remainders.map((reminder, index) => (
                    <div
                      key={index}
                      className="bg-[#c4ebf9] px-4 py-2 max-w-[95%] text-xs md:text-sm rounded-full mb-2 flex justify-between"
                    >
                      {reminder}
                      <button
                        onClick={() => handleRemainderDelete(reminder)}
                        className="bg-white/80 rounded-full cursor-pointer items-center justify-center h-5 w-5"
                      >
                        <DeleteIcon
                          style={{ fontSize: 14, color: "#FF3131" }}
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
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onloadend = () => {
                        // Store only base64 content after comma
                        setEditProfile({
                          ...editProfile,
                          profile_image: reader.result.split(",")[1],
                        });
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                />

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
                  className="bg-gradient-to-r from-[#0A7CFF] to-[#260AFF] text-white rounded-full px-4 py-2 mt-2 hover:from-[#005DE0] hover:to-[#260AFF] flex items-center justify-center font-semibold shadow-md"
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

export default Userdetails;
