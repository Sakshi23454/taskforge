import type { Task } from "./admin"

export type GET_TASK_REQUEST = void
export type GET_TASK_RESPONSE = {
    message: string,
    result?: Task[]
}

export type CONVOSEND_CREATE_REQUEST = {
    id?: number,
    userId?: string | number
    taskId: number
    msg: string,
}
export type CONVOSEND_CREATE_RESPONSE = {
    message: string

}
