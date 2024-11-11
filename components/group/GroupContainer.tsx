'use client'

import Image from 'next/image'
import {CheckIcon, ImageIcon, XIcon} from 'lucide-react'
import React, {useState} from 'react'
import InputError from '@/app/(auth)/InputError'

import toast from 'react-hot-toast'
import GroupTabs from "@/components/group/GroupTabs";
import {useGroup} from "@/hooks/useGroup";

interface GroupContainerProps {
  group: GroupInterface
}

interface Error {
  cover: [string] | null
  thumbnail: [string] | null
}

function Btn({
               children,
               ...props
             }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      className={`outline-none border-none text-xs tracking-wide  px-3 cursor-pointer py-2 bg-muted rounded-md hover:bg-muted/80 flex items-center gap-1 shadow-sm ${props.className}`}
    >
      {children}
    </button>
  )
}


const GroupContainer = ({group:initial}: GroupContainerProps) => {
  const [coverFile, setCoverFile] = useState<File | null>(null)
  const [coverUrl, setCoverUrl] = useState<string | null>(null)
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null)
  const [thumbnailUrl, setThumbnailUrl] = useState<string | null>(null)
  const [group , setGroup] = useState<GroupInterface>(initial)

  const {useGroupProfile} = useGroup()
  const {mutateAsync, isPending} = useGroupProfile()
  const [errors, setErrors] = useState<Error | null>(null)


  const handleUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    setUrl: (url: string) => void,
    setFile: (file: File) => void
  ) => {
    let file = e?.target?.files?.[0]
    let reader = new FileReader()

    if (file) {
      setFile(file)
      reader.onload = () => {
        let url = reader.result as string
        setUrl(url)
      }
      reader.readAsDataURL(file)
    }
  }

  async function handleSubmit() {
    try {
      const data = {
        cover: coverFile!,
        thumbnail: thumbnailFile!,
        slug: group.slug
      }

      await mutateAsync(
        data,
        {
          onSuccess: (res) => {
            console.log('success', res)
            setGroup(res.group)
            clearThumbnail()
            clearCover()
            toast.success(res?.message)
          },
        }
      )
    } catch (err: any) {
      console.log(err)
      if (err?.response?.status == 422) {
        setErrors(err?.response?.data?.errors)
      }
    }
  }

  function clearCover() {
    setCoverUrl(null)
    setCoverFile(null)
  }

  function clearThumbnail() {
    setThumbnailUrl?.(null)
    setThumbnailFile?.(null)
  }


  return (
    <>
      <div className='relative'>
        <div className='rounded-t-lg bg-background relative'>

          {errors && (
            <div className={'absolute top-2 text-white left-2 rounded-md bg-red-400 py-1 px-2'}>
              <p>{errors?.cover?.[0]}</p>
              <p>{errors?.thumbnail?.[0]}</p>
            </div>
          )}
          
          <Image
            src={
              group.cover_url ||
              coverUrl ||
              '/assets/default-cover.jpg'
            }
            priority={false}
            width={1366}
            height={200}
            className='w-full h-[300px] object-cover rounded-t-lg'
            alt='user-cover-img'
          />
        </div>

        {group.current_user_role === 'admin' && (
          <>
            {!coverUrl && (
              <label
                htmlFor='cover_img'
                className='flex items-center gap-2 outline-none border-none uppercase text-xs tracking-wide absolute top-4 right-4 px-3 cursor-pointer py-2 bg-muted rounded-md hover:bg-muted/80 shadow-sm'
              >
                <ImageIcon className='size-4'/>
                Choose Cover Image
                <input
                  onChange={(e) =>
                    handleUpload(e, setCoverUrl, setCoverFile)
                  }
                  type='file'
                  id='cover_img'
                  hidden
                />
              </label>
            )}

            {coverUrl && (
              <div className='absolute top-4 right-4'>
                <Btn
                  onClick={clearCover}
                  className='!bg-destructive !hover:bg-destructive/80 text-white'
                >
                  <XIcon className='size-4'/>
                  Cancel
                </Btn>
              </div>
            )}
          </>
        )}
      </div>

      <GroupTabs
        group={group}
        handleUpload={handleUpload}
        thumbnailUrl={thumbnailUrl}
        setThumbnailUrl={setThumbnailUrl}
        setThumbnailFile={setThumbnailFile}
        onSubmit={handleSubmit}
        loading={isPending}
        clearThumbnail={clearThumbnail}
      />
    </>
  )
}

export default GroupContainer
