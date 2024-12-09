'use client'

import React from 'react'
import User from "@/components/group/User";
import GpButton from "@/components/group/GpButton";
import {useGroup} from "@/hooks/useGroup";

interface GroupUserProps {
  user: GroupUserInterface
  currentUserRole:string
  handleRole: (role: string, user_id: number) => void
}

const GroupUser = ({user, handleRole , currentUserRole}: GroupUserProps) => {
const {useRemoveGpUser} = useGroup()
const {} = useRemoveGpUser()



  const handleRemoveUser = async () =>{

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
          <GpButton onClick={handleRemoveUser} name='Delete' variant={'destructive'}  className='text-sm'>
            Delete
          </GpButton>
        )}
      </div>
    </User>
  )
}
export default GroupUser
