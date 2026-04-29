"use client"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Field, FieldGroup } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useDeleteEmployeeMutation, useGetEmployeesQuery, useRegisterEmployeeMutation, useRestoreEmployeeMutation, useUpdateEmployeeMutation } from "@/redux/apis/admin.api"
import { Employee, REGISTER_EMPLOYEE_REQUEST } from "@repo/types"
import { toast } from "sonner"
import { ZodType, z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"



import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { MoreHorizontalIcon } from "lucide-react"
import { format } from "date-fns"
import { useState } from "react"
import { Avatar, AvatarImage } from "@/components/ui/avatar"



export default function EmployeeDashboard() {
    const [show, setShow] = useState(false)
    const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null)
    const [showEditImage, setShowEditImage] = useState(true)
    const closeDialog = () => {
        setShow(false)
        setSelectedEmployee(null)
        reset({
            name: "",
            email: "",
            mobile: "",
            doj: new Date(),
            dob: new Date(),
            department: "",
            jobRole: "",
        })
    }

    const RegisterEmployeeSchema = z.object({
        name: z.string().min(3),
        email: z.string().email(),
        mobile: z.string().min(3),
        // profile: z.instanceof(FileList).optional(),
        profile: z.any(),
        department: z.string().min(3),
        jobRole: z.string().min(3),
        doj: z.coerce.date(),
        dob: z.coerce.date(),
    }) satisfies z.ZodType<REGISTER_EMPLOYEE_REQUEST>

    const { register, reset, handleSubmit, formState: { errors } } = useForm({ resolver: zodResolver(RegisterEmployeeSchema) })
    const [registeremp, { isLoading }] = useRegisterEmployeeMutation()
    const { data } = useGetEmployeesQuery()
    const [deleteEmployee] = useDeleteEmployeeMutation()
    const [restoreEmployee] = useRestoreEmployeeMutation()
    const [update] = useUpdateEmployeeMutation()


    const handleRegisterEmployee = async (userData: REGISTER_EMPLOYEE_REQUEST) => {
        try {
            // console.log("called");

            const fd = new FormData()
            fd.append("name", userData.name)
            fd.append("email", userData.email)
            fd.append("mobile", userData.mobile)
            fd.append("department", userData.department)
            fd.append("jobRole", userData.jobRole)
            fd.append("doj", userData.doj.toLocaleString())
            fd.append("dob", userData.dob.toLocaleString())
            if (userData.profile) {
                fd.append("profile", userData.profile[0] as File)
            }
            if (selectedEmployee) {
                // update mutation
                await update({ id: selectedEmployee.id as number, fd }).unwrap()
                setShow(false)
                toast.success("employee update success")
            } else {
                const data = await registeremp(fd).unwrap()
                setShow(false)
                reset()
                console.log("employee register success", data)
                toast.success("employee register success")
            }
        } catch (error) {
            console.log(error)
            toast.error("unable to register employee ")
        }
    }

    const handleDelete = async (id: number) => {
        try {
            await deleteEmployee({ id }).unwrap()
            toast.success("employee delete success")
        } catch (error) {
            console.log(error)
            toast.error("unable to delete employee")
        }
    }

    const handleRestore = async (id: number) => {
        try {
            await restoreEmployee({ id }).unwrap()
            toast.success("employee restore success")
        } catch (error) {
            console.log(error)
            toast.error("unable to restore employee")
        }
    }

    const handleEdit = async (employeeData: Employee) => {
        setShow(true)
        setSelectedEmployee(employeeData)
        reset({
            name: employeeData.name,
            email: employeeData.email,
            mobile: employeeData.mobile,
            doj: format(employeeData.doj as Date, "yyyy-MM-dd") as unknown as Date,
            dob: format(employeeData.dob as Date, "yyyy-MM-dd") as unknown as Date,
            department: employeeData.department as string,
            jobRole: employeeData.jobRole as string,
        })
    }

    // console.log(errors);


    return (
        <Dialog open={show}>
            <div className="flex justify-end">
                <DialogTrigger asChild>
                    <Button disabled={isLoading} onClick={() => setShow(true)}>Add Employee</Button>
                </DialogTrigger>
            </div>
            <DialogContent isLoading={isLoading} closeDialog={closeDialog} className="sm:max-w-sm max-h-[95vh] overflow-y-auto">
                <form onSubmit={handleSubmit(handleRegisterEmployee)}>
                    <DialogHeader>
                        {
                            selectedEmployee
                                ? <DialogTitle>Update Employee</DialogTitle>
                                : <DialogTitle>Register Employee</DialogTitle>
                        }
                        <DialogDescription>
                            Make changes to your profile from here.
                        </DialogDescription>
                    </DialogHeader>
                    <FieldGroup>
                        <Field>
                            <Label htmlFor="name-1">Name</Label>
                            <Input disabled={isLoading} {...register("name")} id="name-1" name="name" placeholder="John Doe" />
                        </Field>
                        <Field>
                            <Label htmlFor="email">Email</Label>
                            <Input disabled={isLoading} {...register("email")} id="email" name="email" placeholder="john@gmail.com" />
                        </Field>
                        <Field>
                            <Label htmlFor="mobile">Mobile</Label>
                            <Input disabled={isLoading} {...register("mobile")} id="mobile" name="mobile" placeholder="xxxxxxxx" />
                        </Field>
                        <Field>
                            {
                                selectedEmployee && showEditImage
                                    ? <>
                                        <img src={selectedEmployee.profilePic as string} height={100} alt="" style={{ width: "100px" }} />
                                        <Button onClick={() => setShowEditImage(false)} variant={"secondary"}>Change Image</Button>
                                    </>
                                    : <>
                                        <Label htmlFor="profile">profile</Label>
                                        <Input disabled={isLoading} {...register("profile")} type="file" id="profile" name="profile" />
                                        {!showEditImage && <Button variant="secondary" onClick={() => setShowEditImage(true)}>Cancel</Button>}
                                    </>
                            }
                        </Field>
                        <Field>
                            <Label htmlFor="department">department</Label>
                            <Input disabled={isLoading} {...register("department")} id="department" name="department" placeholder="enter your department" />
                        </Field>
                        <Field>
                            <Label htmlFor="jobRole">job Role</Label>
                            <Input disabled={isLoading} {...register("jobRole")} id="jobRole" name="jobRole" placeholder="Job Role" />
                        </Field>
                        <Field>
                            <Label htmlFor="doj">Date of joining</Label>
                            <Input disabled={isLoading} type="date" {...register("doj")} id="doj" name="doj" placeholder="yyyy-MM-dd" />
                        </Field>
                        <Field>
                            <Label htmlFor="dob">Date of Birth</Label>
                            <Input disabled={isLoading} type="date" {...register("dob")} id="dob" name="dob" placeholder="yyyy-MM-dd" />
                        </Field>
                    </FieldGroup>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button disabled={isLoading} onClick={closeDialog} type="button" variant="outline" className="mt-5">Cancel</Button>
                        </DialogClose>
                        {
                            selectedEmployee
                                ? <Button className="mt-5" type="submit">Update Employee</Button>
                                : <Button disabled={isLoading} className="mt-5" type="submit">Add Employee</Button>
                        }
                    </DialogFooter>
                </form>
            </DialogContent>

            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>id</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Mobile</TableHead>
                        <TableHead>Department</TableHead>
                        <TableHead>Job Role</TableHead>
                        <TableHead>Date of joining</TableHead>
                        <TableHead>Date of Birth</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {
                        data && data.result?.map(item => <TableRow key={item.id} className={`${item.isDelete ? "bg-red-200" : "bg-green-100"}`}>
                            <TableCell>{item.id}</TableCell>
                            <TableCell>
                                <Avatar className="font-medium flex gap-1 items-center">
                                    <AvatarImage src={item.profilePic as string}></AvatarImage>
                                </Avatar>
                                {item.name}</TableCell>
                            <TableCell>{item.email}</TableCell>
                            <TableCell>{item.mobile}</TableCell>
                            <TableCell>{item.department}</TableCell>
                            <TableCell>{item.jobRole}</TableCell>
                            <TableCell>{item.doj ? format(new Date(item.doj), "yyyy-MM-dd") : "N/A"}</TableCell>
                            <TableCell>{item.dob ? format(new Date(item.dob), "yyyy-MM-dd") : "N/A"}</TableCell>
                            <TableCell className="text-right">
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="icon" className="size-8">
                                            <MoreHorizontalIcon />
                                            <span className="sr-only">Open menu</span>
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuItem onClick={() => handleEdit(item)}>Edit</DropdownMenuItem>
                                        <DropdownMenuSeparator />
                                        {
                                            item.isDelete
                                                ? <DropdownMenuItem onClick={() => handleRestore(item.id as number)} >
                                                    Restore
                                                </DropdownMenuItem>
                                                : <DropdownMenuItem variant="destructive" onClick={() => handleDelete(item.id as number)} >
                                                    Delete
                                                </DropdownMenuItem>
                                        }

                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </TableCell>
                        </TableRow>
                        )
                    }
                </TableBody>
            </Table>
        </Dialog >
    )
}