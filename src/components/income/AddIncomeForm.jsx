import React, { useState } from "react";
import Input from "../Inputs/Input";
import EmojiPickerPopup from "../EmojiPickerPopup";

const AddIncomeForm = ({ onAddIncome }) => {
  const [income, setIncome] = useState({
    source: "",
    amount: "",
    date: "",
    icon: "",
  });

  const handleChange = (key, value) => setIncome({ ...income, [key]: value });

  return (
    <div className="p-1">
      {" "}
      {/* Slight padding to prevent edge clipping */}
      <EmojiPickerPopup
        icon={income.icon}
        onSelect={(selectedIcon) => handleChange("icon", selectedIcon)}
      />
      <div className="space-y-1">
        {" "}
        {/* Consistent spacing between inputs */}
        <Input
          value={income.source}
          onChange={({ target }) => handleChange("source", target.value)}
          label="Pawisa lakluh na (Income source)"
          placeholder="Inhlawhna,Thil hralhna etc"
          type="text"
        />
        <Input
          value={income.amount}
          onChange={({ target }) => handleChange("amount", target.value)}
          label="Pawisa lut zat (Amount)"
          placeholder="₹0"
          type="number"
        />
        <Input
          value={income.date}
          onChange={({ target }) => handleChange("date", target.value)}
          label="Date"
          placeholder=""
          type="date"
        />
      </div>
      <div className="flex justify-end mt-8">
        <button
          type="button"
          // Added higher contrast colors and shadow for better visibility
          className="bg-violet-600 hover:bg-violet-700 text-white px-6 py-3 rounded-lg font-semibold shadow-md active:scale-95 transition-all w-full md:w-auto"
          onClick={() => onAddIncome(income)}
        >
          Add Income
        </button>
      </div>
    </div>
  );
};

export default AddIncomeForm;
