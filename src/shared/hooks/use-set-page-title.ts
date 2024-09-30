import {useOutletContext} from "react-router-dom";
import {IDashboardLayoutContext} from "@/shared/types/types.ts";
import {useEffect} from "react";

export function useSetPageTitle(title: string) {
  const {setPageTitle} = useOutletContext<IDashboardLayoutContext>();
  useEffect(() => setPageTitle(title))
}