'use client'
import React from 'react';

const Loader = ({ size = 40, color = '#2563eb', thickness = 4, className = '' }) => {
  const style = {
    width: size,
    height: size,
    borderWidth: thickness,
    borderTopColor: color,
  };

  return (
    <div className={`flex items-center justify-center w-full h-full ${className}`}>
      <span className="circle-loader" style={style} aria-label="Loading" />
    </div>
  );
};

export default Loader;
