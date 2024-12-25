'use client'

import React from 'react'
import Loading from "@/components/Loading";
import InfiniteScrollContainer from "@/components/InfiniteScrollContainer";
import GroupCard from "@/components/search/GroupCard";
import {useGroup} from "@/hooks/useGroup";

const SearchGroupList = ({search}: { search: string }) => {

  const {useSearchGroup} = useGroup()
  const {data, isLoading, fetchNextPage, isFetchingNextPage, hasNextPage} = useSearchGroup(search)
  const groups: GroupInterface[] | [] = data?.pages.flatMap(page => page.data) as GroupInterface[] | []


  if (isLoading) return <Loading/>

  return (
    <div>
      {groups.length === 0 && <p className='text-sm text-center'>No Group Found.</p>}
      <InfiniteScrollContainer isOnBottom={() => {
        hasNextPage && !isFetchingNextPage && fetchNextPage()
      }} className='space-y-4'>
        {groups.map(group=>(
          <GroupCard group={group} key={group.id}/>
        ))}
        {isFetchingNextPage && <Loading/>}
      </InfiniteScrollContainer>

    </div>
  )
}
export default SearchGroupList
