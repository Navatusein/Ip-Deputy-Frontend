import {baseApi} from "@/shared/api/base-query";
import {ISubmissionsConfig} from "src/entities/submission";

export const submissionConfigApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getSubmissionsConfigs: builder.query<ISubmissionsConfig[], void>({
      query: () => ({
        url: "/submissions-config",
        method: "GET"
      }),
      providesTags: () => ["SubmissionsConfig"]
    }),
    getSubmissionsConfigsForStudent: builder.query<ISubmissionsConfig[], {studentId: number, otherSubgroups: boolean}>({
      query: ({studentId, otherSubgroups}) => ({
        url: `/submissions-config/for-student/${studentId}/${otherSubgroups}`,
        method: "GET"
      }),
      providesTags: () => ["SubmissionsConfig"]
    }),
    createSubmissionsConfig: builder.mutation<ISubmissionsConfig, ISubmissionsConfig>({
      query: (data) => ({
        url: "/submissions-config",
        method: "POST",
        body: data
      }),
      invalidatesTags: ["SubmissionsConfig"]
    }),
    updateSubmissionsConfig: builder.mutation<ISubmissionsConfig, ISubmissionsConfig>({
      query: (data) => ({
        url: "/submissions-config",
        method: "PUT",
        body: data
      }),
      invalidatesTags: ["SubmissionsConfig"]
    }),
    deleteSubmissionsConfig: builder.mutation<void, number>({
      query: (id) => ({
        url: `/submissions-config/${id}`,
        method: "DELETE"
      }),
      invalidatesTags: ["SubmissionsConfig"]
    })
  }),
  overrideExisting: false
})