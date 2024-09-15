import {baseApi} from "@/shared/api/base-query";
import {ICoupleTime} from "@/entities/couple-time";

export const coupleTimeApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCoupleTimes: builder.query<ICoupleTime[], void>({
      query: () => ({
        url: "/couple-time",
        method: "GET"
      }),
      providesTags: () => ["CoupleTime"]
    })
  }),
  overrideExisting: false
})