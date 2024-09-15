import {
  BaseQueryFn,
  FetchArgs,
  fetchBaseQuery,
  FetchBaseQueryError,
  FetchBaseQueryMeta
} from "@reduxjs/toolkit/query";
import {RootState} from "@/app/store.ts";
import {createApi} from "@reduxjs/toolkit/query/react";
import {IUser} from "@/entities/user";
import {logout, setUser} from "@/entities/user/model/user-slice.ts";
import {jwtDecoder} from "@/shared/helpers/jwt-decoder.ts";


const API_URL = import.meta.env.VITE_API_URL;

const baseQuery = fetchBaseQuery({
  baseUrl: API_URL,
  credentials: "include",
  prepareHeaders: (headers, {getState}) => {
    const {user} = (getState() as RootState).user;

    if (user?.jwtToken)
      headers.set("Authorization", `Bearer ${user?.jwtToken}`)

    return headers
  }
})

const baseQueryWithRefresh: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError, object, FetchBaseQueryMeta> = async (args, api, extraOptions)  => {
  let result = await baseQuery(args, api, extraOptions)
  let {user} = (api.getState() as RootState).user;

  const jwtPayload = jwtDecoder(user?.jwtToken)

  if (result?.error?.status === 401 && user !== undefined && jwtPayload !== undefined && jwtPayload.refresh) {
    const refreshResult = await baseQuery({
      url: "/authentication/refresh",
      method: "POST",
      body: user
    }, api, extraOptions)

    if (refreshResult?.error) {
      console.error(refreshResult.error);
      api.dispatch(logout());
      return result;
    }

    user = (refreshResult.data) as IUser;

    api.dispatch(setUser(user!));

    result = await baseQuery(args, api, extraOptions)
  }
  else if (result?.error?.status === 401 && user !== undefined && jwtPayload !== undefined && !jwtPayload.refresh) {
    api.dispatch(logout());
  }

  return result;
}

const baseApi = createApi({
  reducerPath: "baseApi",
  baseQuery: baseQueryWithRefresh,
  tagTypes: [
    "AdditionalCouple",
    "Couple",
    "CoupleTime",
    "Student",
    "StudentTelegram",
    "Subgroup",
    "Subject",
    "SubjectType",
    "SubmissionStudent",
    "SubmissionsConfig",
    "Teacher"
  ],
  endpoints: () => ({})
});

export {baseQueryWithRefresh, baseApi};