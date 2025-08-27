'use client';
import { useState } from 'react';
import InputField from './FormComponents/Input';
import axiosInstance from '@/app/API/axiosInterceptor';
import StatusMessage from '../StatusMsg';
import Dropdown from './FormComponents/DropDown';
import { setFormOpen } from '@/app/store/slices/getPageDetailsSlice';
import { useDispatch } from 'react-redux';
const ClientForm = ({ setRefresh }) => {
  const [formData, setFormData] = useState({
    clientName: '',
    type: '',
    status: '',
    contactInfo: {
      email: '',
      phone: ''
    }
  });
  const [statusMsg, setStatusMsg] = useState(null);
  const dispatch = useDispatch();

  const closeForm =() =>{
    dispatch(setFormOpen(false));
  }

  const InputFieldConfig = [
    {
      label: "clientName",
      Placeholder: "Enter Client Name"
    },
    {
      label: "type",
      Placeholder: "Enter Client Type"
    }
  ];

  // drop down options for status
  const statusOptions = [
    { id: 'Pending', name: 'Pending' },
    { id: 'active', name: 'Active' },
    { id: 'Inactive', name: 'Inactive' },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axiosInstance.post('/clients', formData);
      setStatusMsg({
        message: res.data.message || 'Client Created Successfully!',
        type: 'success',
      });
      setTimeout(() => {
        closeForm();
      }, 1000);
      setRefresh(prev => !prev);
    } catch (err) {
      setStatusMsg({
        message: err.response?.data?.message || 'Something went wrong!',
        type: 'error',
      });
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleContactInfoChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      contactInfo: {
        ...prev.contactInfo,
        [field]: value
      }
    }));
  };

  return (
    <>
      <form
        id="MainFormComponent"
        className="relative bg-white  p-10 w-full space-y-4 "
        onSubmit={handleSubmit}
      >
        <div className="text-[14px] grid grid-cols-2 gap-5 space-y-6">
          {InputFieldConfig.map((FieldData, id) => (
            <InputField
              key={id}
              placeholder={FieldData.Placeholder}
              ItemName={FieldData.label === 'clientName' ? 'Client Name' :
                FieldData.label === 'type' ? 'Client Type' : FieldData.label}
              value={formData[FieldData.label]}
              onChange={(e) => handleInputChange(FieldData.label, e.target.value)}
            />
          ))}
        </div>

        <div className="text-[14px] grid grid-cols-2 gap-5 space-y-6">
          <div>
            <label className="block font-medium text-gray-500 mb-1">Contact Email</label>
            <input
              type="email"
              placeholder="Enter Email ID"
              value={formData.contactInfo.email}
              onChange={(e) => handleContactInfoChange('email', e.target.value)}
              className="w-full border border-gray-200 px-3 py-2 rounded-md focus:outline-blue-400"
            />
          </div>
          <div>
            <label className="block font-medium text-gray-500 mb-1">Contact Phone</label>
            <input
              type="tel"
              placeholder="Enter Phone Number"
              value={formData.contactInfo.phone}
              onChange={(e) => handleContactInfoChange('phone', e.target.value)}
              className="w-full border border-gray-200 px-3 py-2 rounded-md focus:outline-blue-400"
            />
          </div>
        </div>
        <div style={{ maxWidth: 160 }}>
          <Dropdown
            label="Status"
            options={statusOptions}
            value={formData.status}
            onChange={(e) => handleInputChange('status', e.target.value)}
          />
        </div>

        <div className="flex justify-end gap-4 pt-4">
          <button
            type="button"
            className="cursor-pointer bg-gray-100 text-gray-700 rounded-full px-6 py-2 hover:bg-gray-300"
            onClick={()=>closeForm()}
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

export default ClientForm;
