'use client'

import {usePost} from '@/hooks/usePost'
import PostItem from './PostItem'
import InfiniteScrollContainer from '../InfiniteScrollContainer'
import Loading from '../Loading'
import PostEditModal from '../modal/PostEditModal'
import {useState} from 'react'
import {useQueryClient} from '@tanstack/react-query'
import toast from 'react-hot-toast'
import AttachmentPreviewModal from '../modal/AttachmentPreviewModal'
import {usePostReaction} from '@/hooks/usePostReaction'
import {useGroup} from "@/hooks/useGroup";
import {useUser} from "@/hooks/useUser";


type PostListProps = {
  username?: string | null
  groupId?: number | null
  currentUserRole?: string | null
  search?: string | null
}

const PostList = ({groupId = null, currentUserRole, username = null, search}: PostListProps) => {
  const [open, setOpen] = useState(false)
  const [openPreview, setOpenPreview] = useState(false)
  const [editPost, setEditPost] = useState<Post | null>(null)
  const [attachmentsPreview, setAttachmentsPreview] = useState<
    PostAttachmentInterface[] | []
  >([])
  const [previewIndex, setPreviewIndex] = useState(0)

  const {useGetGpPosts} = useGroup()
  const {useGetPosts, useDeleteMutation, usePinPost} = usePost()
  const {useCreateReaction} = usePostReaction()
  const {useGetUserPosts} = useUser()
  const {data, isLoading, hasNextPage, fetchNextPage, isFetchingNextPage} =
    username ? useGetUserPosts(username) : groupId ? useGetGpPosts(groupId!) : useGetPosts(search!)

  const {mutateAsync} = useDeleteMutation()
  const {mutateAsync: reactionMutateAsync} = useCreateReaction()
  const {mutateAsync: pinPostMutateAsync} = usePinPost()


  let posts = data?.pages.flatMap((page) => page.data) || []

  // if (username || groupId) {
  //   posts = posts.sort((a, b) => {
  //     if (a.pin_created && b.pin_created) {
  //       return b.pin_created - a.pin_created;
  //     } else if (a.pin_created) {
  //       return -1;
  //     } else if (b.pin_created) {
  //       return 1;
  //     }
  //     return b.created_at - a.created_at;
  //   });
  // }

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
          console.log(res)

          // delete the post
          queryClient.setQueryData(
            username
              ? ['get', 'getUserPosts', username]
              : groupId
                ? ['get', 'getGpPosts', groupId]
                : ['get', 'getPosts', search],
            (oldData: QueryDataInterface<Post[]> | undefined) => {
              if (!oldData) return oldData;

              return {
                ...oldData,
                pages: oldData.pages.map((page) => ({
                  ...page,
                  data: page.data.filter((post) => post.id !== res.post_id),
                })),
              };
            }
          )

          toast.success(res.message)
        },
      })
    } catch (err: any) {
      // console.log(err)
      if (err?.response?.status == 403) {
        toast.error(err?.response?.data?.message)
      }
    }
  }

  async function handlePin(postId: number) {
    try {
      await pinPostMutateAsync(postId, {
        onSuccess: (res) => {
          console.log(res)

          if (username || groupId) {
            queryClient.setQueryData(
              username
                ? ['get', 'getUserPosts', username]
                : groupId
                  ? ['get', 'getGpPosts', groupId]
                  : ['get', 'getPosts', search],
              (oldData: QueryDataInterface<Post[]> | undefined) => {
                if (!oldData) return oldData;
                let pin_created_at = res.post.pin_created_at
                return {
                  ...oldData,
                  pages: oldData.pages.map((page) => ({
                    ...page,
                    data: page.data.map((post) =>
                      post.id == res.post.id ? {...post, pin_created_at: pin_created_at} : post
                    ).sort((a, b) => {
                      const aPinDate = a.pin_created_at ? new Date(a.pin_created_at).getTime() : null
                      const bPinDate = b.pin_created_at ? new Date(b.pin_created_at).getTime() : null
                      const aCreatedDate = new Date(a.created_at).getTime()
                      const bCreatedDate = new Date(b.created_at).getTime()

                      if (aPinDate && bPinDate) {
                        return bPinDate - aPinDate
                      } else if (aPinDate) {
                        return -1
                      } else if (bPinDate) {
                        return 1
                      }
                      return bCreatedDate - aCreatedDate
                    }),
                  })),
                };
              }
            )
          }

        }
      })
    } catch (error) {
      console.log(error)
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

  async function handleReaction(id: number) {
    try {
      let data = {
        reaction: 'like',
        id: id,
      }

      await reactionMutateAsync(data, {
        onSuccess: (res) => {
          queryClient.setQueryData(
            username ?
              ['get', 'getUserPosts', username]
              :
              groupId ?
                ['get', 'getGpPosts', groupId] : ['get', 'getPosts', search],
            (oldData: QueryDataInterface<Post[]>) => {
              if (!oldData) return
              return {
                ...oldData,
                pages: oldData.pages.map((page) => {
                  return {
                    ...page,
                    data: page.data.map((post) =>
                      post.id === res.post.id
                        ? {...post, ...res.post}
                        : post
                    ),
                  }
                }),
              }
            }
          )
        },
      })
    } catch (err) {
      console.log(err)
    }
  }


  if (isLoading && !isFetchingNextPage) return <Loading className={'mt-2'}/>

  if (posts.length === 0) return <p className='text-sm text-center'> No Post Found.</p>


  return (
    <>
      <InfiniteScrollContainer
        isOnBottom={() => {
          hasNextPage && !isFetchingNextPage && fetchNextPage()
        }}
        className='pb-5 flex flex-col gap-5'
      >
        {posts?.map((post) => (
          <PostItem
            username={username}
            groupId={groupId!}
            currentUserRole={currentUserRole}
            key={post?.id}
            post={post!}
            handlePin={handlePin}
            handleEdit={handleEdit}
            handlePreview={handlePreview}
            handleDelete={handleDelete}
            handleReaction={handleReaction}
          />
        ))}

        {isFetchingNextPage && <Loading/>}
      </InfiniteScrollContainer>

      {/* edit modal */}
      <PostEditModal
        username={username || null}
        groupId={groupId || null}
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

export default PostList
