import Modal from "@/components/modal/Modal";
import {useGroup} from "@/hooks/useGroup";
import React, {useState} from "react";
import {CreateGroupInterface} from "@/actions/group";
import InputError from "@/app/(auth)/InputError";
import toast from "react-hot-toast";
import Loading from "@/components/Loading";
import {useQueryClient} from "@tanstack/react-query";

interface CreateGroupModalInterface {
  open: boolean
  closeModal: () => void
}

export const CreateGroupModal = ({open, closeModal}: CreateGroupModalInterface) => {

  const [data , setData] = useState<CreateGroupInterface>({
    name:'',
    about:'',
    auto_approval:false
  })
  const [error , setError] = useState({
    name:'',
  })

  const {useCreateGroup} = useGroup()
  const {mutateAsync , isPending} = useCreateGroup()

  const handleCloseModal = () =>{
    setError({name:''})
    closeModal()
  }

  const queryClient = useQueryClient()
  
  const handleCreateGroup = async  () =>{

    try {
      await mutateAsync(data! , {
        onSuccess:(res)=>{
          // console.log(res)
          if(res){
            // add newly created group to UI
            queryClient.setQueryData(['get' , 'groups'], (oldData:QueryDataInterface<GroupInterface[]>)=>{

              return {
                ...oldData,
                pages: oldData.pages.flatMap((page: ApiResponse<GroupInterface[]>) => {
                  return {
                    ...page,
                    data: [res?.group, ...page.data]
                  }
                })
              }

            })
            setData({
              name:'',
              about:'',
              auto_approval:false
            })
            setError({name:''})
            closeModal()
            toast.success(res?.message)
          }


        }
      })
    } catch (err:any) {
      // console.log(err)
      if(err.response?.status === 422) {
        setError(err?.response?.data?.errors)
      }
    }
  }

  const handleInput = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setData(prev => ({...prev, [e.target.name]: e.target.value} as CreateGroupInterface))
  }

  const handleCheckbox = (e: React.ChangeEvent<HTMLInputElement>) => {
    setData(prev => ({...prev, auto_approval: e.target.checked} as CreateGroupInterface))
  }


  return (
    <Modal closeModal={handleCloseModal} open={open} title={'Create Group'}>
      <div className='mt-4 w-full space-y-2'>

          <div>
            <label className={'mb-1'} htmlFor={'groupName'}>Group Name</label>
            <input onChange={handleInput} name={'name'} id={'groupName'} className='border-0 outline-0 bg-muted  px-3 py-2 rounded-md w-full'
                   placeholder='Enter group name'/>
            {error?.name?.[0] && (
              <InputError error={error?.name?.[0]!}/>
            )}
          </div>

          <div>
            <label className={'mb-1'} htmlFor="about">About group</label>
            <textarea onChange={handleInput} name={'about'} cols={4} className='w-full bg-muted px-3 py-2 rounded-md resize-none'/>
          </div>
          
          <div>
            <label htmlFor="auto_approval" className={'flex items-center gap-1'}>
              <input onChange={handleCheckbox} name={'auto_approval'} type="checkbox" id={'auto_approval'}/>
              Auto approve
            </label>
          </div>

          <div>
            <div className='mt-4 flex items-center justify-between'>
              <button
                onClick={handleCloseModal}
                className='px-4 py-2 min-w-20 bg-muted-foreground text-background rounded-lg'
              >
                Cancel
              </button>

              <button
                disabled={isPending}
                onClick={handleCreateGroup}
                className={`px-4 py-2 text-secondary rounded-lg min-w-20 bg-primary ${isPending ? 'bg-primary/50' : ''}`}
              >
                {isPending ? <Loading/> : 'Submit'}
              </button>
            </div>

          </div>

      </div>
    </Modal>
  )
}
