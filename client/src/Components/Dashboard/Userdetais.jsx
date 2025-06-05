import React, { useState } from "react";
import EditIcon from "@mui/icons-material/Edit";

const Userdetais = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState(null);
  const [profile, setProfile] = useState({
    name: "B V Vivek",
    email: "vivek@example.com",
    phone: 9606307685,
    age: "17",
    weight: "60 kg",
  });
  const [remainders, setRemainders] = useState([
    "Take morning pills at 8:00 AM",
    "Inhaler at 12:00 PM",
    "Enzyme supplement at lunch",
    "Evening pills at 8:00 PM",
  ]);
  const [editProfile, setEditProfile] = useState(profile);
  const [newRemainder, setNewRemainder] = useState("");

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
  const handleProfileSave = (e) => {
    e.preventDefault();
    setProfile(editProfile);
    handleCloseModal();
  };
  const handleRemainderAdd = (e) => {
    e.preventDefault();
    if (newRemainder.trim()) {
      setRemainders([newRemainder, ...remainders]);
      setNewRemainder("");
      handleCloseModal();
    }
  };

  return (
    <div className="w-[95%] md:w-[70%] flex md:flex-row flex-col gap-3 mx-auto mt-4 mb-2">
      <div className="flex flex-row border border-[#BDC0C2] rounded-full font-dm-sans items-center w-full">
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
              <p>Age: {profile.age}</p>
              <p>Weight: {profile.weight}</p>
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
      </div>
      {/* Remainders*/}
      <div className="flex flex-row border  border-[#BDC0C2] rounded-full font-dm-sans items-center w-full max-w-[500px] mx-auto h-[150px]">
        <div className="flex-1 flex flex-col justify-center gap-1 p-4 ">
          <p className="font-bold text-sm text-[#000] pl-6">Remainders</p>
          <div className="list-disc ml-4 max-h-20 text-black overflow-y-auto">
            {remainders.map((reminder, index) => (
              <div
                key={index}
                className="bg-[#7ADBE0] px-4 py-2 max-w-[95%] text-xs md:text-sm rounded-full mb-2"
              >
                {reminder}
              </div>
            ))}
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
      </div>
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
                  className="bg-[#0A7CFF] text-white rounded-full px-4 py-2 mt-2 hover:bg-[#005DE0]"
                >
                  Save
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
                  className="bg-[#0A7CFF] text-white rounded-full px-4 py-2 mt-2 hover:bg-[#005DE0]"
                >
                  Add
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
