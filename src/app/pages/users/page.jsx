'use client'
import CompanyTbl from "@/app/Components/companyManagementTbl";
import { useDataFetch } from "@/app/Hooks/useDataFetch";
import UserForm from "@/app/Components/Forms/UserForm";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUsers } from "@/app/store/slices/getUserSlice";
// Remove duplicate useSelector import

export default function Page() {
  const dispatch = useDispatch();
  const users = useSelector((state) => state.Users.UserItem);
  const isFormOpen = useSelector((state) => state.pageDetails.isFormOpen);
  const loading = useSelector((state) => state.Users.loading);

  useEffect(() => {
    if (dispatch && typeof dispatch === "function") {
      dispatch(fetchUsers());
    }
  }, [dispatch]);

  return (
    <>
      <CompanyTbl tblData={users} loading={loading} />
      {isFormOpen && <UserForm />}
    </>
  );
}

