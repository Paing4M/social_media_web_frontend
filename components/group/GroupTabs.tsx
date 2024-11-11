'use cient'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@radix-ui/react-tabs'
import { Button } from '../ui/button'
import { CameraIcon, PencilIcon, UserRoundPlusIcon, XIcon } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import Loading from '../Loading'
import React from "react";

interface ProfileTabsProps {
  group: GroupInterface
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

const ProfileTabs = ({
                       group,
                       thumbnailUrl,
                       handleUpload,
                       setThumbnailUrl,
                       setThumbnailFile,
                       onSubmit,
                       loading,
                       clearThumbnail,
                     }: ProfileTabsProps) => {
  return (
    <>
      <Tabs
        defaultValue={'posts'}
        className='flex flex-col gap-y-5'
      >
        <div className='bg-background shadow-sm rounded-b-lg relative  px-6'>
          <div className='border-b'>
            <div className='absolute top-[-40px] shadow-sm  rounded-full border'>
              <Avatar className='w-24 h-24'>
                <AvatarImage
                  className='object-cover'
                  src={
                      group.thumbnail_url || thumbnailUrl!
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
                      <CameraIcon className='size-4' />
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
                      <XIcon className='size-4 text-red-500' />
                    </button>
                  )}
                </>
              )}
            </div>

            <div className='flex items-center p-3 justify-between gap-1'>
              <h2 className='text-xl font-bold ml-28'>{group.name}</h2>

              {group?.current_user_role === 'admin' &&
                <Button
                  onClick={onSubmit}
                  className='capitalize flex items-center gap-2 min-w-10 tracking-wide'
                >
                  {loading ? (
                    <Loading />
                  ) : (
                    <PencilIcon className='size-4' />
                  )}
                  {loading ? 'Processing' : 'Save'}
                </Button>
              }
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

        <TabsContent value='posts'>posts</TabsContent>
        <TabsContent value='followers'>followers</TabsContent>
        <TabsContent value='followings'>followings</TabsContent>
        <TabsContent value='photos'>photos</TabsContent>
      </Tabs>
    </>
  )
}

export default ProfileTabs
