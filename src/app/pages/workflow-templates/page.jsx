'use client'
import { useEffect, useState, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import axiosInstance from "@/app/API/axiosInterceptor";
import UserTbl from "@/app/Components/Tables/userTable";
import BomCreateForm from "@/app/Components/Forms/BomForm";
import Popup from "@/app/Components/Popup";
import { setFormOpen } from "@/app/store/slices/getPageDetailsSlice";
import Header from "@/app/Components/Header";
import PageHeader from "@/app/Components/PageHeader";
import CreateBtn from "@/app/Components/Buttons/createBtn";
// import { useDataFetch } from "@/app/Hooks/useDataFetch"; // Not needed
import WorkflowForm from "@/app/Components/Forms/WorkflowForm";

export default function Page() {
  const [data, setData] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const isFormOpen = useSelector((state) => state.pageDetails.isFormOpen);
  const dispatch = useDispatch(); // FIX: useDispatch instead of useDataFetch


  const HandleFormOpen = useCallback(() => {
    dispatch(setFormOpen(!isFormOpen));
}, [dispatch]);

  // Fetch BOM data
  async function getWorkflowTemplateData() {
    try {
      const response = await axiosInstance.get("/workflow-templates", {
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
    getWorkflowTemplateData();
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
    <Header title={'Workflow Templates'} />
            <PageHeader leftContent={<CreateBtn onClick={()=>HandleFormOpen()}/>}>
                  </PageHeader>

      <div className="grid grid-cols-4 gap-x-4 justify-between px-6">
        {
          data.map((item,index)=>
          {
            return <div key={index} className="bg-white rounded-md border border-[#e3e3e3] overflow-hidden">
              <div className="px-4 py-3 bg-[#f3f3f3] border-b border-b-[#e3e3e3]">
                  <p className="text-sm text-black font-medium">{item.name}</p>
              </div>
              <div className="px-4 py-3">
                <p className="text-sm font-medium text-[#959595] mb-3">Stages</p>
                {
                  item.stages.map((stage,i)=>
                  {
                    return <div key={i} className="mb-2">
                          <p className="text-sm capitalize">Stage {stage.sequence} - {stage.stage} ({stage.estimatedDuration} Hrs)</p>
                    </div>
                  })
                }
              </div>
            </div>
          })
        }

      </div>
      {isFormOpen && (
        <WorkflowForm isFormOpen={isFormOpen}/>
      )}
    </>
  );
}