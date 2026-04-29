"use client"

import React, { useState } from "react"
import { Button } from '@/components/ui/button'
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from '@/components/ui/table'
import { useGetTasksQuery, usePostconvosendlogicMutation } from '@/redux/apis/employee.api'
import { toast } from 'sonner'
import { useForm } from 'react-hook-form'
import z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { CONVOSEND_CREATE_REQUEST } from '@repo/types'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { MoreHorizontalIcon } from 'lucide-react'

const Page = () => {
  return (
    <>
      <div className="p-4 text-xl font-bold">Employee Dashboard</div>
      <TaskTable />
    </>
  )
}

const TaskTable = () => {
  const { data, isLoading } = useGetTasksQuery()
  const [ConvoCreate] = usePostconvosendlogicMutation()

  const [selectedTask, setSelectedTask] = useState<any>(null)
  const [open, setOpen] = useState(false)

  const schema = z.object({
    msg: z.string()
  })

  const { register, handleSubmit, reset } = useForm({
    resolver: zodResolver(schema)
  })

  const handleRowClick = (item: any) => {
    setSelectedTask(item)
    setOpen(true)
  }

  const handleSend = async (formData: any) => {
    try {
      await ConvoCreate({
        msg: formData.msg,
        taskId: selectedTask.id,
        userId: selectedTask.userId
      }).unwrap()

      toast.success("Message sent")
      reset()
      setOpen(false)
    } catch (err) {
      toast.error("Failed to send message")
    }
  }

  if (isLoading) return <p>Loading...</p>

  return (
    <div className="p-4">

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>id</TableHead>
            <TableHead>title</TableHead>
            <TableHead>desc</TableHead>
            <TableHead>hero</TableHead>
            <TableHead>due</TableHead>
            <TableHead>complete date</TableHead>
            <TableHead>complete</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {data?.result?.map((item: any) => (
            <TableRow
              key={item.id}
              className="cursor-pointer hover:bg-gray-100"
              onClick={() => handleRowClick(item)}
            >
                            <TableCell className="font-medium">{item.id}</TableCell>
              <TableCell className="font-medium">{item.title}</TableCell>
              <TableCell className="font-medium">{item.desc}</TableCell>
              <TableCell className="font-medium">{item.hero && <img src={item.hero} height={100} width={100} alt="" />}</TableCell>
              <TableCell className="font-medium">{item.due?.toString()}</TableCell>
              <TableCell className="font-medium">{item.completeDate?.toString()}</TableCell>
              <TableCell className="font-medium">
                {
                  item.complete
                    ? <Button variant="secondary">Mark Pending</Button>
                    : <Button variant="secondary">Mark Complete</Button>
                }
              </TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="size-8">
                      <MoreHorizontalIcon />
                      <span className="sr-only">Open menu</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>Edit</DropdownMenuItem>
                    <DropdownMenuItem>Duplicate</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem variant="destructive">
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Send Message</DialogTitle>
          </DialogHeader>

          {selectedTask && (
            <>
              <div className="space-y-2">
                <p><b>Task ID:</b> {selectedTask.id}</p>
                <p><b>User ID:</b> {selectedTask.userId}</p>
                <p><b>Title:</b> {selectedTask.title}</p>

                {selectedTask.hero && (
                  <img
                    src={selectedTask.hero}
                    className="w-full h-40 object-cover rounded"
                  />
                )}
              </div>

              <form onSubmit={handleSubmit(handleSend)} className="mt-4">
                <Label>Message</Label>

                <Input
                  {...register("msg")}
                  placeholder="Enter message"
                  className="mt-2"
                />

                <Button type="submit" className="mt-3 w-full">
                  Send
                </Button>
              </form>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default Page