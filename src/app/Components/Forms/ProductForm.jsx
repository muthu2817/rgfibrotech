import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { setFormOpen } from "@/app/store/slices/getPageDetailsSlice";
import InputField from "./FormComponents/Input";
import Dropdown from "./FormComponents/DropDown";
import Popup from "../Popup";

const initialFormState = {
  general: {
    partName: "",
    partNumber: "",
    description: "",
    stock: ""
  },
  bom: {
    bomCode: "",
    bomDescription: "",
  },
  consumable: {
    consumableName: "",
    consumableQty: "",
  },
};

const ProductForm = ({ setRefresh,isFormOpen }) => {
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState("general");
  const [form, setForm] = useState(initialFormState);
  const [errors, setErrors] = useState({});

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    setErrors({});
  };

  const handleNext = () => {
    if (activeTab === "general") {
      setActiveTab("bom");
    } else if (activeTab === "bom") {
      setActiveTab("consumable");
    }
  };

  const handleBack = () => {
    if (activeTab === "consumable") {
      setActiveTab("bom");
    } else if (activeTab === "bom") {
      setActiveTab("general");
    }
  };

  const isLastStep = activeTab === "consumable";

  const handleChange = (section, field, value) => {
    setForm((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
  };

  // Validate all fields, not just the active tab
  const validate = () => {
    let newErrors = {};
    // General
    const { partName, partNumber, description, stock, minStock, maxStock } = form.general;
    if (!partName) newErrors.partName = "Part Name is required";
    if (!partNumber) newErrors.partNumber = "Part Number is required";
    if (!description) newErrors.description = "Description is required";
    if (!stock) newErrors.stock = "Stock is required";
    if (!minStock) newErrors.minStock = "Min Stock is required";
    if (!maxStock) newErrors.maxStock = "Max Stock is required";
    // BOM
    const { bomCode, bomDescription } = form.bom;
    if (!bomCode) newErrors.bomCode = "BOM Code is required";
    if (!bomDescription) newErrors.bomDescription = "BOM Description is required";
    // Consumable
    const { consumableName, consumableQty } = form.consumable;
    if (!consumableName) newErrors.consumableName = "Consumable Name is required";
    if (!consumableQty) newErrors.consumableQty = "Consumable Quantity is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      // Submit logic here
      alert("Form submitted successfully!");
    }
  };

  // const handleCancel = () => {
  //   dispatch(setFormOpen(false));
  // };

  return (
    <>
    <Popup
    isOpen={isFormOpen}
    onClose={() => dispatch(setFormOpen(false))}
    title="Create Product"
    showCloseButton={true}
    overlayClickToClose={true}
    formName="ProductForm"
    size='full'
    onCancel={isLastStep ? () => dispatch(setFormOpen(false)) : handleBack}
    onSubmit={isLastStep ? handleSubmit : handleNext}
    cancelButtonText={isLastStep ? 'Cancel' : 'Back'}
    submitButtonText={isLastStep ? "Create" : "Next"}
    >
      <form id="ProductForm" onSubmit={handleSubmit} className="relative min-h-[60vh]">
        <div className="flex flex-row">
          <div className="cursor-pointer border-r border-gray-300 flex flex-col h-[50vh] gap-y-4 p-4 text-sm text-gray-700 justify-start align-start min-w-[200px]">
            <button
              type="button"
              className={`text-left cursor-pointer px-2 py-2 rounded ${activeTab === "general" ? "text-blue-800 font-semibold" : ""}`}
              onClick={() => handleTabClick("general")}
            >
              General Information
            </button>
            <button
              type="button"
              className={`text-left cursor-pointer px-2 py-2 rounded ${activeTab === "bom" ? "text-blue-800 font-semibold" : ""}`}
              onClick={() => handleTabClick("bom")}
            >
              BOM Information
            </button>
            <button
              type="button"
              className={`text-left cusrsor-pointer px-2 py-2 rounded ${activeTab === "consumable" ? "text-blue-800 font-semibold" : ""}`}
              onClick={() => handleTabClick("consumable")}
            >
              Consumable Information
            </button>
          </div>
          <div className="flex-1 p-6 pb-24 text-sm">
            {activeTab === "general" && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                <InputField
                  ItemName="Part Name"
                  type="text"
                  value={form.general.partName}
                  onChange={(e) => handleChange("general", "partName", e.target.value)}
                  error={errors.partName}
                  name="partName"
                  placeholder="Enter Part Name"
                />
                <InputField
                  ItemName="Part Number"
                  type="text"
                  value={form.general.partNumber}
                  onChange={(e) => handleChange("general", "partNumber", e.target.value)}
                  error={errors.partNumber}
                  name="partNumber"
                  placeholder="Enter Part Number"
                />
                <InputField
                  ItemName="Description"
                  type="text"
                  value={form.general.description}
                  onChange={(e) => handleChange("general", "description", e.target.value)}
                  error={errors.description}
                  name="description"
                  placeholder="Description"
                />
                <InputField
                  ItemName="Stock"
                  type="number"
                  value={form.general.stock}
                  onChange={(e) => handleChange("general", "stock", e.target.value)}
                  error={errors.stock}
                  name="stock"
                  placeholder="Stock Details"
                />
                
              </div>
            )}
            {activeTab === "bom" && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                <InputField
                  ItemName="BOM Code"
                  type="text"
                  value={form.bom.bomCode}
                  onChange={(e) => handleChange("bom", "bomCode", e.target.value)}
                  error={errors.bomCode}
                  name="bomCode"
                  placeholder="BOM Code"
                />
                <InputField
                  ItemName="BOM Description"
                  type="text"
                  value={form.bom.bomDescription}
                  onChange={(e) => handleChange("bom", "bomDescription", e.target.value)}
                  error={errors.bomDescription}
                  name="bomDescription"
                  placeholder="BOM Description"
                />
              </div>
            )}
            {activeTab === "consumable" && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                <InputField
                  ItemName="Consumable Name"
                  type="text"
                  value={form.consumable.consumableName}
                  onChange={(e) => handleChange("consumable", "consumableName", e.target.value)}
                  error={errors.consumableName}
                  name="consumableName"
                  placeholder="Part Name"
                />
                <InputField
                  ItemName="Consumable Quantity"
                  type="number"
                  value={form.consumable.consumableQty}
                  onChange={(e) => handleChange("consumable", "consumableQty", e.target.value)}
                  error={errors.consumableQty}
                  name="consumableQty"
                  placeholder="Description"
                />
              </div>
            )}
          </div>
        </div>
        {/* Action buttons removed - handled by popup */}
      </form>
      </Popup>
    </>
  );
};

export default ProductForm;