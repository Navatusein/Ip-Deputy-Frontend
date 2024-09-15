import {baseApi} from "@/shared/api/base-query";
import {IAdditionalCouple} from "@/entities/additional-couple";

export const additionalCoupleApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAdditionalCouples: builder.query<IAdditionalCouple[], void>({
      query: () => ({
        url: "/additional-couple",
        method: "GET"
      }),
      providesTags: () => ["AdditionalCouple"]
    }),
    createAdditionalCouple: builder.mutation<IAdditionalCouple, IAdditionalCouple>({
      query: (data) => ({
        url: "/additional-couple",
        method: "POST",
        body: data
      }),
      invalidatesTags: ["AdditionalCouple"]
    }),
    updateAdditionalCouple: builder.mutation<IAdditionalCouple, IAdditionalCouple>({
      query: (data) => ({
        url: "/additional-couple",
        method: "PUT",
        body: data
      }),
      invalidatesTags: ["AdditionalCouple"]
    }),
    deleteAdditionalCouple: builder.mutation<void, number>({
      query: (id) => ({
        url: `/additional-couple/${id}`,
        method: "DELETE"
      }),
      invalidatesTags: ["AdditionalCouple"]
    })
  }),
  overrideExisting: false
})