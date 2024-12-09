'use client'

import { usePost } from '@/hooks/usePost'
import PostItem from './PostItem'
import InfiniteScrollContainer from '../InfiniteScrollContainer'
import Loading from '../Loading'
import PostEditModal from '../modal/PostEditModal'
import { useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import AttachmentPreviewModal from '../modal/AttachmentPreviewModal'
import { usePostReaction } from '@/hooks/usePostReaction'

const PostContainer = () => {
  const [open, setOpen] = useState(false)
  const [openPreview, setOpenPreview] = useState(false)
  const [editPost, setEditPost] = useState<Post | null>(null)
  const [attachmentsPreview, setAttachmentsPreview] = useState<
    PostAttachmentInterface[] | []
  >([])
  const [previewIndex, setPreviewIndex] = useState(0)

  const { useGetPosts, useDeleteMutation } = usePost()
  const { useCreateReaction } = usePostReaction()
  const { data, isLoading, hasNextPage, fetchNextPage, isFetchingNextPage } =
    useGetPosts()

  const { mutateAsync } = useDeleteMutation()
  const { mutateAsync: reactionMutateAsync } = useCreateReaction()

  const posts = data?.pages.flatMap((page) => page.data) || []

  function handleEdit(post: Post) {
    setOpen(true)
    setEditPost(post)
  }

  function closeModal() {
    setOpen(false)
    setEditPost(null)
  }

  const queryClient = useQueryClient()

  async function handleDelete(id: number) {
    try {
      await mutateAsync(id, {
        onSuccess: (res) => {
          // console.log(res)

          // delete the post
          queryClient.setQueryData(
            ['get', 'getPosts'],
            (oldData: QueryDataInterface<Post[]>) => {
              if (!oldData) return
              const newData = {
                ...oldData,
                pages: oldData.pages.map((page) => {
                  let updatedPost = page.data.filter(
                    (post) => post.id !== res?.post_id
                  )

                  return {
                    ...page,
                    data: updatedPost,
                  }
                }),
              }

              return newData
            }
          )

          toast.success(res.message)
        },
      })
    } catch (err) {
      console.log(err)
    }
  }

  function handlePreview(attachments: PostAttachmentInterface[], idx: number) {
    setAttachmentsPreview(attachments)
    setPreviewIndex(idx)
    setOpenPreview(true)
  }

  function closePreview() {
    setAttachmentsPreview([])
    setPreviewIndex(0)
    setOpenPreview(false)
  }

  function handleReaction(id: number) {
    try {
      let data = {
        reaction: 'like',
        id: id,
      }

      reactionMutateAsync(data, {
        onSuccess: (res) => {
          queryClient.setQueryData(
            ['get', 'getPosts'],
            (oldData: QueryDataInterface<Post[]>) => {
              if (!oldData) return
              const newData = {
                ...oldData,
                pages: oldData.pages.map((page) => {
                  return {
                    ...page,
                    data: page.data.map((post) =>
                      post.id === res.post.id
                        ? { ...post, ...res.post }
                        : post
                    ),
                  }
                }),
              }

              return newData
            }
          )
        },
      })
    } catch (err) {
      console.log(err)
    }
  }

  if (isLoading && !isFetchingNextPage) return <Loading className={'mt-2'}/>

  return (
    <>
      <InfiniteScrollContainer
        isOnBottom={() => {
          hasNextPage && !isFetchingNextPage && fetchNextPage()
        }}
        className='mt-5 pb-5 flex flex-col gap-5'
      >
        {posts?.map((post) => (
          <PostItem
            key={post?.id}
            post={post!}
            handleEdit={handleEdit}
            handlePreview={handlePreview}
            handleDelete={handleDelete}
            handleReaction={handleReaction}
          />
        ))}

        {isFetchingNextPage && <Loading />}
      </InfiniteScrollContainer>

      {/* edit modal */}
      <PostEditModal
        title='Edit Post'
        key={editPost?.id!}
        post={editPost}
        open={open}
        closeModal={closeModal}
      />

      {/* preview modal */}
      {attachmentsPreview.length > 0 && (
        <AttachmentPreviewModal
          key={attachmentsPreview?.length}
          attachments={attachmentsPreview}
          open={openPreview}
          idx={previewIndex}
          closeModal={closePreview}
          setIndex={setPreviewIndex}
        />
      )}
    </>
  )
}

export default PostContainer
