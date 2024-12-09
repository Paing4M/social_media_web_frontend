'use client'

import {Input} from '../ui/input'
import GroupItem from './GroupItem'
import { useState} from "react";
import {CreateGroupModal} from "@/components/modal/CreateGroupModal";
import {useGroup} from "@/hooks/useGroup";
import Loading from "@/components/Loading";
import InfiniteScrollContainer from "@/components/InfiniteScrollContainer";

const Group = () => {
  const [open, setOpen] = useState(false);
  const {useGetGroups} = useGroup()
  const {data, isLoading , hasNextPage , isFetchingNextPage , fetchNextPage} = useGetGroups()

  const groups:GroupInterface[] | [] = data?.pages.flatMap(page=>page.data) || []


  const closeModal = () => {
    setOpen(false)
  }


  return (
    <div
      className='bg-background sticky top-[calc(70px+1.3rem)] p-4 rounded-lg shadow-sm border flex flex-col overflow-hidden h-fit max-h-[400px] gap-y-2 '>
      <div className='flex items-center justify-between'>
        <h2 className='text-xl font-semibold'>My Groups</h2>
        <button onClick={()=>setOpen(true)} className='px-3 py-1 bg-indigo-500 hover:bg-indigo-600 text-white text-sm rounded-md'>
          Create
        </button>
      </div>

      <div>
        <Input
          type='text'
          className='py-1 '
          placeholder='Search group ...'
        />
      </div>


      {isLoading?<Loading/> :
        <InfiniteScrollContainer
          isOnBottom={() => {
            hasNextPage && !isFetchingNextPage && fetchNextPage()
          }}
          className='mt-4 flex flex-col gap-y-2 overflow-y-auto'>
          {
            groups.map((group) => (
              <GroupItem key={group.id} group={group}/>
            ))
          }
          {isFetchingNextPage && <Loading />}
        </InfiniteScrollContainer>
      }

      {!isLoading && groups?.length === 0 && <p className={'text-sm text-center'}>No group found.</p>}

      {/* group modal */}
      <CreateGroupModal open={open} closeModal={closeModal}/>
    </div>
  )
}

export default Group
