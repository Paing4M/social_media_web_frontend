'use client'

import React, {useState} from 'react'
import {useGroup} from "@/hooks/useGroup";
import toast from "react-hot-toast";
import GroupRequest from "@/components/group/GroupRequest";
import Search from "@/components/group/Search";
import {useQueryClient} from "@tanstack/react-query";
import GroupUser from "@/components/group/GroupUser";

interface GroupUserListProps {
  users: BaseUserInterface[] | GroupUserInterface[]
  group_slug: string,
  isRequestUser?: boolean,
  currentUserRole: string | null ,
}

const GroupUserList = ({users, group_slug, isRequestUser = false, currentUserRole = null}: GroupUserListProps) => {
  const [input, setInput] = useState('');

  const {useGpAction, useGpChangeRole} = useGroup()
  const {mutateAsync, isPending} = useGpAction()
  const {mutateAsync: mutateChangeRole} = useGpChangeRole()

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
            console.log(res.user)

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

  const handleRole = async (role: string, user_id: number) => {

    const data = {
      role,
      user_id,
      slug: group_slug
    }
    // console.log(data)
    try {
      await mutateChangeRole(data, {
        onSuccess: (res) => {
          queryClient.setQueryData(['getGpBySlug', group_slug], (oldData: GroupProfileInterface) => {
            console.log(oldData)
            return {
              ...oldData,
              gpUsers: oldData.gpUsers.map(user => user.id === res.user.id ? {...user, role: res.user.role} : user)
            }
          })

          toast.success(res.message)
        }
      })
    } catch (e: any) {
      // console.log(e)
      if (e.response.status === 403) {
        toast.error(e.response.data.message)
      }
    }

  }

  return (
    <div className='mt-5'>
      <Search handleSearchUser={handleSearchUser}/>
      <div className='grid grid-col-1 md:grid-cols-2 gap-2'>
        {users?.filter(user => user?.username!.includes(input.toLowerCase()))?.map(user => (

          isRequestUser ?
            <GroupRequest
              key={user.id + '_' + user.username}
              user={user as BaseUserInterface}
              handleAction={handleAction}/>
            :
            <GroupUser
              key={user.id + '_' + user.username}
              user={user as GroupUserInterface}
              currentUserRole={currentUserRole!}
              handleRole={handleRole}/>
        ))}
      </div>
    </div>
  )


}
export default GroupUserList
