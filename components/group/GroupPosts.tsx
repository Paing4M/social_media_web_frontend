import React from 'react'
import PostList from "@/components/post/PostList";

const GroupPosts = ({id , currentUserRole}: { id: number , currentUserRole?:string | null }) => {
  return (
    <PostList currentUserRole={currentUserRole} groupId={id}/>
  )
}
export default GroupPosts
