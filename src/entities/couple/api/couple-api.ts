import {baseApi} from "@/shared/api/base-query";
import {ICouple} from "@/entities/couple";

export const coupleApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCouples: builder.query<ICouple[], number>({
      query: (dayOfWeekId) => ({
        url: `/couple/${dayOfWeekId}`,
        method: "GET"
      }),
      providesTags: () => ["Couple"]
    }),
    createCouple: builder.mutation<ICouple, ICouple>({
      query: (data) => ({
        url: "/couple",
        method: "POST",
        body: data
      }),
      invalidatesTags: ["Couple"]
    }),
    updateCouple: builder.mutation<ICouple, ICouple>({
      query: (data) => ({
        url: "/couple",
        method: "PUT",
        body: data
      }),
      invalidatesTags: ["Couple"]
    }),
    deleteCouple: builder.mutation<void, number>({
      query: (id) => ({
        url: `/couple/${id}`,
        method: "DELETE"
      }),
      invalidatesTags: ["Couple"]
    })
  }),
  overrideExisting: false
})