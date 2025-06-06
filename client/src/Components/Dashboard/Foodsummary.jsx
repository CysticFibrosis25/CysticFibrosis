import { useState } from "react";

const initialBreakfast = [
  "Peanut Butter Banana Toast - 450 kcal",
  "Greek Yogurt Parfait - 300 kcal",
  "Avocado Toast - 350 kcal",
];

const initialLunch = [
  "Grilled Chicken Salad - 520 kcal",
  "Quinoa Vegetable Bowl - 480 kcal",
];

const initialDinner = [
  "Baked Salmon - 600 kcal",
  "Stir-fry Vegetables with Tofu - 520 kcal",
];

const initialSnacks = [
  "Mixed Nuts - 180 kcal",
  "Apple with Peanut Butter - 220 kcal",
  "Protein Bar - 200 kcal",
];

const Foodsummary = () => {
  const [breakfast, setBreakfast] = useState(initialBreakfast);
  const [lunch, setLunch] = useState(initialLunch);
  const [dinner, setDinner] = useState(initialDinner);
  const [snacks, setSnacks] = useState(initialSnacks);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState("");
  const [newFoodItem, setNewFoodItem] = useState("");

  const handleAddItem = (type) => {
    setModalType(type);
    setNewFoodItem("");
    setModalOpen(true);
  };

  const handleDeleteItem = (type, index) => {
    switch (type) {
      case "breakfast":
        setBreakfast(breakfast.filter((_, i) => i !== index));
        break;
      case "lunch":
        setLunch(lunch.filter((_, i) => i !== index));
        break;
      case "dinner":
        setDinner(dinner.filter((_, i) => i !== index));
        break;
      case "snacks":
        setSnacks(snacks.filter((_, i) => i !== index));
        break;
      default:
        break;
    }
  };

  const handleSaveItem = () => {
    if (newFoodItem.trim()) {
      switch (modalType) {
        case "breakfast":
          setBreakfast([...breakfast, newFoodItem]);
          break;
        case "lunch":
          setLunch([...lunch, newFoodItem]);
          break;
        case "dinner":
          setDinner([...dinner, newFoodItem]);
          break;
        case "snacks":
          setSnacks([...snacks, newFoodItem]);
          break;
        default:
          break;
      }
      setModalOpen(false);
    }
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  return (
    <div className="w-full md:max-w-[90%] mx-auto py-6 mt-2">
      <h2 className="text-2xl md:text-3xl font-medium text-center text-black font-dm-sans tracking-tighter">
        Food Summary
      </h2>
      <div className="flex flex-col md:flex-row items-center justify-center p-4 font-dm-sans tracking-tight">
        <div className="flex flex-col border items-center border-gray-300 rounded-3xl p-4 m-2 min-w-[250px] w-full md:w-1/4 h-[400px]">
          <p className="border-b text-center w-full mb-4 py-2 text-lg font-medium">
            Breakfast
          </p>
          <div className="w-full h-[300px] overflow-y-auto pr-1">
            {breakfast.map((item, index) => (
              <div
                key={index}
                className="bg-[#AFDDFF] mb-3 rounded-full px-4 py-2 flex justify-between items-center"
              >
                <span className="flex-1 pr-2">{item}</span>
                <button
                  onClick={() => handleDeleteItem("breakfast", index)}
                  className="text-gray-600 cursor-pointer hover:text-red-500 font-bold"
                >
                  x
                </button>
              </div>
            ))}
            <button
              className="border text-xl cursor-pointer rounded-full w-full px-4 py-1 mt-1 hover:bg-gray-100"
              onClick={() => handleAddItem("breakfast")}
            >
              +
            </button>
          </div>
        </div>

        <div className="flex flex-col border items-center border-gray-300 rounded-3xl p-4 m-2 min-w-[250px] w-full md:w-1/4 h-[400px]">
          <p className="border-b text-center w-full mb-4 py-2 text-lg font-medium">
            Lunch
          </p>
          <div className="w-full h-[300px] overflow-y-auto pr-1">
            {lunch.map((item, index) => (
              <div
                key={index}
                className="bg-[#E0DE7A] mb-3 rounded-full px-4 py-2 flex justify-between items-center"
              >
                <span className="flex-1 pr-2">{item}</span>
                <button
                  onClick={() => handleDeleteItem("lunch", index)}
                  className="text-gray-600 cursor-pointer hover:text-red-500 font-bold"
                >
                  x
                </button>
              </div>
            ))}
            <button
              className="border text-xl cursor-pointer rounded-full w-full px-4 py-1 mt-1 hover:bg-gray-100"
              onClick={() => handleAddItem("lunch")}
            >
              +
            </button>
          </div>
        </div>

        <div className="flex flex-col border items-center border-gray-300 rounded-3xl p-4 m-2 min-w-[250px] w-full md:w-1/4 h-[400px]">
          <p className="border-b text-center w-full mb-4 py-2 text-lg font-medium">
            Dinner
          </p>
          <div className="w-full h-[300px] overflow-y-auto pr-1">
            {dinner.map((item, index) => (
              <div
                key={index}
                className="bg-[#7AE0AD] mb-3 rounded-full px-4 py-2 flex justify-between items-center"
              >
                <span className="flex-1 pr-2">{item}</span>
                <button
                  onClick={() => handleDeleteItem("dinner", index)}
                  className="text-gray-600 cursor-pointer hover:text-red-500 font-bold"
                >
                  x
                </button>
              </div>
            ))}
            <button
              className="border text-xl cursor-pointer rounded-full w-full px-4 py-1 mt-1 hover:bg-gray-100"
              onClick={() => handleAddItem("dinner")}
            >
              +
            </button>
          </div>
        </div>

        <div className="flex flex-col border items-center border-gray-300 rounded-3xl p-4 m-2 min-w-[250px] w-full md:w-1/4 h-[400px]">
          <p className="border-b text-center w-full mb-4 py-2 text-lg font-medium">
            Snacks and Extras
          </p>
          <div className="w-full h-[300px] overflow-y-auto pr-1">
            {snacks.map((item, index) => (
              <div
                key={index}
                className="bg-[#7A97E0] mb-3 rounded-full px-4 py-2 flex justify-between items-center"
              >
                <span className="flex-1 pr-2">{item}</span>
                <button
                  onClick={() => handleDeleteItem("snacks", index)}
                  className="text-gray-600 cursor-pointer hover:text-red-500 font-bold"
                >
                  x
                </button>
              </div>
            ))}
            <button
              className="border text-xl cursor-pointer rounded-full w-full px-4 py-1 mt-1 hover:bg-gray-100"
              onClick={() => handleAddItem("snacks")}
            >
              +
            </button>
          </div>
        </div>
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-3xl  p-6 min-w-[300px] max-w-[90vw]">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold text-[#0A7CFF]">
                Add {modalType.charAt(0).toUpperCase() + modalType.slice(1)}{" "}
                Item
              </h2>
              <button
                onClick={handleCloseModal}
                className="text-black cursor-pointer hover:text-[#0A7CFF] text-2xl font-bold"
              >
                x
              </button>
            </div>
            <form
              className="flex flex-col gap-3"
              onSubmit={(e) => {
                e.preventDefault();
                handleSaveItem();
              }}
            >
              <input
                className="border rounded-full px-3 py-2"
                placeholder="Food item with calories (e.g. Toast - 200 kcal)"
                value={newFoodItem}
                onChange={(e) => setNewFoodItem(e.target.value)}
              />
              <button
                type="submit"
                className="bg-[#0A7CFF] text-white rounded-full px-4 py-2 mt-2 hover:bg-[#005DE0]"
              >
                Add
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Foodsummary;
