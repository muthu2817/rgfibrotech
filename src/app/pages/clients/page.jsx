'use client'
import UserTbl from "@/app/Components/Tables/userTable";
import { useSelector, useDispatch } from "react-redux";
import ClientForm from "@/app/Components/Forms/ClientForm";
import { useEffect, useState, useCallback } from "react";
import axiosInstance from "@/app/API/axiosInterceptor";
import { setFormOpen } from "@/app/store/slices/getPageDetailsSlice";
import Popup from "@/app/Components/Popup";

export default function Page() {
  const isFormOpen = useSelector((state) => state.pageDetails.isFormOpen);
  const dispatch = useDispatch();
  const [data, setData] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const [refresh, setRefresh] = useState(false);



  // Table columns for clients
  const columns = [
    {
      accessorKey: 'clientName',
      header: 'Client Name'
    },
    {
      accessorKey: 'emailId',
      header: 'Email'
    },
    {
      accessorKey: 'contactNumber',
      header: 'Phone'
    },
    {
      accessorKey: 'address',
      header: 'Address'
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => {
        const status = row.original.status;
        const statusStyles = {
          "active": "px-2 py-1 text-xs rounded-full font-medium bg-green-100 text-green-600",
          "Pending": "px-2 py-1 text-xs rounded-full font-medium bg-red-100 text-red-600",
          "Inactive": "px-2 py-1 text-xs rounded-full font-medium bg-orange-100 text-orange-600",
        };
        return (
          <span className={statusStyles[status] || "px-2 py-1 text-xs rounded-full font-medium bg-gray-100 text-gray-600"}>
            {status}
          </span>
        );
      }
    },
      {
        accessorKey: 'action',
        header: 'Action',
        cell: () => (
          <div className="py-1 space-x-2">
            <button className="cursor-pointer px-3 py-1 bg-gray-200 text-black-500 font-[500] rounded hover:bg-gray-300 hover:text-white">Edit</button>
            <button className="cursor-pointer px-3 py-1 text-red-600 font-[500] border border-red-600 rounded bg-red-100 hover:bg-red-200 ">Delete</button>
          </div>
        )
      }
    ,
  ];

  // Fetch client data
  async function getClientData() {
    setLoading(true);
    try {
      const response = await axiosInstance.get("/clients", {
        params: {
          page: 1,
          limit: 10,
          populate: true
        }
      });
      setData(response.data.data);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    getClientData();
    console.log(data);
    // eslint-disable-next-line
  }, [refresh]);

  return (
    <>
      <UserTbl
        tblData={data}
        loading={isLoading}
        columns={columns}
        title="Clients"
      />
      {isFormOpen && (
       <ClientForm isFormOpen={isFormOpen} setRefresh={setRefresh} />
      )}
    </>
  );
}