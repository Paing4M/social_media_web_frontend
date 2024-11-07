'use client'

import {Input} from '../ui/input'
import GroupItem from './GroupItem'
import { useState} from "react";
import {CreateGroupModal} from "@/components/modal/CreateGroupModal";
import {useGroup} from "@/hooks/useGroup";
import Loading from "@/components/Loading";

const Group = () => {
  const [open, setOpen] = useState(false);
  const {useGetGroups} = useGroup()
  const {data, isPending} = useGetGroups()

  const closeModal = () => {
    setOpen(false)
  }


  return (
    <div
      className='bg-background sticky top-[calc(70px+1.3rem)] p-4 rounded-lg shadow-sm border flex flex-col overflow-hidden h-fit max-h-[400px] gap-y-2 '>
      <div className='flex items-center justify-between'>
        <h2 className='text-xl font-semibold'>Groups</h2>
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

      <div className='mt-4 flex flex-col gap-y-2 overflow-y-auto'>
        {isPending?<Loading/> :
            data.data.map((group:GroupInterface) => (
              <GroupItem key={group.id} group={group}/>
            ))
        }
      </div>

    {/* group modal */}
      <CreateGroupModal open={open} closeModal={closeModal}/>
    </div>
  )
}

export default Group
