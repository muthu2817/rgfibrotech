'use client'
import {
    useReactTable,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    flexRender,
} from '@tanstack/react-table';
import { useState } from 'react';
import { Search, ChevronLeft, ChevronRight } from 'lucide-react';
import Image from 'next/image';

/**
 * Reusable Table component for company management and more.
 * Accepts columns and data as props, supports sorting, filtering, and pagination.
 * 
 * @param {Array} columns - Column definitions for TanStack Table
 * @param {Array} data - Table data
 * @param {boolean} loading - Loading state
 * @param {number} pageSize - Number of rows per page (default: 20)
 * @param {function} onCreate - Optional callback for create button
 * @param {ReactNode} createButton - Optional custom create button
 * @param {string} emptyMessage - Message to show when no data
 */
const statusStyles = {
    "active": " px-2 py-1 text-xs rounded-full font-medium bg-green-100 text-green-600",
    "Pending": " px-2 py-1 text-xs rounded-full font-medium bg-red-100 text-red-600",
    "Inactive": " px-2 py-1 text-xs rounded-full font-medium bg-orange-100 text-orange-600",
};

const CompanyManagementTable = ({
    columns = [],
    data = [],
    loading = false,
    pageSize = 20,
    onCreate,
    createButton,
    emptyMessage = "No records found"
}) => {
    const [globalFilter, setGlobalFilter] = useState('');
    const [pagination, setPagination] = useState({
        pageIndex: 0,
        pageSize,
    });
    const [sorting, setSorting] = useState([]);

    const table = useReactTable({
        data: data || [],
        columns,
        state: {
            globalFilter,
            pagination,
            sorting,
        },
        onPaginationChange: setPagination,
        onGlobalFilterChange: setGlobalFilter,
        onSortingChange: setSorting,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
    });

    return (
        <div className='w-full relative'>
            {/* Controls: Create Button, Search, Pagination */}
            <div className="flex flex-row items-center justify-between w-full mb-4">
                {/* Left: Create Button */}
                <div>
                    {createButton ? (
                        createButton
                    ) : onCreate ? (
                        <button
                            onClick={onCreate}
                            className="inline-flex items-center px-4 py-2 bg-blue-700 text-white rounded hover:bg-blue-500"
                        >
                            <span className="mr-2"><svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 5v14m7-7H5"/></svg></span>
                            Create
                        </button>
                    ) : null}
                </div>
                {/* Right: Pagination + Search */}
                <div className="flex items-center gap-6">
                    {/* Pagination */}
                    <div className="inline-flex items-center gap-2">
                        <span className="text-sm">
                            {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
                        </span>
                        <button
                            onClick={() => table.previousPage()}
                            disabled={!table.getCanPreviousPage()}
                            className="w-8 h-8 p-1 rounded-full bg-blue-700 text-white hover:bg-blue-500 disabled:opacity-50"
                        >
                            <ChevronLeft />
                        </button>
                        <button
                            onClick={() => table.nextPage()}
                            disabled={!table.getCanNextPage()}
                            className="w-8 h-8 p-1 rounded-full bg-blue-700 text-white hover:bg-blue-500 disabled:opacity-50"
                        >
                            <ChevronRight />
                        </button>
                    </div>
                    {/* Search */}
                    <div className="relative inline-flex items-center">
                        <span className="absolute left-3 text-sm text-[#959595]">
                            <Search className="w-4 h-4" />
                        </span>
                        <input
                            className="pl-9 mr-4 text-sm bg-[#e3e7e9] rounded-full h-10 w-[220px] text-gray-700 focus:outline-blue-700"
                            placeholder="Search"
                            value={globalFilter}
                            onChange={(e) => setGlobalFilter(e.target.value)}
                        />
                    </div>
                </div>
            </div>
            {/* Table */}
            <div className='h-[540px] overflow-y-auto'>
                <table className='w-full text-sm table-auto'>
                    <thead className='sticky top-0 bg-blue-50'>
                        {table.getHeaderGroups().map(headerGroup => (
                            <tr key={headerGroup.id} className="border-b border-t border-gray-100 text-stone-500 text-left pl-4">
                                {headerGroup.headers.map(header => (
                                    <th
                                        key={header.id}
                                        className="py-3 px-4 pl-4 select-none cursor-pointer"
                                        onClick={header.column.getCanSort() ? header.column.getToggleSortingHandler() : undefined}
                                    >
                                        <div className="flex items-center gap-1">
                                            {flexRender(header.column.columnDef.header, header.getContext())}
                                            {header.column.getCanSort() && (
                                                <span>
                                                    {{
                                                        asc: <span>&uarr;</span>,
                                                        desc: <span>&darr;</span>
                                                    }[header.column.getIsSorted()] || <span className="text-gray-300">&uarr;&darr;</span>}
                                                </span>
                                            )}
                                        </div>
                                    </th>
                                ))}
                            </tr>
                        ))}
                    </thead>
                    <tbody className='font-[500]'>
                        {loading ? (
                            <tr>
                                <td colSpan={table.getAllColumns().length} className="pt-[15%]">
                                    <Image
                                        src="/loader.gif"
                                        alt="Loading..."
                                        width={70}
                                        height={70}
                                        className="mx-auto"
                                    />
                                </td>
                            </tr>
                        ) : (
                            table.getRowModel().rows.length === 0 ? (
                                <tr>
                                    <td colSpan={table.getAllColumns().length} className="text-center py-6">
                                        <Image src="/No_Data.png" alt="No Data Found" width={160} height={160} className="mx-auto mt-20 w-40 h-full opacity-80" />
                                        <p className="mt-2 text-gray-500">{emptyMessage}</p>
                                    </td>
                                </tr>
                            ) : (
                                table.getRowModel().rows.map(row => (
                                    <tr key={row.id} className="border-b border-gray-200 text-sm">
                                        {row.getVisibleCells().map(cell => {
                                            const columnId = cell.column.id;
                                            const value = cell.getValue();

                                            // Example: status badge styling
                                            if (columnId === 'status') {
                                                const badgeClass = statusStyles[value] || 'bg-gray-100 text-gray-600 px-2 py-1 text-xs rounded-full font-medium';
                                                return (
                                                    <td key={cell.id} className="py-3 px-4">
                                                        <span className={badgeClass}>{value}</span>
                                                    </td>
                                                );
                                            }

                                            // Example: action column (edit/delete)
                                            if (columnId === 'action') {
                                                return (
                                                    <td key={cell.id} className="py-3 px-4 space-x-2 overflow-hidden">
                                                        <button className="cursor-pointer px-3 py-1 bg-gray-200 text-black-500 font-[500] rounded hover:bg-gray-300 hover:text-white">Edit</button>
                                                        <button className="cursor-pointer px-3 py-1 text-red-600 font-[500] border border-red-600 rounded bg-red-100 hover:bg-red-200 ">Delete</button>
                                                    </td>
                                                );
                                            }

                                            return (
                                                <td key={cell.id} className="py-3 px-4 max-w-[280px]">
                                                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                                </td>
                                            );
                                        })}
                                    </tr>
                                ))
                            )
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default CompanyManagementTable;
