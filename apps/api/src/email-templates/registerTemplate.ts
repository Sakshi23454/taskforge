// const { baseTemplate } = require("./baseTemplate")

import { baseTemplate } from "./baseTemplate"

export const registerTemplate = ({ name, password }: { name: string, password: string }) => {
    const content = `
        <h2>Welcome to Taskforge</h2>
        <p>Hi, ${name} </p>
        <p>Thank you for choosing Taskforge</p>
        <p>your temporary password is ${password}</p>
    `
    return baseTemplate({
        title: "welcome to Taskforge",
        content
    })
}