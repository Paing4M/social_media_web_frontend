'use client'

import React from 'react'
import User from "@/components/group/User";
import {Button} from "@/components/ui/button";
import Loading from "@/components/Loading";
import {useQueryClient} from "@tanstack/react-query";
import toast from "react-hot-toast";
import {useUser} from "@/hooks/useUser";
import {useSearchParams} from "next/navigation";

const UserCard = ({user}: { user: BaseUserInterface }) => {
  const searchParam = useSearchParams()
  const {useFollowMutation} = useUser()
  const {mutateAsync, isPending} = useFollowMutation()


  const queryClient = useQueryClient()
  const handleFollowAction = async () => {
    try {
      await mutateAsync(user.id, {
        onSuccess: (res: any) => {
          // console.log(res)
          queryClient.setQueryData(['get', 'searchUser', searchParam.get('search')?.toString()], (oldData: QueryDataInterface<BaseUserInterface[]>) => {
            return {
              ...oldData,
              pages: oldData.pages.flatMap((page) => {
                return {
                  ...page,
                  data: page.data.map(data => {
                    const isFollowed = res.status == 200 ? false : res.status == 201

                    if (data.id === res.user_id) {
                      return {
                        ...data,
                        isFollowedByCurrentUser: isFollowed
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
    } catch (e: any) {
      console.log(e)
    }
  }

  return (
      <User user={user}>
        <div>
          <Button
            onClick={handleFollowAction}
            variant={`${user.isFollowedByCurrentUser ? 'destructive' : 'default'}`}
            className='capitalize flex items-center gap-2 min-w-10 tracking-wide'
          >
            {isPending && (
              <Loading/>
            )}
            {user.isFollowedByCurrentUser ? 'UnFollow' : 'Follow'}
          </Button>

        </div>
      </User>
  )
}
export default UserCard
