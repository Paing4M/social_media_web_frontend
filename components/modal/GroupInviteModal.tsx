import React, {useState} from 'react'
import Modal from "@/components/modal/Modal";
import Loading from "@/components/Loading";
import {useGroup} from "@/hooks/useGroup";
import InputError from "@/app/(auth)/InputError";
import toast from "react-hot-toast";


interface GroupInviteModalProps {
  open: boolean
  slug: string
  closeModal: () => void
}

interface Error {
  value: ['string']
}

const GroupInviteModal = ({open, closeModal, slug}: GroupInviteModalProps) => {

  const [value, setValue] = useState('')
  const [error, setError] = useState<Error | null>(null)

  const {useInviteToGroup} = useGroup()
  const {mutateAsync, isPending} = useInviteToGroup()


  const handleCloseModal = () => {
    closeModal()
    setError(null)
  }

  const inviteUser = async () => {

    try {
      const data = {
        slug,
        value
      }

      await mutateAsync(data, {
        onSuccess: (res) => {
          toast.success(res?.message)
          handleCloseModal()
        },

      })
    } catch (e:any) {
      console.log(e)
      if (e.response?.status === 422) {
        setError(e.response?.data?.errors)
      }
    }
  }

  return (
    <Modal open={open} closeModal={handleCloseModal} title={'Invite user'}>

      <div className='mt-3 w-full space-y-2'>

        <div className='w-full'>
          <input onChange={e => setValue(e.target.value)} type='text' className='p-2 border-2 rounded-md w-full'
                 placeholder={'Enter username or email'}/>
          {error?.value && <InputError error={error?.value?.[0]}/>}
        </div>

        <div className='flex items-center gap-2 justify-end'>
          <button
            onClick={handleCloseModal}
            className='px-4 py-2 min-w-20 bg-muted-foreground text-background rounded-lg'
          >
            Cancel
          </button>

          <button
            disabled={isPending}
            onClick={inviteUser}
            className={`px-4 py-2 text-secondary rounded-lg min-w-20 bg-primary ${isPending ? 'bg-primary/50' : ''}`}
          >
            {isPending ? <Loading/> : 'Submit'}
          </button>
        </div>
      </div>

    </Modal>
  )
}
export default GroupInviteModal
