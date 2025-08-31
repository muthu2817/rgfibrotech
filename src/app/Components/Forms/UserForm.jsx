'use client';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setFormOpen } from '@/app/store/slices/getPageDetailsSlice';
import axiosInstance from '@/app/API/axiosInterceptor';
import StatusMessage from '../StatusMsg';
import InputField from './FormComponents/Input';
import Dropdown from './FormComponents/DropDown';

const UserForm = ({ setRefresh }) => {
  const dispatch = useDispatch();
  const { departments } = useSelector((state) => state.department);

  const [formData, setFormData] = useState({
    userName: '',
    email: '',
    status: '',
    departmentId: ''
  });
  const [statusMsg, setStatusMsg] = useState(null);

  const closeForm = () => {
    dispatch(setFormOpen(false));
  };

  const InputFieldConfig = [
    {
      label: "userName",
      Placeholder: "Enter User Name"
    },
    {
      label: "email",
      Placeholder: "Enter Email ID"
    }
  ];

  // drop down options for status
  const statusOptions = [
    { id: 'Active', name: 'Active' },
    { id: 'Inactive', name: 'Inactive' },
    { id: 'Pending', name: 'Pending' },
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        name: formData.userName,
        email: formData.email,
        status: formData.status,
        departmentId: formData.departmentId
      };
      const res = await axiosInstance.post('/users', payload);
      setStatusMsg({
        message: res.data?.message || 'User Created Successfully!',
        type: 'success',
      });
      setTimeout(() => {
        closeForm();
      }, 1000);
      if (setRefresh) setRefresh(prev => !prev);
    } catch (err) {
      setStatusMsg({
        message: err.response?.data?.message || 'Something went wrong!',
        type: 'error',
      });
    }
  };

  return (
    <>
      <form
        id="MainFormComponent"
        className="relative bg-white p-10 w-full space-y-4"
        onSubmit={handleSubmit}
      >
        <div className="text-[14px] grid grid-cols-2 gap-5 space-y-6">
          {InputFieldConfig.map((FieldData, id) => (
            <InputField
              key={id}
              placeholder={FieldData.Placeholder}
              ItemName={FieldData.label === 'userName' ? 'User Name' :
                FieldData.label === 'email' ? 'Email ID' : FieldData.label}
              value={formData[FieldData.label]}
              onChange={(e) => handleInputChange(FieldData.label, e.target.value)}
            />
          ))}
        </div>

        <div className="text-[14px] grid grid-cols-2 gap-5 space-y-6">
          <Dropdown
            label="Status"
            options={statusOptions}
            value={formData.status}
            onChange={(e) => handleInputChange('status', e.target.value)}
          />
          <Dropdown
            label="Department"
            options={departments}
            value={formData.departmentId}
            onChange={(e) => handleInputChange('departmentId', e.target.value)}
          />
        </div>

        {/* Action buttons removed - handled by popup */}
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

export default UserForm;
