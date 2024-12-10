'use client'

import {useSession} from 'next-auth/react'
import UserAvatar from '../avatar/UserAvatar'
import {Button} from '../ui/button'
import {AccordionTrigger} from '@radix-ui/react-accordion'
import PostCommentItem from './PostCommentItem'
import {useComment} from '@/hooks/useComment'
import {useQueryClient} from '@tanstack/react-query'
import React, {useState} from 'react'
import InputError from '@/app/(auth)/InputError'
import toast from 'react-hot-toast'
import {EditorContent} from '@tiptap/react'
import {useCustomEditor} from '../UseCustomEditor'


type PostCommentProps = {
  post: Post
  groupId?: number | null
  username?: string | null
}

export type CmtError = {
  comment: [string]

}

const PostComment = ({post, groupId, username}: PostCommentProps) => {
  const [error, setError] = useState<CmtError | null>(null)
  const {useCreateComment} = useComment()
  const {mutateAsync, isPending} = useCreateComment()

  const queryClient = useQueryClient()
  const session = useSession()

  const editor = useCustomEditor({placeholder: 'Write a comment...'})

  const input = editor?.getText({blockSeparator: '\n'}) || ''


  const handleComment = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const data = {
        post_id: post?.id,
        comment: input,
      }
      await mutateAsync(data, {
        onSuccess: (res) => {
          queryClient.setQueryData(
            username ?
              ['get', 'getUserPosts', username] :
              groupId ? ['get', 'getGpPosts', post?.group.id] :
                ['get', 'getPosts'],
            (oldData: QueryDataInterface<Post[]> | undefined) => {
              if (!oldData) return
              console.log({oldData})


              const newData = {
                ...oldData,
                pages: oldData.pages.map((page) => ({
                  ...page,
                  data: page.data.map((post) =>
                    post.id === res.post_id
                      ? {
                        ...post,
                        comments: [
                          res.comment,
                          ...post.comments,
                        ],
                        comment_count: post.comment_count + 1,
                      }
                      : post
                  ),
                })),
              }

              return newData
            }
          )

          toast.success(res?.message)
          editor?.commands.clearContent()
          setError(null)
        },
      })
    } catch (err: any) {
      // console.log(err)
      if (err?.response?.status === 422) {
        setError(err?.response?.data?.errors)
      }
    }
  }

  return (
    <div className='mt-2 border-t-2 py-3 h-fit  flex flex-col '>
      <form onSubmit={handleComment}>
        <div className='flex items-start gap-2'>
          <UserAvatar
            name={session?.data?.user.username!}
            src={session?.data?.user?.avatar_url!}
          />
          <div className='w-full'>
            <EditorContent
              editor={editor}
              className='w-full max-h-[10rem]  overflow-y-auto bg-muted px-4 py-2 rounded-lg '
            />

            {error?.comment && <InputError error={error?.comment?.[0]}/>}
          </div>
        </div>

        <div className='flex gap-3 justify-end mt-2'>
          <AccordionTrigger asChild>
            <Button variant={'outline'}>Cancel</Button>
          </AccordionTrigger>
          <Button
            disabled={!input || isPending}
            type='submit'
            className='bg-muted-foreground text-white hover:bg-muted-foreground/80 '
          >
            Send
          </Button>
        </div>
      </form>
      {/* comments */}
      {post?.comments && post?.comments.length > 0 && (
        <div className='mt-4 flex-1   h-full overflow-y-auto'>
          {post?.comments.slice(0, 5).map((comment) => (
            <PostCommentItem
              postId={post?.id}
              key={comment.id}
              comment={comment}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default PostComment
