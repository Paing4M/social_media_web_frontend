'use client'

import React, {useState} from 'react'
import GroupUser from "@/components/group/GroupUser";
import {useGroup} from "@/hooks/useGroup";
import toast from "react-hot-toast";
import Search from "@/components/group/Search";

interface GroupUserListProps {
  users: GroupUserInterface[] | null
  group_slug: string
}

const GroupUserList = ({users: initial, group_slug}: GroupUserListProps) => {
  const [users, setUsers] = useState<GroupUserInterface[] | null>(initial);
  const [input, setInput] = useState('');

  const {useGpAction} = useGroup()
  const {mutateAsync, isPending} = useGpAction()


  if (users?.length == 0) {
    return (<p className={'w-full text-center text-sm mt-5'}>Invite user to group.</p>)
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
            if (prev) {
              return prev.filter(user => user.id !== res.user.id) as any
            }
            return prev
          });
          toast.success(res.message);
        }
      })
    } catch (err) {
      console.log(err)
    }


  }

  return (
    <div className='mt-5'>
      <Search handleSearchUser={handleSearchUser}/>
      <div className='grid grid-col-1 md:grid-cols-2 gap-2'>
        {users?.filter(user => user?.username!.includes(input.toLowerCase()))?.map(user => (
          <GroupUser key={user.id + ' ' + user.username} user={user} handleAction={handleAction}/>
        ))}
      </div>
    </div>
  )


}
export default GroupUserList
