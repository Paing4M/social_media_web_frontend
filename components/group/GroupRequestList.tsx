'use client'

import React, {useState} from 'react'
import {useGroup} from "@/hooks/useGroup";
import toast from "react-hot-toast";
import GroupRequest from "@/components/group/GroupRequest";
import Search from "@/components/group/Search";
import {useQueryClient} from "@tanstack/react-query";

interface GroupRequestListProps {
  users: BaseUserInterface[] | null
  group_slug: string
}

const GroupRequestList = ({users, group_slug}: GroupRequestListProps) => {
  const [input, setInput] = useState('');

  const {useGpAction} = useGroup()
  const {mutateAsync, isPending} = useGpAction()
  const queryClient = useQueryClient()

  if (users?.length == 0) {
    return (<p className={'w-full text-center text-sm mt-5'}>No request found.</p>)
  }

  const handleSearchUser = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value)
  }

  const handleAction = async (action: string, user_id: number) => {
    const data = {
      action,
      user_id,
      group_slug
    }
    // console.log(data)

    try {
      await mutateAsync(data, {
        onSuccess: (res) => {

          queryClient.setQueryData(['getGpBySlug', group_slug], (oldData: GroupProfileInterface) => {

            const removedUser = oldData.gpRequestUsers.filter(user => user.id !== res.user.id)

            let users = action === 'reject' ? [...oldData.gpUsers] : [...oldData.gpUsers, res.user].sort((a, b) => a.username.localeCompare(b.username))

            return {
              ...oldData,
              gpRequestUsers: removedUser,
              gpUsers: users
            }

          })
          toast.success(res.message);
        }
      })
    } catch (err) {
      console.log(err)
    }

  }

  return (
    <div className='mt-5'>
      <Search handleSearchUser={handleSearchUser}/>
      <div className='grid grid-col-1 md:grid-cols-2 gap-2'>
        {users?.filter(user => user?.username!.includes(input.toLowerCase()))?.map(user => (
          <GroupRequest user={user} handleAction={handleAction}/>
        ))}
      </div>
    </div>
  )


}
export default GroupRequestList
