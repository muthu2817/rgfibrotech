'use client'
import CreateBtn from "./Buttons/createBtn";
import { useState, useCallback, useEffect } from "react";
import { Search } from 'lucide-react';
import { ChevronLeft } from 'lucide-react';
import { ChevronRight } from 'lucide-react';
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { usePathname } from "next/navigation";
import Image from "next/image";


import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  flexRender,
  ColumnDef,
} from '@tanstack/react-table';

import { setFormOpen } from "../store/slices/getPageDetailsSlice";


const statusStyles = {
  "In Stock": " px-2 py-1 text-xs rounded-full font-medium bg-green-100 text-green-600",
  "Min Stock": " px-2 py-1 text-xs rounded-full font-medium bg-red-100 text-red-600",
  "Max Stock": " px-2 py-1 text-xs rounded-full font-medium bg-orange-100 text-orange-600",
};

export default function StoreTable({ tblData, loading }) {

  // State values
  const [globalFilter, setGlobalFilter] = useState('');
  const CurrentFormSts = useSelector(state => state.pageDetails.isFormOpen);

  const dispatch = useDispatch();

  // Memoize to avoid unnecessary re-renders
  const HandleFormOpen = useCallback(() => {
    dispatch(setFormOpen(!CurrentFormSts));
  }, [dispatch, CurrentFormSts]);

  useEffect(() => {
    console.log(loading);
  }, [tblData]);


  //Table format
  const columns = [
    {
      accessorKey: 'partName',
      header: 'Part Name'
    },
    {
      accessorKey: 'partNumber',
      header: 'Part Number'
    },
    {
      accessorKey: 'description',
      header: 'Specification'
    },
    {
      accessorKey: 'stock',
      header: 'InStock'
    },
    {
      accessorKey: 'status',
      header: 'Status'
    },
    {
      accessorKey: 'minStock',
      header: 'Min Stock'
    },
    {
      accessorKey: 'maxStock',
      header: 'Max Stock'
    },
  ]

  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 30, // 👈 Show 20 rows per page
  });

  const table = useReactTable({
    data: tblData || [],
    columns,
    state: {
      globalFilter, pagination
    },
    onPaginationChange: setPagination,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  let HeaderLbl;
  let routeName = usePathname();


  if (routeName == '/pages/consumables') {
    HeaderLbl = 'Consumables';
  }
  else if (routeName == '/pages/bom') {
    HeaderLbl = 'BOMs';
  }
  else if (routeName == '/pages/products') {
    HeaderLbl = 'Products';
  }
  else if (routeName == '/pages/warehouse') {
    HeaderLbl = 'Warehouse';
  }


  return (
    <div className='w-full relative'>
      {/* page title */}
      <div className="fixed top-0 w-full h-fit bg-gray-50 border-b-2 border-stone-200 py-4 ">
        <p className="ml-6 text-stone-400 font-[500] inline-flex text-[14px] items-center" >
          <span>
            Dashboard
          </span>
          <span className='px-2'>
            <ChevronRight className="w-3 h-3" />
          </span>
          <span>
            {HeaderLbl}
          </span>
        </p>
      </div>

      {/*create Button, search button, pagination  */}
      <div className="flex flex-row items-center justify-between w-full relative">
        {/* Left: Create Button */}
        <div className="fixed top-15 flex items-center">
          <CreateBtn onClick={HandleFormOpen} />
        </div>

        <div className="fixed right-0 top-19">
          <div className="flex items-center gap-6">
            {/* Pagination */}
            <div className="inline-flex items-center gap-2">
              <span className="text-sm">
                {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
              </span>
              <button
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
                className="w-8 h-8 p-1 rounded-full bg-blue-700 text-white hover:bg-blue-500"
              >
                <ChevronLeft />
              </button>
              <button
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
                className="w-8 h-8 p-1 rounded-full bg-blue-700 text-white hover:bg-blue-500"
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


      </div>


      {/* table component */}

      <div className='h-[550px] overflow-y-auto mt-32'>
        <table className='w-full text-sm table-auto'>
          <thead className='sticky top-0 z-10 bg-blue-50'>
            {table.getHeaderGroups().map(headerGroup => (
              <tr key={headerGroup.id} className="border-b border-t border-gray-100 text-stone-500 text-left">
                {headerGroup.headers.map(header => (
                  <th key={header.id} className="py-3 px-4">
                    {flexRender(header.column.columnDef.header, header.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </thead>

          <tbody className="font-[500]">
            {
            loading ? 
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
                  <p className="mt-2 text-gray-500">No records found</p>
                </td>
              </tr>
            ) : (
              table.getRowModel().rows.map(row => (
                <tr key={row.id} className="border-b border-gray-200">
                  {row.getVisibleCells().map(cell => {
                    const isStatusColumn = cell.column.id === 'status';
                    const MinStock = Math.ceil(row.original.minStock)
                    const MaxStock = Math.ceil(row.original.maxStock);
                    const InStock =  Math.ceil(row.original.stock);
                    let value;
                    if( InStock <= MinStock){
                      value = 'Min Stock';
                    }
                    else if(InStock >= MaxStock){
                     value = 'Max Stock';
                    }
                    else{
                       value = 'In Stock';
                    }
                    const badgeClass = isStatusColumn ? statusStyles[value] || 'bg-gray-100 text-gray-600' : '';

                    return (
                      <td key={cell.id} className="py-3 px-4 max-w-[280px]">
                        {isStatusColumn ? (
                          <span className={badgeClass}>{value}</span>
                        ) : (
                          flexRender(cell.column.columnDef.cell, cell.getContext())
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))
            ): 
            (
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
}
