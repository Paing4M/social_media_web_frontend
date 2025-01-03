'use cient'

import {Tabs, TabsContent, TabsList, TabsTrigger} from '@radix-ui/react-tabs'
import {Button} from '../ui/button'
import {CameraIcon, PencilIcon, UserRoundPlusIcon, XIcon} from 'lucide-react'
import {Avatar, AvatarFallback, AvatarImage} from '../ui/avatar'
import Loading from '../Loading'
import React, {useEffect, useState} from "react";
import GroupInviteModal from "@/components/modal/GroupInviteModal";
import {useRouter, useSearchParams} from "next/navigation";
import {useSession} from "next-auth/react";
import {useGroup} from "@/hooks/useGroup";
import toast from "react-hot-toast";
import GroupUserList from "@/components/group/GroupUserList";
import GroupPosts from "@/components/group/GroupPosts";
import InfiniteScrollContainer from "@/components/InfiniteScrollContainer";
import PhotoAttachments from "@/components/profile/PhotoAttachments";
import PhotoPreviewModal from "@/components/modal/PhotoPreviewModal";
import GroupPhotoTabContent from "@/components/group/GroupPhotoTabContent";


interface ProfileTabsProps {
  data: GroupProfileInterface
  handleUpload: (
    e: React.ChangeEvent<HTMLInputElement>,
    setUrl: (url: string) => void,
    setFile: (file: File) => void
  ) => void
  thumbnailUrl: string | null
  setThumbnailUrl: (url: string | null) => void
  setThumbnailFile: (file: File | null) => void
  onSubmit: () => void
  loading: boolean
  clearThumbnail: () => void
}

interface Error {
  token?:[string]
  user_id?:[string]
  group_id?:[string]
  slug?:[string]
}

const ProfileTabs = ({
                       data,
                       thumbnailUrl,
                       handleUpload,
                       setThumbnailUrl,
                       setThumbnailFile,
                       onSubmit,
                       loading,
                       clearThumbnail,
                     }: ProfileTabsProps) => {

  const [group , setGroup] = useState<GroupInterface>(data.group!)
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('posts');

  const [error, setError] = useState<Error | null>(null)

  const router = useRouter()

  const searchParams = useSearchParams()
  const loginUser = useSession()

  const {useJoinGroup } = useGroup()
  const {mutateAsync:joinGroupMutateAsync , isPending}  = useJoinGroup()



  const closeModal = () => {
    setOpen(false)
  }

  useEffect(() => {
    setGroup(data.group)
  }, [data]);

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
        // console.log(res)
          toast.success(res.message)
          setGroup(prev=>({
            ...prev,
            is_current_user_in_group:res.group.is_current_user_in_group,
            current_user_role:res.group.current_user_role,
          }))
        if(token) {
          router.push(`/group/${group.slug}` )
        }
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
    <>
      <Tabs
        defaultValue={activeTab}
        onValueChange={(value)=>setActiveTab(value)}
        className='flex flex-col'
      >
        <div className='bg-background shadow-sm rounded-b-lg relative  px-6'>
          <div className='border-b'>
            <div className='absolute top-[-40px] shadow-sm  rounded-full border'>
              <Avatar className='w-24 h-24'>
                <AvatarImage
                  className='object-cover'
                  src={
                    thumbnailUrl! || group.thumbnail_url
                  }
                  alt='img'
                />
                <AvatarFallback className='text-4xl'>
                  {group?.name?.slice(0, 2)}
                </AvatarFallback>
              </Avatar>

              {group.current_user_role === 'admin' && (
                <>
                  {!thumbnailUrl ? (
                    <label
                      htmlFor='avatar'
                      className='bg-background p-1 px-2 rounded-md absolute cursor-pointer flex items-center gap-2 text-sm top-1 -right-[40%] hover:bg-background/80'
                    >
                      <CameraIcon className='size-4'/>
                      Thumbnail
                      <input
                        onChange={(e) =>
                          handleUpload(
                            e,
                            setThumbnailUrl!,
                            setThumbnailFile!
                          )
                        }
                        type='file'
                        hidden
                        id='avatar'
                      />
                    </label>
                  ) : (
                    <button
                      onClick={clearThumbnail}
                      className='bg-background p-2 absolute border cursor-pointer rounded-full top-1 -right-[10%]'
                    >
                      <XIcon className='size-4 text-red-500'/>
                    </button>
                  )}
                </>
              )}
            </div>

            <div className='flex items-center p-3 justify-between gap-1'>
              <h2 className='text-xl font-bold ml-28'>{group.name}</h2>

              {group?.current_user_role === 'admin' &&
                (
                  <div className='flex items-center gap-2'>
                    <Button
                      onClick={onSubmit}
                      className='capitalize flex items-center gap-2 min-w-10 tracking-wide'
                    >
                      {loading ? (
                        <Loading/>
                      ) : (
                        <PencilIcon className='size-4'/>
                      )}
                      {loading ? 'Processing' : 'Update Profile'}
                    </Button>

                    <Button
                      onClick={()=>setOpen(true)}
                      className='capitalize flex items-center gap-2 min-w-10 tracking-wide'
                    >
                      Invite
                    </Button>
                  </div>
                )
              }

              {!group.is_current_user_in_group ? (
                <Button
                  onClick={handleJoinGroup}
                  className='capitalize flex items-center gap-2 min-w-10 tracking-wide'
                >
                  {isPending ? <Loading/> : 'Join'}
                </Button>
              ) : (
                <Button
                  onClick={()=>{}}
                  className='capitalize flex items-center gap-2 min-w-10 tracking-wide bg-red-400 hover:bg-red-500 text-white'
                >
                  {isPending ? <Loading/> : 'Leave'}
                </Button>
              )}
            </div>
          </div>

          <div className='mt-2 pb-4'>
            <TabsList className='flex items-center flex-wrap gap-1 justify-center sm:justify-start'>
              <TabsTrigger
                value='posts'
                className='px-4 py-1 data-[state=active]:border-b-2  data-[state=active]:border-blue-400 data-[state=active]:text-blue-400'
              >
                Posts
              </TabsTrigger>


              {group.current_user_role === 'admin' && (

                <TabsTrigger
                  value='users'
                  className='px-4 py-1 data-[state=active]:border-b-2  data-[state=active]:border-blue-400 data-[state=active]:text-blue-400'
                >
                  Users
                </TabsTrigger>
              )}


              {group.current_user_role === 'admin' && (

                <TabsTrigger
                  value='requests'
                  className='px-4 py-1 data-[state=active]:border-b-2  data-[state=active]:border-blue-400 data-[state=active]:text-blue-400'
                >
                  Requests
                </TabsTrigger>
              )}

              <TabsTrigger
                value='photos'
                className='px-4 py-1 data-[state=active]:border-b-2  data-[state=active]:border-blue-400 data-[state=active]:text-blue-400'
              >
                Photos
              </TabsTrigger>
            </TabsList>
          </div>
        </div>

        {/* group invite modal */}
        <GroupInviteModal open={open} closeModal={closeModal} slug={group.slug}/>


        {/* tabs content */}

        {/* posts */}
        <TabsContent value='posts'>
          <GroupPosts isUserInGroup={group.is_current_user_in_group} currentUserRole={group.current_user_role} id={group.id!}/>
        </TabsContent>

        {/* users */}
        {group.current_user_role === 'admin' && (
          <TabsContent value='users'>
            <GroupUserList
              currentUserRole={group.current_user_role!}
              group_slug={group.slug} users={data.gpUsers!} />
          </TabsContent>
        )}


        {/* request users */}
        {group.current_user_role === 'admin' && (
          <TabsContent value='requests'>
            <GroupUserList
              currentUserRole={group.current_user_role!}
              isRequestUser group_slug={group.slug}  users={data.gpRequestUsers!}  />
          </TabsContent>
        )}

        {/* photos */}
        <TabsContent value='photos'>
          <GroupPhotoTabContent slug={group.slug}/>
        </TabsContent>
      </Tabs>
    </>
  )
}

export default ProfileTabs
