import {baseApi} from "@/shared/api/base-query";
import {ISubjectType} from "@/entities/subject-type";

export const subjectTypeApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getSubjectTypes: builder.query<ISubjectType[], void>({
      query: () => ({
        url: "/subject-type",
        method: "GET"
      }),
      providesTags: () => ["SubjectType"]
    }),
    createSubjectType: builder.mutation<ISubjectType, ISubjectType>({
      query: (data) => ({
        url: "/subject-type",
        method: "POST",
        body: data
      }),
      invalidatesTags: ["SubjectType"]
    }),
    updateSubjectType: builder.mutation<ISubjectType, ISubjectType>({
      query: (data) => ({
        url: "/subject-type",
        method: "PUT",
        body: data
      }),
      invalidatesTags: ["SubjectType"]
    }),
    deleteSubjectType: builder.mutation<void, number>({
      query: (id) => ({
        url: `/subject-type/${id}`,
        method: "DELETE"
      }),
      invalidatesTags: ["SubjectType"]
    })
  }),
  overrideExisting: false
})