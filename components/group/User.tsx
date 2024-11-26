import React from 'react'
import UserAvatar from "@/components/avatar/UserAvatar";
import Link from "next/link";

interface GroupUserProps {
  user:GroupUserInterface | BaseUserInterface
  children:React.ReactNode
}

const User = ({user  , children}:GroupUserProps) => {

  return (
    <div className='bg-background rounded-lg shadow-md p-4 flex items-center justify-between'>
      <Link href={`/profile/${user.username}`} className='flex items-center gap-2'>
        <UserAvatar name={user.username!} src={user.avatar_url!} />
        <p>{user.username}</p>
      </Link>


      {children}

    </div>
  )
}
export default User
