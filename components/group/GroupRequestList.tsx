'use client'

import React, {useState} from 'react'
import GroupUser from "@/components/group/GroupUser";
import {useGroup} from "@/hooks/useGroup";
import toast from "react-hot-toast";
import GroupRequest from "@/components/group/GroupRequest";
import Search from "@/components/group/Search";

interface GroupRequestListProps {
  users: BaseUserInterface[] | null
  group_slug: string
}

const GroupRequestList = ({users: initial, group_slug}: GroupRequestListProps) => {
  const [users, setUsers] = useState< BaseUserInterface[] | null>(initial);
  const [input, setInput] = useState('');

  const {useGpAction} = useGroup()
  const {mutateAsync, isPending} = useGpAction()


  if (users?.length == 0) {
    return (<p className={'w-full text-center text-sm'}>No request found.</p>)
  }

  const handleSearchUser = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value)
  }

  const handleAction = async (action: string, user_id: number) => {
    const data = {
      action,
      user_id,
      group_slug
    }
    // console.log(data)

    try {
      await mutateAsync(data, {
        onSuccess: (res) => {
          setUsers((prev) => {
              return prev?.filter(user => user.id !== res.user.id)  ?? []
          });
          toast.success(res.message);
        }
      })
    } catch (err) {
      console.log(err)
    }


  }

  return (
    <div>
      <Search handleSearchUser={handleSearchUser}/>
      <div className='grid grid-col-1 md:grid-cols-2 gap-2'>
        {users?.filter(user => user?.username!.includes(input.toLowerCase()))?.map(user => (
          <GroupRequest user={user} handleAction={handleAction} />
        ))}
      </div>
    </div>
  )


}
export default GroupRequestList
