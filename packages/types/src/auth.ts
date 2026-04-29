export type LOGIN_REQUEST = {
    email: string,
    password: string,
}

export type LOGIN_RESPONSE = {
    message: string,
    result?: {
        id: number,
        name: string,
        email: string,
        mobile: string,
        role: string,
    },
}

export type LOGOUT_REQUEST = void
export type LOGOUT_RESPONSE = { message: string }

export type ME_REQUEST = void
export type ME_RESPONSE = {
    message: string,
    result?: {
        id: number,
        name: string,
        email: string,
        mobile: string,
        role: string,
        profilePic: string
    }
}