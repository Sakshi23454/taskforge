export type Employee = {
    id?: number
    name: string
    email: string
    mobile: string
    profilePic: string | null
    password: string
    department: string | null
    jobRole: string | null
    doj: Date | null
    dob: Date | null
    isDelete: boolean | null
}

export type Task = {
    id: number
    title: string
    desc: string | null
    complete: boolean | null
    due: Date | null
    completeDate: Date | null
    userId: number
    hero: string | null
}

export type UPDATE_PROFILE_REQUEST = {
    id?: number
    name: string
    email: string
    mobile: string
    profile: FileList | undefined
}

export type UPDATE_PROFILE_RESPONSE = { message: string }


export type REGISTER_EMPLOYEE_REQUEST = {
    id?: number
    name: string
    email: string
    mobile: string
    profile?: FileList | undefined
    department: string
    jobRole: string
    doj: Date
    dob: Date
}

export type REGISTER_EMPLOYEE_RESPONSE = { message: string }

export type READ_EMPLOYEE_REQUEST = void

export type READ_EMPLOYEE_RESPONSE = {
    message: string,
    result?: Employee[]
}

export type UPDATE_EMPLOYEE__REQUEST = {
    id?: number
    name: string
    email: string
    mobile: string
    profile: FileList | undefined
    password: string
    department: string
    jobRole: string
    doj: Date
    dob: Date
    isDelete: boolean
}

export type UPDATE_EMPLOYEE_RESPONSE = { message: string }

export type DELETE_EMPLOYEE__REQUEST = { id: number }
export type DELETE_EMPLOYEE_RESPONSE = { message: string }

export type RESTORE_EMPLOYEE__REQUEST = { id: number }
export type RESTORE_EMPLOYEE_RESPONSE = { message: string }

export type CREATE_TASK_REQUEST = {
    title: string,
    userId: number
}
export type CREATE_TASK_RESPONSE = { message: string }

export type FETCH_TASK_REQUEST = void
export type FETCH_TASK_RESPONSE = { message: string, result?: Task[] }

export type UPDATE_TASK_REQUEST = { taskId: number, userId: number }
export type UPDATE_TASK_RESPONSE = { message: string }

export type UPDATE_TASK_DETAILS_REQUEST = { id?: number, title: string, desc?: string, due?: Date, hero?: FileList | null }
export type UPDATE_TASK_DETAILS_RESPONSE = { message: string }

export type DELETE_TASK_REQUEST = { id: number }
export type DELETE_TASK_RESPONSE = { message: string }


export type CONVOSEND_FETCH_REQUEST = void
export type CONVOSEND_FETCH_RESPONSE = {
    message: string,
    result?: {
        id?: number,
        userId: number
        taskId: number
        msg: string | null,
        name: string | null,
        profilePic: string | null
    }[]

}