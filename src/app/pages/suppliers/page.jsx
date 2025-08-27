'use client'
import CompanyTbl from "@/app/Components/companyManagementTbl";
import { useDataFetch } from "@/app/Hooks/useDataFetch";
import { useSelector } from "react-redux";
import UserForm from "@/app/Components/Forms/UserForm";


export default function Page() {
  const url ='';
  const { data } = useDataFetch(url);
  const isFormOpen = useSelector((state) => state.pageDetails.isFormOpen);

    return(
        <>
        <CompanyTbl tblData={data}/>
        {isFormOpen &&
        <UserForm/>
        }
        </>
    )
}