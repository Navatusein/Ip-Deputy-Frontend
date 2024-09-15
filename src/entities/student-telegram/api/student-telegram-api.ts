import {baseApi} from "@/shared/api/base-query";
import {IStudentTelegram} from "@/entities/student-telegram"

export const studentTelegramApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getStudentTelegrams: builder.query<IStudentTelegram[], void>({
      query: () => ({
        url: "/telegram",
        method: "GET"
      }),
      providesTags: () => ["StudentTelegram"]
    }),
    createStudentTelegram: builder.mutation<IStudentTelegram, IStudentTelegram>({
      query: (data) => ({
        url: "/telegram",
        method: "POST",
        body: data
      }),
      invalidatesTags: ["StudentTelegram"]
    }),
    updateStudentTelegram: builder.mutation<IStudentTelegram, IStudentTelegram>({
      query: (data) => ({
        url: "/telegram",
        method: "PUT",
        body: data
      }),
      invalidatesTags: ["StudentTelegram"]
    }),
    deleteStudentTelegram: builder.mutation<void, number>({
      query: (id) => ({
        url: `/telegram/${id}`,
        method: "DELETE"
      }),
      invalidatesTags: ["StudentTelegram"]
    })
  }),
  overrideExisting: false
})