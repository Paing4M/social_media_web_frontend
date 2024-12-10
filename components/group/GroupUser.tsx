'use client'

import React from 'react'
import User from "@/components/group/User";
import GpButton from "@/components/group/GpButton";
import {useGroup} from "@/hooks/useGroup";
import {useParams} from "next/navigation";
import {useQueryClient} from "@tanstack/react-query";
import toast from "react-hot-toast";

interface GroupUserProps {
  user: GroupUserInterface
  currentUserRole: string
  handleRole: (role: string, user_id: number) => void
}

const GroupUser = ({user, handleRole, currentUserRole}: GroupUserProps) => {

  const {slug} = useParams()


  const {useRemoveGpUser} = useGroup()
  const {mutateAsync, isPending} = useRemoveGpUser()

  const queryClient = useQueryClient()
  const handleRemoveUser = async () => {
    try {
      const data = {
        slug: slug.toString(),
        user_id: user.id,
      }

      await mutateAsync(data, {
        onSuccess: (res) => {
          console.log(res)
          queryClient.setQueryData(['getGpBySlug', slug] , (oldData:GroupProfileInterface)=>{
            if(!oldData) return
            const deletedUser = oldData.gpUsers.filter(user => user.id !== res.user_id)
            return {
              ...oldData ,
              gpUsers:deletedUser
            }
          })
          toast.success(res.message)

        }
      })

    } catch (e: any) {
      console.log(e)
      if(e.response?.status === 403) {
        toast.error(e.response?.data?.message)
      }
    }
  }

  return (
    <User user={user}>
      <div className={'flex items-center gap-2'}>
        <select
          value={user.role}
          onChange={e => handleRole(e.target.value, user.id)}
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
          <option value='admin'>admin</option>
          <option value="user">user</option>
        </select>


        {currentUserRole === 'admin' && (
          <GpButton onClick={handleRemoveUser} name='Delete' variant={'destructive'} className='text-sm'>
            Delete
          </GpButton>
        )}
      </div>
    </User>
  )
}
export default GroupUser
