import { APP_URL } from "@/config/env"
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import { CONVOSEND_CREATE_REQUEST, CONVOSEND_CREATE_RESPONSE, CONVOSEND_FETCH_REQUEST, CONVOSEND_FETCH_RESPONSE, GET_TASK_RESPONSE } from "@repo/types"

export const employeeApi = createApi({
    reducerPath: "employeeApi",
    baseQuery: fetchBaseQuery({ baseUrl: `/api/employee`, credentials: "include" }),
    tagTypes: ["task"],
    endpoints: (builder) => {
        return {
            getTasks: builder.query<GET_TASK_RESPONSE, void>({
                query: () => {
                    return {
                        url: "/tasks",
                        method: "GET"
                    }
                },
                providesTags: ["task"]
            }),
            Postconvosendlogic: builder.mutation<CONVOSEND_CREATE_RESPONSE, CONVOSEND_CREATE_REQUEST>({
                query: userData => {
                    return {
                        url: "/convoSend",
                        method: "POST",
                        body: userData
                    }
                },
            }),
        }
    }
})

export const { useGetTasksQuery, usePostconvosendlogicMutation} = employeeApi
