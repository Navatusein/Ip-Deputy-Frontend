import {baseApi} from "@/shared/api/base-query";
import {IStudent} from "@/entities/student";

export const studentApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getStudents: builder.query<IStudent[], void>({
      query: () => ({
        url: "/student",
        method: "GET"
      }),
      providesTags: () => ["Student"]
    }),
    createStudent: builder.mutation<IStudent, IStudent>({
      query: (data) => ({
        url: "/student",
        method: "POST",
        body: data
      }),
      invalidatesTags: ["Student"]
    }),
    updateStudent: builder.mutation<IStudent, IStudent>({
      query: (data) => ({
        url: "/student",
        method: "PUT",
        body: data
      }),
      invalidatesTags: ["Student"]
    }),
    deleteStudent: builder.mutation<void, number>({
      query: (id) => ({
        url: `/student/${id}`,
        method: "DELETE"
      }),
      invalidatesTags: ["Student"]
    }),
  }),
  overrideExisting: false
})