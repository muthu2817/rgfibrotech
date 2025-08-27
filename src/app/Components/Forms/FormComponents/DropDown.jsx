import React from "react";
import Select from "react-select";

const Dropdown = ({
  label,
  options = [],
  placeholder = "Select an option",
  value,
  onChange,
  name
}) => {
  // Transform options to react-select format
  const selectOptions = options.map((option) => ({
    value: option.id,
    label: option.displayName || option.name
  }));

  // Find the selected option
  const selectedOption = selectOptions.find(option => option.value === value);

  // Handle change
  const handleChange = (selectedOption) => {
    onChange({
      target: {
        value: selectedOption ? selectedOption.value : ""
      }
    });
  };

  // Custom styles to match the existing design
  const customStyles = {
    control: (provided, state) => ({
      ...provided,
      width: '200px',
      border: '1px solid #e5e7eb',
      borderRadius: '6px',
      padding: '1px 15px',
      minHeight: '40px',
      '&:hover': {
        border: '1px solid #e5e7eb'
      },
      '&:focus-within': {
        border: '1px solid #3b82f6',
        outline: 'none',
        boxShadow: '0 0 0 3px rgba(59, 130, 246, 0.1)'
      }
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected ? '#3b82f6' : state.isFocused ? '#f3f4f6' : 'white',
      color: state.isSelected ? 'white' : '#374151',
      '&:hover': {
        backgroundColor: state.isSelected ? '#3b82f6' : '#f3f4f6'
      }
    }),
    singleValue: (provided) => ({
      ...provided,
      color: '#374151'
    }),
    placeholder: (provided) => ({
      ...provided,
      color: '#9ca3af'
    }),
    menu: (provided) => ({
      ...provided,
      border: '1px solid #e5e7eb',
      borderRadius: '6px',
      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)'
    }),
    indicatorSeparator: () => ({
      display: 'none'
    })
  };

  return (
    <div className="text-sm">
      <label className="block text-sm font-medium text-gray-500 mb-1">{label}</label>
      <Select
        options={selectOptions}
        value={selectedOption}
        onChange={handleChange}
        placeholder={placeholder}
        styles={customStyles}
        isClearable={false}
        isSearchable={true}
        className="text-sm"
        name={name}
      />
    </div>
  );
};

export default Dropdown;
