import React from 'react'
import User from "@/components/group/User";

interface GroupUserProps {
  user: GroupUserInterface
  handleRole: (role: string, user_id: number) => void
}

const GroupUser = ({user, handleRole}: GroupUserProps) => {

  return (
    <User user={user}>
      <div className={'text-sm'}>
        <select
          value={user.role}
          onChange={e => handleRole(e.target.value, user.id)}
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
          <option value='admin'>admin</option>
          <option value="user">user</option>
        </select>

      </div>
    </User>
  )
}
export default GroupUser
