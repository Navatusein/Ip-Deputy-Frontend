import {baseApi} from "@/shared/api/base-query.ts";
import {ILoginData, IUser} from "@/entities/user";
import {logout, setUser} from "@/entities/user/model/user-slice.ts";

export const userApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    loginUser: builder.mutation<IUser, ILoginData>({
      query: (loginData) => ({
        url: "/authentication/login",
        method: "POST",
        body: loginData
      }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        queryFulfilled
          .then(data => dispatch(setUser(data.data)))
          .catch(() => logout())
      },
    }),
    loginUserForBot: builder.mutation<IUser, string>({
      query: (initData) => ({
        url: `/authentication/login-bot/${initData}`,
        method: "POST"
      }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        queryFulfilled
          .then(data => dispatch(setUser(data.data)))
          .catch(() => logout())
      },
    }),
  }),
  overrideExisting: false
})