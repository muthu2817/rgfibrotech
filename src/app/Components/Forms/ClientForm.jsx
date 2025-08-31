'use client';
import { useState } from 'react';
import InputField from './FormComponents/Input';
import axiosInstance from '@/app/API/axiosInterceptor';
import StatusMessage from '../StatusMsg';
import Dropdown from './FormComponents/DropDown';
import { setFormOpen } from '@/app/store/slices/getPageDetailsSlice';
import { useDispatch } from 'react-redux';
import Popup from '../Popup';
const ClientForm = ({ setRefresh,isFormOpen }) => {
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
    { id: 'pending', name: 'Pending' },
    { id: 'active', name: 'Active' },
    { id: 'iactive', name: 'Inactive' },
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
    <Popup
       isOpen={isFormOpen}
       onClose={() => dispatch(setFormOpen(false))}
       title="Create Client"
       showCloseButton={true}
       overlayClickToClose={true}
       formName="addClientForm"
       size='medium'
       onCancel={() => dispatch(setFormOpen(false))}
       onSubmit={()=>{}}
       cancelButtonText={'Cancel'}
       submitButtonText="Create"
     >
      <form
        id="addClientForm"
        name='addClientForm'
        className="relative bg-white  w-full grid grid-cols-2 gap-y-6 gap-x-4"
        onSubmit={handleSubmit}
      >
          {InputFieldConfig.map((FieldData, id) => (
            <InputField
            required={true}
              key={id}
              placeholder={FieldData.Placeholder}
              ItemName={FieldData.label === 'clientName' ? 'Client Name' :
                FieldData.label === 'type' ? 'Client Type' : FieldData.label}
              value={formData[FieldData.label]}
              onChange={(e) => handleInputChange(FieldData.label, e.target.value)}
            />
          ))}

          <div>
            <label className="block font-medium text-gray-500 mb-1">Contact Email</label>
            <input
              type="email"
              placeholder="Enter Email ID"
              value={formData.contactInfo.email}
              onChange={(e) => handleContactInfoChange('email', e.target.value)}
              // className="w-full border border-gray-200 px-3 py-2 rounded-md focus:outline-blue-400"
            />
            </div>
            <div>
            <label className="block font-medium text-gray-500 mb-1">Contact Phone</label>
            <input
              type="tel"
              placeholder="Enter Phone Number"
              value={formData.contactInfo.phone}
              onChange={(e) => handleContactInfoChange('phone', e.target.value)}
              // className="w-full border border-gray-200 px-3 py-2 rounded-md focus:outline-blue-400"
            />
          </div>
        <div>
          <label className="block font-medium text-gray-500 mb-1">Status</label>
          <select
            // className="w-full border border-gray-200 px-3 py-2 rounded-md focus:outline-blue-400"
            value={formData.status}
            onChange={(e) => handleInputChange('status', e.target.value)}
          >
            {statusOptions.map((option,index) => (
              <option key={index} value={option.id}>
                {option.name}
              </option>
            ))}
          </select>
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
    </Popup>
  );
};

export default ClientForm;
