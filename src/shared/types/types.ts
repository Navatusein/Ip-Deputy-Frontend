import {WebApp} from "@/shared/hooks/use-telegram";
import {IUser} from "@/entities/user";
import {Dispatch, SetStateAction} from "react";

export interface IBotLayoutContext {
  telegram: WebApp;
  user: IUser;
}

export interface IDashboardLayoutContext {
  setPageTitle: Dispatch<SetStateAction<string>>
}