import React, { useEffect } from 'react';

const Popup = ({
  isOpen,
  onClose,
  children,
  variant = 'center', // 'center' or 'side'
  size,
  title,
  showCloseButton = true,
  overlayClickToClose = true,
  className = '',
  onCancel,      // <-- Add onCancel prop
  onSubmit,      // <-- Add onSubmit prop
  submitButtonText = '', // <-- Add configurable submit button text
  cancelButtonText = '',
  formName='',
  ...props
}) => {
  // Handle escape key press
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden'; // Prevent body scroll
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Size configurations
  const sizeConfig = {
    small: {
      center: 'max-w-sm max-h-96',
      side: 'w-80'
    },
    medium: {
      center: 'max-w-md max-h-[32rem]',
      side: 'w-96'
    },
    large: {
      center: 'max-w-2xl max-h-[40rem]',
      side: 'w-[28rem]'
    },
    xl: {
      center: 'max-w-4xl max-h-[60rem]',
      side: 'w-[40rem]'
    },

    full: {
      center: 'max-w-6xl h-[40rem] max-h-[100vh]',
      side: 'w-full'
    }
  };

  // Always use center variant for centering the popup
  const config = {
    container: 'fixed inset-0 flex items-center justify-center z-50 p-4',
    popup: `bg-white rounded-lg shadow-2xl ${sizeConfig[size].center} w-full max-h-full overflow-hidden`,
    animation: 'animate-in fade-in-0 zoom-in-95 duration-200'
  };

  const handleOverlayClick = (e) => {
    if (overlayClickToClose && e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleClose = () => {
    onClose();
  };

  return (
    <div
      className={`${config.container} ${className}`}
      onClick={handleOverlayClick}
      {...props}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50" />

      {/* Popup Content */}
      <div className={`relative z-10 ${config.popup} ${config.animation}`}>
        {/* Header */}
        {(title || showCloseButton) && (
          <div className="flex items-center justify-between px-6 py-3 border-b border-gray-200 bg-gray-50 rounded-t-lg">
            {title && (
              <h2 className="text-base font-medium text-gray-900">{title}</h2>
            )}
            {showCloseButton && (
              <button
                onClick={handleClose}
                className="p-1 rounded-full hover:bg-gray-200 transition-colors duration-200"
                aria-label="Close popup"
              >
                <svg
                  className="w-5 h-5 text-gray-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            )}
          </div>
        )}
        {/* Content */}
        <div className="px-6 py-8 overflow-y-auto">
          {children}
        </div>
        {
          formName=='ProductForm' ? 
          <div className="flex justify-end gap-4 px-6 py-6">
            <button 
              onClick={onCancel}
              type="button"
              className="cursor-pointer bg-gray-100 text-gray-700 rounded-full text-sm px-6 py-2 hover:bg-gray-200"
            >
              {cancelButtonText}
            </button>
            <button
              onClick={onSubmit}
              type="button"
              className="cursor-pointer bg-blue-600 text-white text-sm rounded-full px-6 py-2 hover:bg-blue-800"
            >
              {submitButtonText}
            </button>
          </div>
          :
          
          <div className="flex justify-end gap-4 px-6 py-6  ">
          <button form={formName}
            onClick={onCancel}
            type="button"
            className="cursor-pointer bg-gray-100 text-gray-700 rounded-full text-sm px-6 py-2 hover:bg-gray-200"
          >
            {cancelButtonText}
          </button>
          <button
            onClick={onSubmit}
            type="submit"
            form={formName}
            className="cursor-pointer bg-blue-600 text-white text-sm rounded-full px-6 py-2 hover:bg-blue-800"
          >
            {submitButtonText}
          </button>
        </div>
        }
        
      </div>
    </div>
  );
};

export default Popup;
