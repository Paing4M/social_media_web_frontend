import React from 'react'
import UserAvatar from "@/components/avatar/UserAvatar";
import {Button} from "@/components/ui/button";
import Link from "next/link";
import GpButton from "@/components/group/GpButton";

interface GroupUserProps {
  user:GpUserInterface | BaseUserInterface
}

const GroupUser = ({user }:GroupUserProps) => {

  const isGroupUser = (user: BaseUserInterface | GroupUserInterface): user is GroupUserInterface => {
    return 'group_id' in user;
  };


  console.log(user)


  return (
    <div className='bg-background rounded-lg shadow-md p-4 flex items-center justify-between'>
      <Link href={`/profile/${user.username}`} className='flex items-center gap-2'>
        <UserAvatar name={user.username!} src={user.avatar_url!} />
        <p>{user.username}</p>
      </Link>


      {!isGroupUser(user) ? (
        <div className='flex items-center gap-2'>
          <GpButton onClick={(e)=>{
            // e.stopPropagation()
            e.preventDefault()
            console.log('hello accept')
          }}>Accept</GpButton>
          <GpButton onClick={(e)=>{
            e.preventDefault()
            // e.stopPropagation()
            console.log('hello reject')
          }} variant='destructive'>Reject</GpButton>

        </div>
      ) : (
        <div className={'text-sm'}>
          <select
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
            <option selected={user?.role === 'admin'} value='admin'>admin</option>
            <option selected={user?.role === 'user'} value="user">user</option>
          </select>

        </div>
      )}

    </div>
  )
}
export default GroupUser
