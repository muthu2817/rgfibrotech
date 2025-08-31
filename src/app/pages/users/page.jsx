'use client'
import UserTbl from "@/app/Components/Tables/userTable";
import UserForm from "@/app/Components/Forms/UserForm";
import { useEffect,useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUsers } from "@/app/store/slices/getUserSlice";
import axiosInstance from "@/app/API/axiosInterceptor";
import Popup from "@/app/Components/Popup";
import { setFormOpen } from "@/app/store/slices/getPageDetailsSlice";


export default function Page() {
  const [users, setUsers] = useState(null);
  const [isLoading, setLoading] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const isFormOpen = useSelector((state) => state.pageDetails.isFormOpen);
  const dispatch = useDispatch(); // FIX: useDispatch instead of useDataFetch

  

  async function getUserData() {
    try {
      const response = await axiosInstance.get("/users", {
        params: {
          page: 1,
          limit: 10,
          populate: true
        }
      });
      
      setUsers(response.data.data.users);
      setLoading(true);
    } catch (error) {
      setData([]);
      console.error("Error fetching BOM data:", error);
    } 
  }

  useEffect(()=>{
    getUserData();
    console.log(users)
  },[refresh])
  // Define columns for the user table (example, adjust as needed)

  const statusStyles = {
    true: 'px-2 py-1 text-xs rounded-full font-medium bg-green-100 text-green-600',
    false: 'px-2 py-1 text-xs rounded-full font-medium bg-red-100 text-red-600',
  };
  const columns = [
    {
      header: "User Name",
      accessorKey: "name",
      cell: ({ row }) => {
        const { firstName, lastName } = row.original;
        return (
          <span>
            {firstName || ''} {lastName || ''}
          </span>
        );
      },
    },
    {
      header: "Email ID",
      accessorKey: "email",
    },
    {
      header: "Department",
      accessorKey: "department",
      cell:({row})=>{
        const department = row.original.departmentInfo?.name;
        return (
          <span>
            {department ? department : "NA"}
          </span>
        );
      }
    },
    {
      header: "Status",
      accessorKey: "isActive",
      cell: ({ row }) => {
        const isActive = row.original.isActive;
        return (
          <span className={statusStyles[isActive]}>
            {isActive ? "Active" : "Inactive"}
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
    },
    // Add more columns as needed
  ];

  return (
    <>
      <UserTbl
        tblData={users}
        loading={isLoading}
        columns={columns}
        title="Users"
      />
      {isFormOpen && 
      <Popup
      isOpen={isFormOpen}
      onClose={() => dispatch(setFormOpen(false))}
      title="Create User"
      showCloseButton={true}
      overlayClickToClose={true}
      size="large"
      onCancel={() => dispatch(setFormOpen(false))}
      onSubmit={() => {
        // Trigger form submission by clicking the form's submit button
        const form = document.getElementById('MainFormComponent');
        if (form) {
          form.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
        }
      }}
      submitButtonText="Create"
      >
      
      
      <UserForm />
      </Popup>
}
    </>
  );
}
