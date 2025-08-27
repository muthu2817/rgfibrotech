'use client';
import { X } from 'lucide-react'; // Cross icon
import { useDispatch, useSelector } from 'react-redux';
import { setFormOpen } from '@/app/store/slices/getPageDetailsSlice'; // update this path
import gsap from 'gsap';
import { useEffect, useState } from 'react';
import InputField from './FormComponents/Input';
import Dropdown from './FormComponents/DropDown';
import axiosInstance from '@/app/API/axiosInterceptor';
import StatusMessage from '../StatusMsg';


const UserForm = () => {
    const dispatch = useDispatch();
    const { departments } = useSelector((state) => state.department);
    const [formData, setFormData] = useState({
        userName: '',
        email: '',
        status: '',
        departmentId: ''
    });
    const [statusMsg, setStatusMsg] = useState(null);
    useEffect(() => {
        gsap.fromTo(
            "#MainFormComponent",
            {
                opacity: 0,
                scale: 0.9,
            },
            {
                delay: 0.2,
                opacity: 1,
                scale: 1,
                duration: 0.8,
                ease: "expo.out",
            }
        );
    }, []);


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
    ]
    // drop down options
    const options = [
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
        try{
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
            }, 2000);
        }
        catch(err){
            setStatusMsg({
                message: err.response?.data?.message || 'Something went wrong!',
                type: 'error',
            });
        }
    }

    return (
        <>
            <div
                id="ParentComponent"
                className="fixed inset-0 z-50 flex justify-center items-center"
            >
                {/* Background overlay */}
                <div className="absolute inset-0 bg-black/70"></div>

                {/* Modal */}
                <form
                    id="MainFormComponent"
                    className="relative bg-white rounded-2xl p-10 px-14 max-w-[560px] w-full space-y-4 shadow-[0_8px_30px_rgba(0,0,0,0.2)]"
                    onSubmit={handleSubmit}
                >
                    <div className="flex flex-row justify-between mb-10">
                        <h2 className="text-[16px] font-semibold">Create User</h2>
                        <X className="cursor-pointer" onClick={() => closeForm()} />
                    </div>

                    <div className="text-[14px] grid grid-cols-2 gap-5 space-y-6">
                        {InputFieldConfig.map((FieldData, id) => (
                            <InputField
                                key={id}
                                placeholder={FieldData.Placeholder}
                                ItemName={FieldData.label === 'userName' ? 'User Name' : FieldData.label === 'email' ? 'Email ID' : FieldData.label}
                                value={formData[FieldData.label]}
                                onchange={(e) => handleInputChange(FieldData.label, e.target.value)}
                            />
                        ))}
                    </div>

                    <div className='flex flex-row justify-between'>
                        <Dropdown label="Status" options={options} value={formData.status} onChange={(e) => handleInputChange('status', e.target.value)} />
                        <Dropdown label="Department" options={departments} value={formData.departmentId} onChange={(e) => handleInputChange('departmentId', e.target.value)} />
                    </div>

                    <div className="flex justify-end gap-4 pt-4">
                        <button
                            type="button"
                            className="cursor-pointer bg-gray-100 text-gray-700 rounded-full px-6 py-2"
                            onClick={closeForm}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="cursor-pointer bg-blue-600 text-white rounded-full px-6 py-2"
                        >
                            Create
                        </button>
                    </div>
                </form>
            </div>
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
