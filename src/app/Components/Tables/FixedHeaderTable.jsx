'use client'
import React, { useMemo, useEffect } from 'react';
import Image from 'next/image';
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  getFilteredRowModel,
  getPaginationRowModel,
} from '@tanstack/react-table';
import Loader from '../Loader';
/**
 * FixedHeaderTable (presentational)
 * - Sticky header, fills available height
 * - No internal sorting, pagination, or filtering
 * - Sorting/pagination should be handled outside; pass already-processed data
 */
const FixedHeaderTable = ({
  data = [],
  columns = [],
  loading = null,
  height, // optional fixed height (e.g., 550 or '60vh'). If omitted, fills available height
  emptyMessage = 'No records found',
  headerCellClassName = '',
  headerTextClassName = 'text-sm font-medium tracking-tight text-[#757575]',
  globalFilter,
  // pagination (controlled from parent)
  pageIndex = 0,
  pageSize = 10,
  onPaginationChange = () => {}
}) => {
  const memoData = useMemo(() => data || [], [data]);
  const memoColumns = useMemo(() => columns || [], [columns]);

  const table = useReactTable({
    data: memoData,
    columns: memoColumns,
    state: { globalFilter, pagination: { pageIndex, pageSize } },
    onGlobalFilterChange: () => {},
    onPaginationChange,
    getFilteredRowModel: getFilteredRowModel(),
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  // useEffect(()=>{
  //   console.log(memoData);
  // })

  const scrollStyle = height
    ? { height: typeof height === 'number' ? `${height}px` : height }
    : undefined;

  return (
    <div className="w-full h-full flex flex-col min-h-0 relative">
      <div
        className={`overflow-y-auto ${height ? '' : 'flex-1 min-h-0'}`}
        style={scrollStyle}
      >
        <table className="w-full text-sm table-auto">
          <thead className="sticky top-0 z-10 bg-[#f3f3f3]">
            {table.getHeaderGroups().map(headerGroup => (
              <tr key={headerGroup.id} className="border-b border-t border-gray-100 text-stone-500 text-left">
                {headerGroup.headers.map(header => {
                  const meta = header.column.columnDef.meta || {};
                  const thCls = `py-3 px-4 select-none ${headerCellClassName} ${meta.thClassName || ''}`.trim();
                  const textCls = `${headerTextClassName} ${meta.headerClassName || ''}`.trim();
                  return (
                    <th key={header.id} className={thCls}>
                      {header.isPlaceholder ? null : (
                        <span className={textCls}>
                          {flexRender(header.column.columnDef.header, header.getContext())}
                        </span>
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
                    {row.getVisibleCells().map(cell => (
                      <td key={cell.id} className="py-3 px-4 max-w-[280px]">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>
                ))
              )
            ) : (
              <tr>
                <td colSpan={table.getAllColumns().length} className="pt-[15%]">
                  <Loader/>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default FixedHeaderTable;
