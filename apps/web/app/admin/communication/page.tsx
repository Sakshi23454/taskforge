"use client"

import React from "react"
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from '@/components/ui/table'
import { useGetconvosendlogicQuery } from "@/redux/apis/admin.api"

const Communication = () => {
  const { data, isLoading } = useGetconvosendlogicQuery()

  if (isLoading) return <p>Loading...</p>

  console.log(data?.result)

  return (
    <div>

      <div>Conversation Data</div>
      <Table className="mt-5">
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Profile</TableHead>
            <TableHead>message</TableHead>
            <TableHead>userId</TableHead>
            <TableHead>taskId</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {data?.result?.map((item) => (
            <TableRow
              key={item.id}
            >
              <TableCell>{item.name}</TableCell>
              <TableCell>
                <img
                  src={item.profilePic ?? "not loaded"}
                  alt="profile"
                  className="w-8 h-8 rounded-full"
                />
              </TableCell>

              <TableCell className="font-medium">{item.msg}</TableCell>
              <TableCell className="font-medium">{item.userId}</TableCell>
              <TableCell className="font-medium">{item.taskId}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

    </div>
  )
}

export default Communication
{/* {data?.result?.length === 0 && <p>No messages</p>} */ }