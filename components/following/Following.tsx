'use client'

import {Input} from '../ui/input'
import FollowerItem from './FollowingItem'
import {useUser} from "@/hooks/useUser";
import Loading from "@/components/Loading";
import InfiniteScrollContainer from "@/components/InfiniteScrollContainer";

const Following = ({username}: { username: string }) => {

  const {useGetFollowingUser} = useUser()
  const {data, isLoading , hasNextPage , isFetchingNextPage , fetchNextPage} = useGetFollowingUser(username)

  const followings:BaseUserInterface[] = data?.pages.flatMap(page => page.data) as BaseUserInterface[]


  return (
    <div
      className='sticky top-[calc(70px+1.3rem)] bg-background p-4 rounded-lg shadow-sm border flex flex-col overflow-hidden h-fit max-h-[400px] gap-y-2 '>
      <h2 className='text-xl font-semibold'>Following</h2>

      <div>
        <Input type='text' className='py-1 ' placeholder='Search ...'/>
      </div>

      {isLoading && <Loading/>}


        <InfiniteScrollContainer className='mt-4 flex flex-col gap-y-2 overflow-y-auto' isOnBottom={() => {
          hasNextPage && !isFetchingNextPage && fetchNextPage()
        }} >
          {followings?.map(following => (
            <FollowerItem user={following} key={following.id + '-' + following.username}/>
          ))}

          {isFetchingNextPage && <Loading/>}
        </InfiniteScrollContainer>

    </div>
  )
}

export default Following
