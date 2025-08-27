'use client';
import { useDispatch } from 'react-redux';
import { setFormOpen } from '@/app/store/slices/getPageDetailsSlice';
import { useEffect, useState } from 'react';
import InputField from './FormComponents/Input';
import axiosInstance from '@/app/API/axiosInterceptor';
import Dropdown from './FormComponents/DropDown';
import StatusMessage from '../StatusMsg';

const BomCreateForm = ({ setRefresh }) => {
  const dispatch = useDispatch();
  const [Departments, setDepartments] = useState([]);
  const [unitType, setUnitType] = useState([]);
  const [statusMsg, setStatusMsg] = useState(null);

  // Add missing fields to formData: description, leadTime
  const [formData, setFormData] = useState({
    partName: '',
    partNumber: '',
    description: '',
    unit: '',
    minStock: '',
    maxStock: '',
    stock: '',
    leadTime: '',
    departments: [],
  });

  // Fix: fetch dropdown data only if form is mounted
  useEffect(() => {
    const dropDownData = async () => {
      try {
        const DepartmentDto = await axiosInstance.get('/departments', {
          params: { page: 1, limit: 10, populate: true },
        });
        const UnitTypeDto = await axiosInstance.get('/units', {
          params: { page: 1, limit: 10, populate: true },
        });

        setDepartments(DepartmentDto.data.data.departments);
        setUnitType(UnitTypeDto.data.data);
      } catch (error) {
        console.error(error);
      }
    };
    dropDownData();
  }, []);

  // Fix: InputField should be controlled, pass value and onChange (not onchange)
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const requiredFields = [
      { key: 'partName', label: 'Part Name' },
      { key: 'partNumber', label: 'Part Number' },
      { key: 'unit', label: 'Unit Type' },
      { key: 'minStock', label: 'Min Stock Quantity' },
      { key: 'maxStock', label: 'Max Stock Quantity' },
      { key: 'stock', label: 'In Stock Quantity' },
      { key: 'departments', label: 'Departments' }
    ];

    for (let field of requiredFields) {
      if (
        formData[field.key] === '' ||
        formData[field.key] === null ||
        (Array.isArray(formData[field.key]) && formData[field.key].length === 0)
      ) {
        setStatusMsg({
          message: `${field.label} is required.`,
          type: 'error',
        });
        return;
      }
    }
    try {
      const res = await axiosInstance.post('/boms', formData);
      setStatusMsg({
        message: res.data.message || 'BOM Created Successfully!',
        type: 'success',
      });

      setTimeout(() => {
        closeForm();
      }, 1000);
      setRefresh(prev => !prev);
    } catch (err) {
      console.error('Error:', err);
      setStatusMsg({
        message: err.response?.data?.message || 'Something went wrong!',
        type: 'error',
      });
    }
  };

  const toggleDepartment = (dept) => {
    setFormData((prev) => {
      const alreadySelected = prev.departments.includes(dept.id);
      return {
        ...prev,
        departments: alreadySelected
          ? prev.departments.filter((d) => d !== dept.id)
          : [...prev.departments, dept.id],
      };
    });
  };

  const closeForm = () => {
    dispatch(setFormOpen(false));
  };

  const InputFieldConfig = [
    { label: 'Part Name', placeholder: 'Item Name', key: 'partName' },
    { label: 'Part Number', placeholder: 'Item Number', key: 'partNumber' },
    { label: 'Description', placeholder: 'Enter Description', key: 'description' },
    { label: 'Min Stock Quantity', placeholder: '100 Nos', key: 'minStock' },
    { label: 'Max Stock Quantity', placeholder: '500 Nos', key: 'maxStock' },
    { label: 'In Stock Quantity', placeholder: '500 Nos', key: 'stock' },
    { label: 'Lead Time', placeholder: '7-10 Days', key: 'leadTime' },
  ];

  return (
    <>
      <form
        id="MainFormComponent"
        className="bg-white rounded-2xl p-10 px-4 sm:px-8 md:px-10 w-full space-y-4 overflow-x-hidden"
        onSubmit={handleSubmit}
        style={{ maxWidth: '100%', overflowX: 'hidden' }}
      >
        {/* Input Grid */}
        <div className="text-[14px] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 space-y-6">
          {InputFieldConfig.map((FieldData, id) => (
            <InputField
              key={id}
              name={FieldData.key}
              value={formData[FieldData.key] || ''}
              onChange={handleChange}
              placeholder={FieldData.placeholder}
              ItemName={FieldData.label}
            />
          ))}
          <Dropdown
            name='unit'
            onChange={(e) => {
              // e.target.value is the selected unit id
              setFormData((prev) => ({
                ...prev,
                unit: e.target.value
              }));
            }}
            label="Unit Type"
            value={formData.unit}
            options={unitType}
          />
        </div>

        {/* Departments */}
        <div className="border-t border-gray-200">
          <label className="pt-4 block my-2 font-medium text-gray-500">Departments</label>
          <div className="flex border border-blue-200 rounded-lg w-fit overflow-hidden">
            {Departments.map((dept) => {
              const isActive = formData.departments.includes(dept.id);
              return (
                <button
                  key={dept.id}
                  type="button"
                  onClick={() => toggleDepartment(dept)}
                  className={`border-r border-blue-200 py-1 text-sm px-4 font-medium text-center transition-colors ${
                    isActive ? 'bg-blue-500 text-white' : 'bg-white text-gray-700'
                  }`}
                >
                  {dept.displayName}
                </button>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-4 pt-4 ">
          <button
            onClick={() => closeForm()}
            type="button"
            className="cursor-pointer bg-gray-100 text-gray-700 rounded-full px-6 py-2 hover:bg-gray-200"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="cursor-pointer bg-blue-600 text-white rounded-full px-6 py-2 hover:bg-blue-800"
          >
            Create
          </button>
        </div>
      </form>

      {/* ✅ Show Status Toast */}
      {statusMsg && (
        <StatusMessage
          message={statusMsg.message}
          type={statusMsg.type}
          onClose={() => setStatusMsg(null)}
        />
      )}
    </>
  );
};

export default BomCreateForm;
