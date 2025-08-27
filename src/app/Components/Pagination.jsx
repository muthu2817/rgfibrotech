'use client'
import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

/**
 * Pagination
 * - Controlled pagination UI matching existing styles
 * - Pass the current page index (0-based), total page count, and handlers
 */
const Pagination = ({
  pageIndex = 0,
  pageCount = 0,
  canPreviousPage = false,
  canNextPage = false,
  onPreviousPage = () => {},
  onNextPage = () => {},
  className = '',
}) => {
  return (
    <div className={`inline-flex items-center gap-2 ${className} bg-[#e3e7e9] rounded-full px-1 py-1`}>
      
      <button
        onClick={onPreviousPage}
        disabled={!canPreviousPage}
        className="w-8 h-8 p-1 rounded-full bg-[#151515] text-whitedisabled:opacity-50"
        aria-label="Previous page"
      >
        <ChevronLeft className='text-white' />
      </button>
      <span className="text-sm text-black">
        {pageCount > 0 ? pageIndex + 1 : 0} of {pageCount}
      </span>
      <button
        onClick={onNextPage}
        disabled={!canNextPage}
        className="w-8 h-8 p-1 rounded-full bg-[#151515] text-white disabled:opacity-50"
        aria-label="Next page"
      >
        <ChevronRight  className='text-white'/>
      </button>
    </div>
  );
};

export default Pagination;
