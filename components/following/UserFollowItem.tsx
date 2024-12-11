import React from "react";
import Link from "next/link";
import UserAvatar from "@/components/avatar/UserAvatar";

type UserFollowListProps = {
  data:BaseUserInterface,
}

const UserFollowItem = ({data}:UserFollowListProps) => {

  return (
    <div className='bg-background rounded-lg shadow-md p-4 flex items-center justify-between'>
      <Link href={`/profile/${data.username}`} className='flex items-center gap-2'>
        <UserAvatar name={data.username!} src={data.avatar_url!}/>
        <p>{data.username}</p>
      </Link>

    </div>
  )
}
export default UserFollowItem
