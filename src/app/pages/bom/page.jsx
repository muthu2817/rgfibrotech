'use client'
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import axiosInstance from "@/app/API/axiosInterceptor";
import UserTbl from "@/app/Components/Tables/userTable";
import BomCreateForm from "@/app/Components/Forms/BomForm";
import Popup from "@/app/Components/Popup";
import { setFormOpen } from "@/app/store/slices/getPageDetailsSlice";
// import { useDataFetch } from "@/app/Hooks/useDataFetch"; // Not needed

export default function Page() {
  const [data, setData] = useState(null);
  const [isLoading, setLoading] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const isFormOpen = useSelector((state) => state.pageDetails.isFormOpen);
  const dispatch = useDispatch(); // FIX: useDispatch instead of useDataFetch

  // Fetch BOM data
  async function getBomData() {
    try {
      const response = await axiosInstance.get("/boms", {
        params: {
          page: 1,
          limit: 10,
          populate: true
        }
      });
      
      setData(response.data.data);
      setLoading(true);
    } catch (error) {
      setData([]);
      console.error("Error fetching BOM data:", error);
    } 
  }

  useEffect(() => {
    getBomData();
    // eslint-disable-next-line
  }, [refresh]);

  // Status badge styles
  const statusStyles = {
    'In Stock': 'px-2 py-1 text-xs rounded-full font-medium bg-green-100 text-green-600',
    'Min Stock': 'px-2 py-1 text-xs rounded-full font-medium bg-red-100 text-red-600',
    'Max Stock': 'px-2 py-1 text-xs rounded-full font-medium bg-orange-100 text-orange-600',
  };

  // Render stock status badge
  const renderStockStatus = ({ row }) => {
    const { minStock, maxStock, stock } = row.original || {};
    const min = Math.ceil(Number(minStock) || 0);
    const max = Math.ceil(Number(maxStock) || 0);
    const qty = Math.ceil(Number(stock) || 0);

    let value = 'In Stock';
    if (qty <= min) value = 'Min Stock';
    else if (qty >= max) value = 'Max Stock';

    const badgeClass = statusStyles[value] || 'bg-gray-100 text-gray-600';
    return <span className={badgeClass}>{value}</span>;
  };

  // Table columns
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
      header: 'In Stock'
    },
    {
      id: 'status', header: 'Status', cell: renderStockStatus
    },
    {
      accessorKey: 'minStock',
      header: 'Min Stock'
    },
    {
      accessorKey: 'maxStock',
      header: 'Max Stock'
    }
  ];

  return (
    <>
      <UserTbl tblData={data || []} loading={isLoading} columns={columns} title="Bom's"/>
      {isFormOpen && (
        <Popup
          isOpen={isFormOpen}
          onClose={() => dispatch(setFormOpen(false))}
          title="Create Bill Of Material (BOM)"
          showCloseButton={true}
          overlayClickToClose={true}
        >
          <BomCreateForm setRefresh={setRefresh} />
        </Popup>
      )}
    </>
  );
}