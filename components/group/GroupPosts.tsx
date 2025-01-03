'use client'

import React from 'react'
import PostList from "@/components/post/PostList";
import PostTextEditor from "@/components/post/PostTextEditor";
import {useSession} from "next-auth/react";

type GroupPostsProps = {
  id: number,
  currentUserRole?: string | null
  isUserInGroup: boolean
}

const GroupPosts = ({id, currentUserRole, isUserInGroup}: GroupPostsProps) => {
  const session = useSession()

  return (
    <div className='space-y-5 mt-5'>
      {isUserInGroup && (
        <div className="mt-5">
          <PostTextEditor groupId={id} user={session?.data?.user!}/>
        </div>
      )}

      <PostList currentUserRole={currentUserRole} groupId={id}/>
    </div>

  )
}
export default GroupPosts
