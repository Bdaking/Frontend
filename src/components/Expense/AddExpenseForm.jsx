import React, { useState } from "react";
import Input from "../Inputs/Input";
import EmojiPickerPopup from "../EmojiPickerPopup";

const AddExpenseForm = ({ onAddExpense }) => {
  const [expense, setExpense] = useState({
    category: "",
    amount: "",
    date: "",
    icon: "",
  });

  const handleChange = (key, value) => setExpense({ ...expense, [key]: value });

  return (
    <div className="p-1 relative">
      {" "}
      {/* Added relative positioning */}
      {/* Emoji Picker Section - Make it stand out */}
      <div className="mb-6 relative z-50">
        {" "}
        {/* Added high z-index and margin */}
        <EmojiPickerPopup
          icon={expense.icon}
          onSelect={(selectedIcon) => handleChange("icon", selectedIcon)}
        />
      </div>
      <div className="space-y-4">
        {" "}
        {/* Increased spacing */}
        <Input
          value={expense.category}
          onChange={({ target }) => handleChange("category", target.value)}
          label="I hmanna (Money spend on)"
          placeholder="Thlai,Bungrua,Eitur etc"
          type="text"
        />
        <Input
          value={expense.amount}
          onChange={({ target }) => handleChange("amount", target.value)}
          label="Pawisa hman zat (Amount)"
          placeholder="₹0"
          type="number"
        />
        <Input
          value={expense.date}
          onChange={({ target }) => handleChange("date", target.value)}
          label="Date"
          placeholder=""
          type="date"
        />
      </div>
      <div className="flex justify-end mt-8">
        <button
          type="button"
          className="bg-violet-600 hover:bg-violet-700 text-white px-6 py-3 rounded-lg font-semibold shadow-md active:scale-95 transition-all w-full md:w-auto"
          onClick={() => onAddExpense(expense)}
        >
          Add Expense
        </button>
      </div>
    </div>
  );
};

export default AddExpenseForm;
