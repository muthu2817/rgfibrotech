'use client'
import Header from "../../Components/Header";
import StoreTable from "../../Components/storeManagementTbl";
import { useDataFetch } from "@/app/Hooks/useDataFetch";
import { useTrackRoute } from '@/app/Hooks/useTrackRoute';
import CreateForm from "@/app/Components/Forms/StoreForm";
import { useSelector } from "react-redux";

export default function Page() {
  const url = '/Products_data.json';
  const { data } = useDataFetch(url);
  const isFormOpen = useSelector((state) => state.pageDetails.isFormOpen);


  // update state
  useTrackRoute();

  return (
    <>
      <StoreTable tblData={data} />
      {isFormOpen &&
        <CreateForm />
      }
    </>
  )
  }