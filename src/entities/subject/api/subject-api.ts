import {baseApi} from "@/shared/api/base-query";
import {ISubject} from "@/entities/subject";

export const subjectApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getSubjects: builder.query<ISubject[], void>({
      query: () => ({
        url: "/subject",
        method: "GET"
      }),
      providesTags: () => ["Subject"]
    }),
    createSubject: builder.mutation<ISubject, ISubject>({
      query: (data) => ({
        url: "/subject",
        method: "POST",
        body: data
      }),
      invalidatesTags: ["Subject"]
    }),
    updateSubject: builder.mutation<ISubject, ISubject>({
      query: (data) => ({
        url: "/subject",
        method: "PUT",
        body: data
      }),
      invalidatesTags: ["Subject"]
    }),
    deleteSubject: builder.mutation<void, number>({
      query: (id) => ({
        url: `/subject/${id}`,
        method: "DELETE"
      }),
      invalidatesTags: ["Subject"]
    })
  }),
  overrideExisting: false
})