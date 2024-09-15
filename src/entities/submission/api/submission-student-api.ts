import {baseApi} from "@/shared/api/base-query";
import {ISubmissionStudent} from "src/entities/submission";

export const submissionStudentApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getSubmissionStudents: builder.query<ISubmissionStudent[], void>({
      query: () => ({
        url: "/submission-student",
        method: "GET"
      }),
      providesTags: () => ["SubmissionStudent"]
    }),
    getSubmissionStudentsByStudentId: builder.query<ISubmissionStudent[], number>({
      query: (studentId) => ({
        url: `/submission-student/by-student/${studentId}`,
        method: "GET"
      }),
      providesTags: () => ["SubmissionStudent"]
    }),
    createSubmissionStudent: builder.mutation<ISubmissionStudent, ISubmissionStudent>({
      query: (data) => ({
        url: "/submission-student",
        method: "POST",
        body: data
      }),
      invalidatesTags: ["SubmissionStudent", "SubmissionsConfig"]
    }),
    updateSubmissionStudent: builder.mutation<ISubmissionStudent, ISubmissionStudent>({
      query: (data) => ({
        url: "/submission-student",
        method: "PUT",
        body: data
      }),
      invalidatesTags: ["SubmissionStudent", "SubmissionsConfig"]
    }),
    deleteSubmissionStudent: builder.mutation<void, number>({
      query: (id) => ({
        url: `/submission-student/${id}`,
        method: "DELETE"
      }),
      invalidatesTags: ["SubmissionStudent", "SubmissionsConfig"]
    })
  }),
  overrideExisting: false
})