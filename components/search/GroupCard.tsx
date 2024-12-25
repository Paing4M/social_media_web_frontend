'use client'

import React from 'react'
import {Button} from "@/components/ui/button";
import {useQueryClient} from "@tanstack/react-query";
import {useSearchParams} from "next/navigation";
import Link from "next/link";
import UserAvatar from "@/components/avatar/UserAvatar";
import {useGroup} from "@/hooks/useGroup";
import {useSession} from "next-auth/react";
import toast from "react-hot-toast";
import Loading from "@/components/Loading";

const GroupCard = ({group}: { group: GroupInterface }) => {
  const searchParams = useSearchParams()
  const loginUser = useSession()

  const {useJoinGroup } = useGroup()
  const {mutateAsync:joinGroupMutateAsync , isPending}  = useJoinGroup()

  const queryClient = useQueryClient()
  const handleJoinGroup = async ()=>{
    try {
      const token = searchParams.get("token");
      const data = {
        token ,
        user_id : loginUser.data?.user?.id,
        group_id : group.id,
        slug:group.slug
      }

      await joinGroupMutateAsync(data , {
        onSuccess:(res)=> {
          queryClient.setQueryData(['get', 'searchGroup', searchParams.get('search')?.toString()] , (oldData:QueryDataInterface<GroupInterface[]>)=>{
              return {
                ...oldData,
                pages:oldData.pages.flatMap(page=>{
                  return {
                    ...page,
                    data: page.data.map(data => {
                        if(data.id == res.group_id){
                          const isJoined = res.status == 'approved' ? true : res.status == 'leaved' ? false : false

                          return {
                            ...data,
                            is_current_user_in_group: isJoined
                          }
                        }
                        return data

                    })
                  }
                })
              }


          })
          toast.success(res.message)
        }
      })

    } catch (e:any) {
      console.log(e)
      if(e.response.status === 404) {
        toast.error(e.response.data.message)
      }
    }
  }



  return (
    <div className='bg-background rounded-lg shadow-md p-4 flex items-center justify-between'>
      <Link href={`/group/${group.slug}`} className='flex items-center gap-2'>
        <UserAvatar name={group.name!} src={group.thumbnail_url!}/>
        <p>{group.name}</p>
      </Link>


      <Button
        onClick={handleJoinGroup}
        variant={`${group.is_current_user_in_group ? 'destructive' : 'default'}`}
        className='capitalize flex items-center gap-2 min-w-10 tracking-wide'
      >
        {isPending && (
          <Loading/>
        )}
        {group.is_current_user_in_group ? 'Leave' : 'Join'}
      </Button>

    </div>

  )
}
export default GroupCard
