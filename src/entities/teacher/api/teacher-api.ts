import {baseApi} from "@/shared/api/base-query";
import {ITeacher} from "@/entities/teacher";

export const teacherApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getTeachers: builder.query<ITeacher[], void>({
      query: () => ({
        url: "/teacher",
        method: "GET"
      }),
      providesTags: () => ["Teacher"]
    }),
    createTeacher: builder.mutation<ITeacher, ITeacher>({
      query: (data) => ({
        url: "/teacher",
        method: "POST",
        body: data
      }),
      invalidatesTags: ["Teacher"]
    }),
    updateTeacher: builder.mutation<ITeacher, ITeacher>({
      query: (data) => ({
        url: "/teacher",
        method: "PUT",
        body: data
      }),
      invalidatesTags: ["Teacher"]
    }),
    deleteTeacher: builder.mutation<void, number>({
      query: (id) => ({
        url: `/teacher/${id}`,
        method: "DELETE"
      }),
      invalidatesTags: ["Teacher"]
    })
  }),
  overrideExisting: false
})