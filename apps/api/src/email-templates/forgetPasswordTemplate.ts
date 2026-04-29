// const { baseTemplate } = require("./baseTemplate")

import { baseTemplate } from "./baseTemplate"

export const forgetPasswordTemplate = ({ name, resetLink }: { name: string, resetLink: string }) => {
    const content = `
        <h2>Request Password Reset</h2>
        <p>Hi, ${name}</p>
        <p>You have requested to reset password</p>
        <a href='${resetLink}'>Reset Password</a>
        <p>This Link will expire in 15 min</p>
        <p>If you not request to reset password, please ignore this email</p>
    `

    return baseTemplate({
        title: "",
        content
    })
}