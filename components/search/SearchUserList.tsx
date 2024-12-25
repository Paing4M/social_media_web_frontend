'use client'

import React from 'react'
import {useUser} from "@/hooks/useUser";
import Loading from "@/components/Loading";
import UserCard from "@/components/search/UserCard";
import InfiniteScrollContainer from "@/components/InfiniteScrollContainer";

const SearchUserList = ({search}: { search: string }) => {

  const {useSearchUser} = useUser()
  const {data, isLoading, fetchNextPage, isFetchingNextPage, hasNextPage} = useSearchUser(search)
  const users: BaseUserInterface[] | [] = data?.pages.flatMap(page => page.data) as BaseUserInterface[] | []

  // console.log(users)

  if (isLoading) return <Loading/>

  return (
    <div>
      {users.length === 0 && <p className='text-sm text-center'>No User Found.</p>}
      <InfiniteScrollContainer isOnBottom={() => {
        hasNextPage && !isFetchingNextPage && fetchNextPage()
      }} className='space-y-4'>
        {users.map(user=>(
          <UserCard user={user} key={user.id}/>
        ))}
        {isFetchingNextPage && <Loading/>}
      </InfiniteScrollContainer>

    </div>
  )
}
export default SearchUserList
