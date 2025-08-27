import { useState } from "react";

const YesNoToggle = () => {
  const [selected, setSelected] = useState("No");

  return (
    <div className="inline-flex rounded-lg overflow-hidden text-sm font-medium">
      <button
        onClick={() => setSelected("Yes")}
        className={`px-4 py-2 transition border border-blue-200 ${
          selected === "Yes"
            ? "bg-blue-600 text-white"
            : "bg-white text-gray-700"
        }`}
      >
        Yes
      </button>
      <button
        onClick={() => setSelected("No")}
        className={`px-4 py-2 transition border border-blue-200 ${
          selected === "No"
            ? "bg-blue-600 text-white"
            : "bg-white text-gray-700"
        }`}
      >
        No
      </button>
    </div>
  );
};

export default YesNoToggle;
