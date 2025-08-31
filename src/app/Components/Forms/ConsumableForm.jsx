'use client';
import { useDispatch } from 'react-redux';
import { setFormOpen } from '@/app/store/slices/getPageDetailsSlice';
import gsap from 'gsap';
import { useEffect, useState } from 'react';
import YesNoToggle from './FormComponents/toggleBtn';
import InputField from './FormComponents/Input';
import axiosInstance from '@/app/API/axiosInterceptor';
import Dropdown from './FormComponents/DropDown';
import { X, CheckCircle2 } from 'lucide-react';
import Popup from '../Popup';
// Success PopUp (same as BOMForm)
const SuccessPopUp = ({ message, onClose }) => (
  <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40">
    <div className="bg-white rounded-2xl shadow-lg px-10 py-8 flex flex-col items-center max-w-xs w-full">
      <CheckCircle2 className="text-green-500 w-12 h-12 mb-2" />
      <div className="text-lg font-semibold mb-2">{message}</div>
      <button
        onClick={onClose}
        className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-full font-medium hover:bg-blue-700 transition"
      >
        OK
      </button>
    </div>
  </div>
);

const ConsumableForm = ({ setRefresh,isFormOpen }) => {
  const dispatch = useDispatch();
  const [Departments, setDepartments] = useState([]);
  const [unitType, setUnitType] = useState([]);
  const [showSuccess, setShowSuccess] = useState(false);
  const [statusMsg, setStatusMsg] = useState(null);

  // Form state
  const [formData, setFormData] = useState({
    itemName: '',
    itemNumber: '',
    description: '',
    unit: '',
    minStock: '',
    maxStock: '',
    inStock: '',
    leadTime: '',
    isReusable: false,
    isReturnable: false,
    departments: [],
  });

  // Animation on mount
  useEffect(() => {
    gsap.fromTo(
      "#",
      { opacity: 0, scale: 0.9 },
      { delay: 0.2, opacity: 1, scale: 1, duration: 0.8, ease: "expo.out" }
    );
  }, []);

  // Fetch departments and unit types
  useEffect(() => {
    const dropDownData = async () => {
      try {
        const [DepartmentDto, UnitTypeDto] = await Promise.all([
          axiosInstance.get('/departments', {
            params: { page: 1, limit: 10, populate: true },
          }),
          axiosInstance.get('/units', {
            params: { page: 1, limit: 10, populate: true },
          }),
        ]);
        setDepartments(DepartmentDto.data.data.departments || []);
        setUnitType(UnitTypeDto.data.data || []);
      } catch (error) {
        console.error(error);
      }
    };
    dropDownData();
  }, []);

  const closeForm = () => {
    dispatch(setFormOpen(false));
  };

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle toggle changes
  const handleToggle = (name, value) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle department selection
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

  // Validate required fields
  const requiredFields = [
    { key: 'itemName', label: 'Item Name' },
    { key: 'itemNumber', label: 'Item Number' },
    { key: 'unit', label: 'Unit Type' },
    { key: 'minStock', label: 'Min Stock Quantity' },
    { key: 'maxStock', label: 'Max Stock Quantity' },
    { key: 'inStock', label: 'In Stock Quantity' },
    { key: 'departments', label: 'Departments' }
  ];

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
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

    // Prepare payload (rename inStock to stock for API consistency if needed)
    const payload = {
      ...formData,
      stock: formData.inStock,
    };
    delete payload.inStock;

    try {
      const res = await axiosInstance.post('/consumables', payload);
      setShowSuccess(true);
      setStatusMsg(null);
      if (typeof setRefresh === 'function') setRefresh((r) => !r);
      setTimeout(() => {
        closeForm();
      }, 1000);
    } catch (err) {
      setStatusMsg({
        message: err.response?.data?.message || 'Something went wrong!',
        type: 'error',
      });
    }
  };

  // When popup closes, also close the form
  const handleSuccessClose = () => {
    setShowSuccess(false);
    closeForm();
  };

  // Input field config
  const inputFields = [
    {
      label: "Item Name",
      name: "itemName",
      placeholder: "Item Name",
      type: "text",
    },
    {
      label: "Item Number",
      name: "itemNumber",
      placeholder: "Item Number",
      type: "text",
    },
    {
      label: "Description",
      name: "description",
      placeholder: "Enter Description",
      type: "text",
    },
    {
      label: "Min Stock Quantity",
      name: "minStock",
      placeholder: "100 Nos",
      type: "number",
    },
    {
      label: "Max Stock Quantity",
      name: "maxStock",
      placeholder: "500 Nos",
      type: "number",
    },
    {
      label: "In Stock Quantity",
      name: "inStock",
      placeholder: "500 Nos",
      type: "number",
    },
    {
      label: "Lead Time",
      name: "leadTime",
      placeholder: "7-10 Days",
      type: "text",
    },
  ];

  // Status message component (simple inline)
  const StatusMessage = ({ message, type, onClose }) => (
    <div
      className={`fixed top-6 left-1/2 -translate-x-1/2 z-[70] px-6 py-3 rounded-lg shadow-lg text-white font-medium ${
        type === 'error' ? 'bg-red-500' : 'bg-green-500'
      }`}
      style={{ minWidth: 220, textAlign: 'center' }}
    >
      {message}
      <button className="ml-4 text-white font-bold" onClick={onClose}>×</button>
    </div>
  );

  return (
    <>
    <Popup isOpen={isFormOpen}
    onClose={() => dispatch(setFormOpen(false))}
    title="Create Consumable"
    showCloseButton={true}
    overlayClickToClose={true}
    formName="ConsumableForm"
    size='full'
    onCancel={() => dispatch(setFormOpen(false))}
    onSubmit={()=>{}}
    cancelButtonText={'Cancel'}
    submitButtonText="Create">

    
      <div id='Main' className="">
        <form
          id='ConsumableForm'
          className="bg-white rounded-2xl p-10 px-4 sm:px-8 md:px-10 w-full space-y-4 overflow-x-hidden"
          onSubmit={handleSubmit}
        >
          {/* 4-column input grid */}
          <div className="text-[14px] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {inputFields.map((field) => (
              <InputField
                key={field.name}
                ItemName={field.label}
                placeholder={field.placeholder}
                name={field.name}
                type={field.type}
                value={formData[field.name]}
                onChange={handleChange}
              />
            ))}
            <Dropdown
              name='unit'
              onChange={(e) => {
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

          {/* Yes/No Toggles */}
          <div className="flex flex-row gap-12">
            <div>
              <label className="block mb-1 font-medium text-gray-500">Is Reusable?</label>
              <YesNoToggle
                value={formData.isReusable}
                onChange={(val) => handleToggle('isReusable', val)}
              />
            </div>
            <div>
              <label className="block mb-1 font-medium text-gray-500">Is Returnable?</label>
              <YesNoToggle
                value={formData.isReturnable}
                onChange={(val) => handleToggle('isReturnable', val)}
              />
            </div>
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

          {/* Footer - Action buttons removed - handled by popup */}
        </form>
        {/* Status Message */}
        {statusMsg && (
          <StatusMessage
            message={statusMsg.message}
            type={statusMsg.type}
            onClose={() => setStatusMsg(null)}
          />
        )}
        {/* Success PopUp */}
        {showSuccess && (
          <SuccessPopUp
            message="Consumable created successfully!"
            onClose={handleSuccessClose}
          />
        )}
      </div>
      </Popup>
    </>
  );
};

export default ConsumableForm;
