'use client'
import React, { useMemo, useState } from 'react';
import Image from 'next/image';
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  flexRender,
} from '@tanstack/react-table';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Search } from 'lucide-react';

/**
 * Reusable DataTable built on TanStack Table v8
 * - Supports global filter, pagination, sorting
 * - Optional frozen header and first column
 * - Mirrors the styles in storeManagementTbl.jsx
 */
const DataTable = ({
  data = [],
  columns = [],
  loading = false,
  pageSize = 30,
  freezeHeader = true,
  freezeFirstColumn = false,
  emptyMessage = 'No records found',
}) => {
  const [globalFilter, setGlobalFilter] = useState('');
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize });
  const [sorting, setSorting] = useState([]);

  const memoData = useMemo(() => data || [], [data]);
  const memoColumns = useMemo(() => columns || [], [columns]);

  const table = useReactTable({
    data: memoData,
    columns: memoColumns,
    state: { globalFilter, pagination, sorting },
    onPaginationChange: setPagination,
    onGlobalFilterChange: setGlobalFilter,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <div className="w-full relative">
      {/* Controls: search + pagination */}
      <div className="w-full flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
        {/* Search */}
        <div className="flex-1 flex items-center">
          <div className="relative inline-flex items-center">
            <span className="absolute left-3 text-sm text-[#959595]">
              <Search className="w-4 h-4" />
            </span>
            <input
              className="pl-9 text-sm bg-[#e3e7e9] rounded-full h-10 w-[220px] text-gray-700 focus:outline-blue-700"
              placeholder="Search"
              value={globalFilter}
              onChange={(e) => setGlobalFilter(e.target.value)}
            />
          </div>
        </div>
        {/* Pagination */}
        <div className="flex items-center gap-2">
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
      </div>

      {/* Table */}
      <div className="h-[550px] overflow-y-auto">
        <table className="w-full text-sm table-auto">
          <thead className={freezeHeader ? 'sticky top-0 z-10 bg-blue-50' : 'bg-blue-50'}>
            {table.getHeaderGroups().map(headerGroup => (
              <tr key={headerGroup.id} className="border-b border-t border-gray-100 text-stone-500 text-left">
                {headerGroup.headers.map((header, colIndex) => {
                  const isFrozen = freezeFirstColumn && colIndex === 0;
                  const sortDir = header.column.getIsSorted();
                  return (
                    <th
                      key={header.id}
                      className={`py-3 px-4 select-none ${isFrozen ? 'sticky left-0 z-20 bg-blue-50' : ''}`}
                    >
                      {header.isPlaceholder ? null : (
                        <div
                          className={header.column.getCanSort() ? 'cursor-pointer inline-flex items-center gap-1' : ''}
                          onClick={header.column.getToggleSortingHandler()}
                        >
                          {flexRender(header.column.columnDef.header, header.getContext())}
                          {header.column.getCanSort() && (
                            <span className="text-xs text-stone-400">
                              {sortDir === 'asc' ? '▲' : sortDir === 'desc' ? '▼' : ''}
                            </span>
                          )}
                        </div>
                      )}
                    </th>
                  );
                })}
              </tr>
            ))}
          </thead>

          <tbody className="font-[500]">
            {loading ? (
              table.getRowModel().rows.length === 0 ? (
                <tr>
                  <td colSpan={table.getAllColumns().length} className="text-center py-6">
                    <Image
                      src="/No_Data.png"
                      alt="No Data Found"
                      width={160}
                      height={160}
                      className="mx-auto mt-20 w-40 h-full opacity-80"
                    />
                    <p className="mt-2 text-gray-500">{emptyMessage}</p>
                  </td>
                </tr>
              ) : (
                table.getRowModel().rows.map(row => (
                  <tr key={row.id} className="border-b border-gray-200">
                    {row.getVisibleCells().map((cell, colIndex) => (
                      <td
                        key={cell.id}
                        className={`py-3 px-4 max-w-[280px] ${freezeFirstColumn && colIndex === 0 ? 'sticky left-0 z-10 bg-white' : ''}`}
                      >
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>
                ))
              )
            ) : (
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
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DataTable;
