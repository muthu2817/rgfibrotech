'use client'
import { useEffect, useState } from "react";
import CreateForm from "@/app/Components/Forms/StoreForm";
import { useSelector } from "react-redux";
import CompanyManagementTable from "@/app/Components/companyManagementTbl";

// Define columns for consumables table
const consumablesColumns = [
  {
    header: "ID",
    accessorKey: "id",
    cell: info => info.getValue(),
  },
  {
    header: "Item Name",
    accessorKey: "itemName",
  },
  {
    header: "Item Number",
    accessorKey: "itemNumber",
  },
  {
    header: "Specification",
    accessorKey: "specification",
  },
  {
    header: "In Stock",
    accessorKey: "inStock",
  },
  {
    header: "Status",
    accessorKey: "status",
  },
  {
    header: "Min Stock",
    accessorKey: "minStock",
  },
  {
    header: "Max Stock",
    accessorKey: "maxStock",
  },
];

export default function Page() {
  const [data, setData] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const isFormOpen = useSelector((state) => state.pageDetails.isFormOpen);

  // For testing: load mock data from a local JSON file and pass to CompanyManagementTable
  useEffect(() => {
    async function fetchConsumables() {
      setLoading(true);
      try {
        const mockData = await import('@/public/mock_data.json');
        setData(mockData.default || []);
      } catch (error) {
        setData([]);
      } finally {
        setLoading(false);
      }
    }
    fetchConsumables();
  }, [refresh]);

  return (
    <>
      <CompanyManagementTable
        data={data}
        columns={consumablesColumns}
        loading={isLoading}
        pageSize={30}
        emptyMessage="No consumables found"
      />
      {isFormOpen &&
        <CreateForm setRefresh={setRefresh} />
      }
    </>
  )
} 