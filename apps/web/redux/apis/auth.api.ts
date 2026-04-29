import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import { APP_URL } from "../../config/env"
import { LOGIN_REQUEST, LOGIN_RESPONSE, LOGOUT_REQUEST, LOGOUT_RESPONSE, ME_REQUEST, ME_RESPONSE } from "@repo/types"

export const authApi = createApi({
    reducerPath: "api",
    baseQuery: fetchBaseQuery({ baseUrl: `${APP_URL}/api/auth`, credentials: "include" }),
    endpoints: (builder) => {
        return {
            signin: builder.mutation<LOGIN_RESPONSE, LOGIN_REQUEST>({
                query: (userData) => {
                    return {
                        url: "/login",
                        method: "POST",
                        body: userData
                    }
                },
            }),
            signout: builder.mutation<LOGOUT_RESPONSE, LOGOUT_REQUEST>({
                query: userData => {
                    return {
                        url: "/logout",
                        method: "POST",
                    }
                },
            }),
        }
    }
})

export const { useSigninMutation, useSignoutMutation } = authApi