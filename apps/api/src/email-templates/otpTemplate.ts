// const { baseTemplate } = require("./baseTemplate")

import { baseTemplate } from "./baseTemplate"

export const otpTemplate = ({ name, otp, min, sec }: { name: string, otp: string, min: string, sec: string }) => {
    const content = `
        <h2>OTP</h2>
        <p>Hi, ${name}</p>
        <p>Please use Following OTP</p>
        <h1>${otp}</h1>
        <p>This OTP will expire in ${min} min (${sec} sec)</p>
        <p>If you did not request this, please ignore this email</p>
    `

    return baseTemplate({
        title: "",
        content
    })
}