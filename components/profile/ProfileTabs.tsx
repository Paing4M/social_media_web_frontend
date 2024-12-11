'use cient'

import {Tabs, TabsContent, TabsList, TabsTrigger} from '@radix-ui/react-tabs'
import {Button} from '../ui/button'
import {CameraIcon, PencilIcon, UserRoundMinusIcon, UserRoundPlusIcon, XIcon} from 'lucide-react'
import {Session} from 'next-auth'
import ProfileUserInfo from './ProfileUserInfo'
import {Avatar, AvatarFallback, AvatarImage} from '../ui/avatar'
import Loading from '../Loading'
import React from "react";
import PostList from "@/components/post/PostList";
import {useParams} from "next/navigation";
import PostTextEditor from "@/components/post/PostTextEditor";
import {useUser} from "@/hooks/useUser";
import {useQueryClient} from "@tanstack/react-query";
import toast from "react-hot-toast";
import {userFollow} from "@/actions/user";
import UserFollowList from "@/components/following/UserFollowList";


interface ProfileTabsProps {
  data: Session
  user: UserInterface
  handleUpload: (
    e: React.ChangeEvent<HTMLInputElement>,
    setUrl: (url: string) => void,
    setFile: (file: File) => void
  ) => void
  avatarUrl: string | null
  setAvatarUrl: (url: string | null) => void
  setAvatarFile: (file: File | null) => void
  onSubmit: () => void
  loading: boolean
  clearAvatar: () => void
}

const ProfileTabs = ({
                       data,
                       user,
                       avatarUrl,
                       handleUpload,
                       setAvatarUrl,
                       setAvatarFile,
                       onSubmit,
                       loading,
                       clearAvatar,
                     }: ProfileTabsProps) => {

  const {username} = useParams()
  const {useFollowMutation , useGetUserFollow} = useUser()
  const {mutateAsync} = useFollowMutation()
  const {data:userFollowData , isLoading } = useGetUserFollow(username.toString()!)


  const quertClient = useQueryClient()
  const handleFollowAction = async () => {
    try {
      await mutateAsync(user.id, {
        onSuccess: (res:any) => {
          // console.log(res)
          quertClient.setQueryData(['getProfile', user.username], (oldData: UserInterface) => {
            if (!oldData) return
            const status = res.status == 201 ? true : res.status == 200 ? false : null
            return {...oldData, isFollowedByCurrentUser: status}
          })
          toast.success(res.message)
        }
      })
    } catch (e: any) {
      console.log(e)
    }
  }

  if(isLoading) return  <Loading/>

  return (
    <>
      <Tabs
        defaultValue={data?.user.id == user.id ? 'about' : 'posts'}
        className='flex flex-col gap-y-5'
      >
        <div className='bg-background shadow-sm rounded-b-lg relative  px-6'>
          <div className='border-b'>
            <div className='absolute top-[-40px] shadow-sm  rounded-full border'>
              <Avatar className='w-24 h-24'>
                <AvatarImage
                  className='object-cover'
                  src={
                    avatarUrl ||
                    (data?.user.username === user.username
                      ? data?.user?.avatar_url!
                      : user.avatar_url!)
                  }
                  alt='img'
                />
                <AvatarFallback className='text-4xl'>
                  {user?.username === data?.user.username
                    ? data?.user?.name?.slice(0, 2)
                    : user?.name?.slice(0, 2)}
                </AvatarFallback>
              </Avatar>

              {user?.username === data?.user?.username && (
                <>
                  {!avatarUrl ? (
                    <label
                      htmlFor='avatar'
                      className='bg-background p-1 px-2 rounded-md absolute cursor-pointer flex items-center gap-2 text-sm top-1 -right-[40%] hover:bg-background/80'
                    >
                      <CameraIcon className='size-4'/>
                      Avatar
                      <input
                        onChange={(e) =>
                          handleUpload(
                            e,
                            setAvatarUrl!,
                            setAvatarFile!
                          )
                        }
                        type='file'
                        hidden
                        id='avatar'
                      />
                    </label>
                  ) : (
                    <button
                      onClick={clearAvatar}
                      className='bg-background p-2 absolute border cursor-pointer rounded-full top-1 -right-[10%]'
                    >
                      <XIcon className='size-4 text-red-500'/>
                    </button>
                  )}
                </>
              )}
            </div>

            <div className='flex items-center p-3 justify-between gap-1'>
              <h2 className='text-xl font-bold ml-28'>{user?.username}</h2>

              {user?.username === data?.user?.username ? (
                <Button
                  onClick={onSubmit}
                  className='capitalize flex items-center gap-2 min-w-10 tracking-wide'
                >
                  {loading ? (
                    <Loading/>
                  ) : (
                    <PencilIcon className='size-4'/>
                  )}
                  {loading ? 'Processing' : 'Save'}
                </Button>
              ) : (
                <>
                  {user.isFollowedByCurrentUser ? <Button
                      onClick={handleFollowAction}
                      variant='destructive'
                      className='capitalize flex items-center gap-2 min-w-10 tracking-wide'
                    >
                      {loading ? (
                        <Loading/>
                      ) : (
                        <UserRoundMinusIcon className='size-4'/>
                      )}
                      {loading ? 'Processing' : 'UnFollow'}
                    </Button> :
                    <Button
                      onClick={handleFollowAction}
                      className='capitalize flex items-center gap-2 min-w-10 tracking-wide'
                    >
                      {loading ? (
                        <Loading/>
                      ) : (
                        <UserRoundPlusIcon className='size-4'/>
                      )}
                      {loading ? 'Processing' : 'Follow'}
                    </Button>}
                </>
              )}
            </div>
          </div>

          <div className='mt-2 pb-4'>
            <TabsList className='flex items-center flex-wrap gap-1 justify-center sm:justify-start'>
              {data?.user?.id == user.id && (
                <TabsTrigger
                  value='about'
                  className='px-4 py-1 data-[state=active]:border-b-2  data-[state=active]:border-blue-400 data-[state=active]:text-blue-400'
                >
                  About
                </TabsTrigger>
              )}

              <TabsTrigger
                value='posts'
                className='px-4 py-1 data-[state=active]:border-b-2  data-[state=active]:border-blue-400 data-[state=active]:text-blue-400'
              >
                Posts
              </TabsTrigger>

              <TabsTrigger
                value='followers'
                className='px-4 py-1 data-[state=active]:border-b-2  data-[state=active]:border-blue-400 data-[state=active]:text-blue-400'
              >
                Followers
              </TabsTrigger>

              <TabsTrigger
                value='followings'
                className='px-4 py-1 data-[state=active]:border-b-2  data-[state=active]:border-blue-400 data-[state=active]:text-blue-400'
              >
                Followings
              </TabsTrigger>

              <TabsTrigger
                value='photos'
                className='px-4 py-1 data-[state=active]:border-b-2  data-[state=active]:border-blue-400 data-[state=active]:text-blue-400'
              >
                Photos
              </TabsTrigger>
            </TabsList>
          </div>
        </div>

        {data?.user?.id == user.id && (
          <TabsContent value='about'>
            <ProfileUserInfo user={data?.user!}/>
          </TabsContent>
        )}

        <TabsContent value='posts'>
          {data?.user.id == user.id && (
            <PostTextEditor user={data?.user} username={username.toString()}/>
          )}
          <PostList username={username?.toString()}/>
        </TabsContent>

        <TabsContent value='followers'>
          <UserFollowList data={userFollowData?.followers!}/>

        </TabsContent>
        <TabsContent value='followings'>
          <UserFollowList  data={userFollowData?.followings!}/>

        </TabsContent>
        <TabsContent value='photos'>photos</TabsContent>
      </Tabs>
    </>
  )
}

export default ProfileTabs
