'use client'
import { usePathname } from "next/navigation";
import { useDispatch } from "react-redux";
import { fetchPageDetailsSuccess } from "../store/slices/getPageDetailsSlice";
import { useEffect } from "react";

export const useTrackRoute = () => {
  const routename = usePathname();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchPageDetailsSuccess(routename));
  }, [routename, dispatch]);
}