'use client'
import UserTbl from "@/app/Components/Tables/userTable";
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState, useCallback } from "react";
import axiosInstance from "@/app/API/axiosInterceptor";
import { setFormOpen } from "@/app/store/slices/getPageDetailsSlice";
import ProductForm from "@/app/Components/Forms/ProductForm";

export default function Page() {
  const isFormOpen = useSelector((state) => state.pageDetails.isFormOpen);
  const dispatch = useDispatch();
  const [data, setData] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const [refresh, setRefresh] = useState(false);


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

  // Table columns for clients
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

  // Fetch client data
  async function getProductData() {
    setLoading(true);
    try {
      const response = await axiosInstance.get("/clients", {
        params: {
          page: 1,
          limit: 10,
          populate: true
        }
      });
      setData(null);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    getProductData();
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
       
      <ProductForm isFormOpen={isFormOpen} setRefresh={setRefresh}/>
      )}
    </>
  );
}