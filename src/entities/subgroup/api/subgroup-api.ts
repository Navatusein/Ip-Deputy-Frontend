import {baseApi} from "@/shared/api/base-query";
import {ISubgroup} from "@/entities/subgroup";

export const subgroupApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getSubgroups: builder.query<ISubgroup[], void>({
      query: () => ({
        url: "/subgroup",
        method: "GET"
      }),
      providesTags: () => ["Subgroup"]
    }),
    createSubgroup: builder.mutation<ISubgroup, ISubgroup>({
      query: (data) => ({
        url: "/subgroup",
        method: "POST",
        body: data
      }),
      invalidatesTags: ["Subgroup"]
    }),
    updateSubgroup: builder.mutation<ISubgroup, ISubgroup>({
      query: (data) => ({
        url: "/subgroup",
        method: "PUT",
        body: data
      }),
      invalidatesTags: ["Subgroup"]
    }),
    deleteSubgroup: builder.mutation<void, number>({
      query: (id) => ({
        url: `/subgroup/${id}`,
        method: "DELETE"
      }),
      invalidatesTags: ["Subgroup"]
    })
  }),
  overrideExisting: false
})