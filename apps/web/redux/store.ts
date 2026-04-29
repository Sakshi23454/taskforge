import { configureStore } from "@reduxjs/toolkit";
import { authApi } from "./apis/auth.api";
import { adminApi } from "./apis/admin.api";
import { employeeApi } from "./apis/employee.api";

const reduxStore = configureStore({
    reducer: {
        [authApi.reducerPath]: authApi.reducer,
        [adminApi.reducerPath]: adminApi.reducer,
        [employeeApi.reducerPath]: employeeApi.reducer,
    },
    middleware: def => def().concat(authApi.middleware, adminApi.middleware, employeeApi.middleware)
})

export default reduxStore