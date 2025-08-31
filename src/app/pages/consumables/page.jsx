'use client'
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setFormOpen } from "@/app/store/slices/getPageDetailsSlice";
import UserTbl from "@/app/Components/Tables/userTable";
import CreateForm from "@/app/Components/Forms/ConsumableForm";
import axiosInstance from "@/app/API/axiosInterceptor";

// Status badge styles
const statusStyles = {
  'In Stock': 'px-2 py-1 text-xs rounded-full font-medium bg-green-100 text-green-600',
  'Min Stock': 'px-2 py-1 text-xs rounded-full font-medium bg-red-100 text-red-600',
  'Max Stock': 'px-2 py-1 text-xs rounded-full font-medium bg-orange-100 text-orange-600',
};

// Render stock status badge
const renderStockStatus = ({ row }) => {
  const { minStock, maxStock, inStock } = row.original || {};
  const min = Math.ceil(Number(minStock) || 0);
  const max = Math.ceil(Number(maxStock) || 0);
  const qty = Math.ceil(Number(inStock) || 0);

  let value = 'In Stock';
  if (qty <= min) value = 'Min Stock';
  else if (qty >= max) value = 'Max Stock';

  const badgeClass = statusStyles[value] || 'bg-gray-100 text-gray-600';
  return <span className={badgeClass}>{value}</span>;
};

// Table columns for consumables
const consumablesColumns = [
  {
    header: "Part Name",
    accessorKey: "itemName",
  },
  {
    header: "Part Number",
    accessorKey: "itemNumber",
  },
  {
    header: "Specification",
    accessorKey: "description",
  },
  {
    header: "In Stock",
    accessorKey: "inStock",
  },
  {
    header: "Status",
    id: "status",
    cell: renderStockStatus
  },
  {
    header: "Min Stock",
    accessorKey: "minStock",
  },
  {
    header: "Max Stock",
    accessorKey: "maxStock",
  }
];

export default function Page() {
  const [data, setData] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const isFormOpen = useSelector((state) => state.pageDetails.isFormOpen);
  const dispatch = useDispatch();

  // Fetch consumable data
  async function getConsumableData() {
    setLoading(true);
    try {
      const response = await axiosInstance.get("/consumables", {
        params: {
          page: 1,
          limit: 10,
          populate: true
        }
      });
      setData(response.data.data || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getConsumableData();
    // eslint-disable-next-line
  }, [refresh]);

  return (
    <>
      <UserTbl
        tblData={data}
        loading={isLoading}
        columns={consumablesColumns}
        title="Consumables"
      />
      {isFormOpen && (
        <CreateForm isFormOpen={isFormOpen} setRefresh={setRefresh} />
      )}
    </>
  );
}