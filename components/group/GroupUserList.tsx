'use client'

import React, {useState} from 'react'
import GroupUser from "@/components/group/GroupUser";

interface GroupUserListProps {
  users: GpUserInterface[] | BaseUserInterface[] | null
  group_id:number
}

const GroupUserList = ({users , group_id}: GroupUserListProps) => {

  const [input , setInput ] = useState('');

  if (users?.length == 0) {
    return (<p className={'w-full text-center text-sm'}>Not found any user.</p>)
  }

  const handleSearchUser = (e:React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value)
  }

  return (
    <div>
      <div className={'w-full mb-4'}>
        <input onChange={handleSearchUser} type="text" placeholder={'Search user'} className={'px-4 py-2 rounded-md w-full'}/>
      </div>
      <div className='grid grid-col-1 md:grid-cols-2 gap-2'>
        {users?.filter(user=>user?.username!.includes(input.toLowerCase()))?.map(user => (
          <GroupUser user={user}/>
        ))}
      </div>
    </div>
  )


}
export default GroupUserList
