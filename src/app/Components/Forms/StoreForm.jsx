'use client';
import { usePathname } from 'next/navigation';
import { X, CheckCircle2 } from 'lucide-react'; // Cross and success icons
import { useDispatch } from 'react-redux';
import { setFormOpen } from '@/app/store/slices/getPageDetailsSlice';
import gsap from 'gsap';
import { useEffect, useState } from 'react';
import YesNoToggle from './FormComponents/toggleBtn';
import InputField from './FormComponents/Input';

// PopUp component for success message (like BOMForm)
const PopUp = ({ message, onClose }) => (
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

const CreateForm = () => {
    const dispatch = useDispatch();
    const routeName = usePathname();

    // Pop up state
    const [showPopUp, setShowPopUp] = useState(false);

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

    // Simulate form submission and show pop up
    const handleSubmit = (e) => {
        e.preventDefault();
        // Here you would handle the actual form submission logic (API call, etc)
        setShowPopUp(true);
    };

    // When pop up closes, also close the form
    const handlePopUpClose = () => {
        setShowPopUp(false);
        closeForm();
    };

    const InputFieldConfig = [
        {
            label: "Item Name",
            Placeholder: "Item Name"
        },
        {
            label: "Item Number",
            Placeholder: "Item Number"
        },
        {
            label: "Description",
            Placeholder: "Enter Description"
        },
        {
            label: "Min Stock Quantity",
            Placeholder: "100 Nos"
        },
        {
            label: "Max Stock Quantity",
            Placeholder: "500 Nos"
        },
        {
            label: "In Stock Quantity",
            Placeholder: "500 Nos"
        },
        {
            label: "Lead Time",
            Placeholder: "7-10 Days"
        }
    ];

    return (
        <>
            <div id='ParentComponent' className="fixed inset-0 bg-black/70 z-50 flex justify-center items-center shadow-xl/30">
                <form
                    id='MainFormComponent'
                    className="bg-white rounded-2xl p-10 px-14 max-w-[1050px] w-full space-y-4"
                    onSubmit={handleSubmit}
                >
                    <div className='flex flex-row justify-between mb-10'>
                        <h2 className="text-[16px] font-semibold">Create Consumable</h2>
                        <X className='cursor-pointer' onClick={closeForm} />
                    </div>

                    {/* 4-column input grid */}
                    <div className="text-[14px] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 space-y-6">
                        {
                            InputFieldConfig.map((FieldData, id) => (
                                <InputField key={id} placeholder={FieldData.Placeholder} ItemName={FieldData.label} />
                            ))
                        }
                    </div>

                    {/* Yes/No Toggle */}
                    <div className="flex flex-row gap-12">
                        <div>
                            <label className="block mb-1 font-medium text-gray-500">Is Reusable?</label>
                            <YesNoToggle />
                        </div>
                        <div>
                            <label className="block mb-1 font-medium text-gray-500">Is Returnable?</label>
                            <YesNoToggle />
                        </div>
                    </div>

                    {/* Departments */}
                    <div className='border-t border-gray-200'>
                        <label className="pt-4 block my-2 font-medium text-gray-500">Departments</label>
                        <div className="flex border border-blue-100 rounded-lg w-[500px] overflow-hidden">
                            {["R & D", "PDI", "Moulding", "Assembly", "Finishing", "Dispatch"].map((dept, idx) => (
                                <button
                                    key={idx}
                                    type="button"
                                    className={`flex-1 py-2 text-sm font-medium text-center
        ${idx % 2 === 0 ? 'bg-blue-100 text-blue-700' : 'bg-white text-gray-700'}`}
                                >
                                    {dept}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="flex justify-end gap-4 pt-4 ">
                        <button onClick={closeForm} type="button" className="cursor-pointer bg-gray-100 text-gray-700 rounded-full px-6 py-2">Cancel</button>
                        <button type="submit" className="cursor-pointer bg-blue-600 text-white rounded-full px-6 py-2">Create</button>
                    </div>
                </form>
                {showPopUp && (
                    <PopUp
                        message="Consumable created successfully!"
                        onClose={handlePopUpClose}
                    />
                )}
            </div>
        </>
    );
};

export default CreateForm;
