"use client"
import { Avatar, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { useFetchmeQuery, useUpdateProfileMutation } from '@/redux/apis/admin.api'
import { UPDATE_PROFILE_REQUEST } from '@repo/types'
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

const page = () => {
    const [show, setshow] = useState(true)
    const { data } = useFetchmeQuery()
    const [update, { isLoading }] = useUpdateProfileMutation()
    const { reset, register, handleSubmit } = useForm<UPDATE_PROFILE_REQUEST>()

    const handleFormSubmit = async (userData: UPDATE_PROFILE_REQUEST) => {
        try {
            // console.log(userData.profile[0])   // dynamic key
            const fd = new FormData()
            fd.append("name", userData.name)
            fd.append("mobile", userData.mobile)
            fd.append("email", userData.email)
            if (userData.profile) {
                fd.append("profile", userData.profile[0] as File)
            }

            await update({ fd, id: data?.result?.id as number }).unwrap()
            // await update({ ...userData, id: data?.result?.id }).unwrap()
            toast.success("profile update success")
            setshow(true)
        } catch (error) {
            console.log(error)
            toast.error("unable to update profile  ")
        }
    }

    useEffect(() => {
        if (data) {
            reset({
                name: data.result?.name,
                email: data.result?.email,
                mobile: data.result?.mobile,
            })
        }
    }, [data])
    return <>
        <Card>
            <CardHeader>My Content</CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit(handleFormSubmit)}>
                    <Input className='my-2' {...register("name")} type="text" placeholder='name' />
                    <Input className='my-2' {...register("email")} type="text" placeholder='email' />
                    <Input className='my-2' {...register("mobile")} type="text" placeholder='mobile' />
                    {
                        data && data.result?.profilePic && show
                            ? <div className='flex gap-2 my-3'>
                                <Avatar size='lg'>
                                    <AvatarImage src={data && data.result?.profilePic} />
                                </Avatar>
                                {/* <img height={100} width={100} src={data && data.result?.profilePic} alt="" /> */}
                                <Button onClick={() => setshow(false)} type="button" variant="secondary">Change Image</Button>
                            </div>
                            : <div>
                                <input {...register("profile")} type="file" />
                                <Button onClick={() => setshow(true)} type="button" variant="secondary">Cancel</Button>
                            </div>
                    }


                    <Button disabled={isLoading} type='submit'>Update</Button>
                </form>
            </CardContent>
        </Card>
    </>
}

export default page