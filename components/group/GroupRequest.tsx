import React from 'react'
import User from "@/components/group/User";
import GpButton from "@/components/group/GpButton";

interface GroupRequestProps {
  user: BaseUserInterface
  handleAction: (action: string, user_id: number) => void
}

const GroupRequest = ({user, handleAction}: GroupRequestProps) => {

  return (
    <User user={user}>
      <div className='flex items-center gap-2'>
        <GpButton data-action={'accept'}
                  onClick={(e) => handleAction(e.currentTarget.dataset.action!, user.id)}>Accept</GpButton>
        <GpButton data-action={'reject'} onClick={(e) => handleAction(e.currentTarget.dataset.action!, user.id)}
                  variant='destructive'>Reject</GpButton>

      </div>
    </User>
  )
}
export default GroupRequest
