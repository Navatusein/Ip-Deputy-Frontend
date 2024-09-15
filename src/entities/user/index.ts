import {userApi} from "./api/user-api.ts";
import {IJwtPayload, IUser, ILoginData} from "./model/types";
import userReducer from "./model/user-slice.ts";

export type {IUser, IJwtPayload, ILoginData};
export {userReducer, userApi};