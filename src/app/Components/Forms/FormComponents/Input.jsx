'use client'
const InputField = ({placeholder,ItemName,onChange,value,name}) => {
    return (
        <div>
            <label className="block font-medium text-gray-500 mb-1">{ItemName}</label>
            <input type="text" placeholder={placeholder} name={name} onChange={onChange} value={value} className="w-full border border-gray-200 px-3 py-2 rounded-md focus:outline-blue-400" />
        </div>
    )
}

export default InputField;