import React, { useEffect, useRef } from 'react'
import { MdFilterList } from "react-icons/md";


const FilterBtn = ({ onClick, options, sortBy, isSortOpen = false, show = false, setShow }) => {
    const containerRef = useRef(null);

    useEffect(() => {
        if (!show) return;

        function handleClickOutside(event) {
            if (containerRef.current && !containerRef.current.contains(event.target)) {
                setShow(false);
            }
        }

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [show, setShow]);

    return (
        <div
            ref={containerRef}
            onClick={onClick}
            className="relative cursor-pointer bg-[#f6f6f6] hover:bg-[#efefef] rounded-full py-3 px-3 pr-4 w-fit text-white transition-colors z-50"
        >
            <p className="items-center text-xs flex items-center ">
                <MdFilterList className="w-4 h-4 text-[#959595]" />
                <span className="ml-2 text-[#959595] font-medium">Filter</span>
            </p>
            <div
                className={`
                    absolute rounded-lg bg-[#f6f6f6] top-[100%] border border-[#e3e3e3] drop-shadow-xs left-0
                    min-h-[120px] min-w-[120px] max-w-[200px] max-h-[320px]
                    transition-all duration-300 ease-in-out overflow-hidden
                    ${show ? 'h-full w-full opacity-100 pointer-events-auto' : 'h-0 w-0 opacity-0 pointer-events-none'}
                `}
                style={{
                    // fallback for browsers that don't support tailwind transitions
                    transitionProperty: 'height, width, opacity',
                }}
            >
                {
                    options.map((option, idx) =>
                        <div className='px-3 py-2' key={idx}>
                            {/* Option content here */}
                        </div>
                    )
                }
            </div>
        </div>
    )
}

export default FilterBtn;