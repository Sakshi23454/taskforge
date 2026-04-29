import { APP_URL } from "@/config/env"
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import { CONVOSEND_FETCH_REQUEST, CONVOSEND_FETCH_RESPONSE, CREATE_TASK_REQUEST, CREATE_TASK_RESPONSE, DELETE_EMPLOYEE__REQUEST, DELETE_EMPLOYEE_RESPONSE, FETCH_TASK_REQUEST, FETCH_TASK_RESPONSE, ME_REQUEST, ME_RESPONSE, READ_EMPLOYEE_REQUEST, READ_EMPLOYEE_RESPONSE, REGISTER_EMPLOYEE_RESPONSE, RESTORE_EMPLOYEE__REQUEST, RESTORE_EMPLOYEE_RESPONSE, UPDATE_EMPLOYEE_RESPONSE, UPDATE_PROFILE_REQUEST, UPDATE_PROFILE_RESPONSE, UPDATE_TASK_REQUEST, UPDATE_TASK_RESPONSE } from "@repo/types"
import { DELETE_TASK_REQUEST, DELETE_TASK_RESPONSE, UPDATE_TASK_DETAILS_REQUEST, UPDATE_TASK_DETAILS_RESPONSE } from "@repo/types/src/admin"

export const adminApi = createApi({
    reducerPath: "adminApi",
    baseQuery: fetchBaseQuery({ baseUrl: `${APP_URL}/api/admin`, credentials: "include" }),
    tagTypes: ["profile", "employee", "task"],
    endpoints: (builder) => {
        return {
            updateProfile: builder.mutation<UPDATE_PROFILE_RESPONSE, { id: number, fd: FormData }>({
                query: userData => {
                    return {
                        url: `/update-profile/${userData.id}`,
                        method: "PUT",
                        body: userData.fd
                    }
                },
                invalidatesTags: ["profile"]
            }),

            fetchme: builder.query<ME_RESPONSE, ME_REQUEST>({
                query: () => {
                    return {
                        url: "/me",
                        method: "GET",
                    }
                },
                providesTags: ["profile"]
            }),
            getEmployees: builder.query<READ_EMPLOYEE_RESPONSE, READ_EMPLOYEE_REQUEST>({
                query: () => {
                    return {
                        url: "/employee",
                        method: "GET",
                    }
                },
                providesTags: ["employee"]
            }),
            registerEmployee: builder.mutation<REGISTER_EMPLOYEE_RESPONSE, FormData>({
                query: (employeeData) => {
                    return {
                        url: "/employee-register",
                        method: "POST",
                        body: employeeData
                    }
                },
                invalidatesTags: ["employee"]
            }),
            deleteEmployee: builder.mutation<DELETE_EMPLOYEE_RESPONSE, DELETE_EMPLOYEE__REQUEST>({
                query: (empData) => {
                    return {
                        url: "/employee-delete/" + empData.id,
                        method: "DELETE",
                    }
                },
                invalidatesTags: ["employee"]
            }),
            restoreEmployee: builder.mutation<RESTORE_EMPLOYEE_RESPONSE, RESTORE_EMPLOYEE__REQUEST>({
                query: (empData) => {
                    return {
                        url: "/employee-restore/" + empData.id,
                        method: "POST",
                    }
                },
                invalidatesTags: ["employee"]
            }),
            updateEmployee: builder.mutation<UPDATE_EMPLOYEE_RESPONSE, { id: number, fd: FormData }>({
                query: (empData) => {
                    return {
                        url: "/employee-update/" + empData.id,
                        method: "PUT",
                        body: empData.fd
                    }
                },
                invalidatesTags: ["employee"]
            }),
            createTask: builder.mutation<CREATE_TASK_RESPONSE, CREATE_TASK_REQUEST>({
                query: (taskData) => {
                    return {
                        url: "/task-create",
                        method: "POST",
                        body: taskData
                    }
                },
                invalidatesTags: ["task"]
            }),
            fetchTask: builder.query<FETCH_TASK_RESPONSE, FETCH_TASK_REQUEST>({
                query: (taskData) => {
                    return {
                        url: "/task-fetch",
                        method: "GET",
                    }
                },
                providesTags: ["task"]
            }),
            updateTask: builder.mutation<UPDATE_TASK_RESPONSE, UPDATE_TASK_REQUEST>({
                query: (taskData) => {
                    return {
                        url: "/task-update",
                        method: "POST",
                        body: taskData
                    }
                },
                invalidatesTags: ["task"]
            }),
            updateTaskDetails: builder.mutation<UPDATE_TASK_DETAILS_RESPONSE, { id: number, fd: FormData }>({
                query: (taskData) => {
                    return {
                        url: "/task-details-update/" + taskData.id,
                        method: "PUT",
                        body: taskData.fd
                    }
                },
                invalidatesTags: ["task"]
            }),
            deleteTask: builder.mutation<DELETE_TASK_RESPONSE, DELETE_TASK_REQUEST>({
                query: (taskData) => {
                    return {
                        url: "/task-delete/" + taskData.id,
                        method: "DELETE",
                    }
                },
                invalidatesTags: ["task"]
            }),
            Getconvosendlogic: builder.query<CONVOSEND_FETCH_RESPONSE, CONVOSEND_FETCH_REQUEST>({
                query: userData => {
                    return {
                        url: "/convoFetch",
                        method: "GET",
                        headers: {
                            "Cache-Control": "no-cache"
                        }
                    }
                },
            }),
        }
    }
})

export const { useUpdateProfileMutation, useFetchmeQuery, useGetEmployeesQuery, useRegisterEmployeeMutation, useDeleteEmployeeMutation, useRestoreEmployeeMutation, useUpdateEmployeeMutation, useCreateTaskMutation, useFetchTaskQuery, useUpdateTaskMutation, useDeleteTaskMutation, useUpdateTaskDetailsMutation, useGetconvosendlogicQuery } = adminApi
