'use client'
import React from 'react';
import { Search as SearchIcon } from 'lucide-react';

const SearchInput = ({
  value = '',
  onChange = () => {},
  placeholder = 'Search',
  className = '',
}) => {
  return (
    <div id='search' className={`relative inline-flex items-center ${className}`}>
      <span className="absolute left-3 text-sm text-[#959595]">
        <SearchIcon className="w-4 h-4" />
      </span>
      <input
        className="!pl-9 !text-sm !bg-[#e3e7e9] !rounded-full !py-2 !w-[220px] !text-gray-700 focus:!outline-blue-700 !border-none !focus:!ring-0"
        style={{
          background: '#e3e7e9',
          paddingLeft: '2.25rem',
          width: '220px',
          borderRadius: '9999px',
          paddingTop: '0.5rem',
          paddingBottom: '0.5rem',
          fontSize: '0.875rem',
          color: '#374151',
          border: 'none',
          outline: 'none'
        }}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
      />
    </div>
  );
};

export default SearchInput;
