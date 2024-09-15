import {WebApp} from "@/shared/hooks/use-telegram";
import {IUser} from "@/entities/user";

export interface IBotLayoutContext {
  telegram: WebApp;
  user: IUser;
}