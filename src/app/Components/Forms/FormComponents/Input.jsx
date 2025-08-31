'use client'
const InputField = ({placeholder,ItemName,onChange,value,name,required=true}) => {
    return (
        <div>
            <label className="block font-medium text-gray-500 mb-1 text-sm">{ItemName}</label>
            <input required={required} type="text" placeholder={placeholder} name={name} onChange={onChange} value={value} className="max-w-full border border-gray-200 px-3 py-1.5 rounded-md focus:outline-blue-400" />
        </div>
    )
}

export default InputField;