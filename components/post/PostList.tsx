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
import {useGroup} from "@/hooks/useGroup";


type PostListProps = {
	groupId?: number | null
	currentUserRole?:string | null
}

const PostList = ({groupId = null , currentUserRole} : PostListProps) => {
	const [open, setOpen] = useState(false)
	const [openPreview, setOpenPreview] = useState(false)
	const [editPost, setEditPost] = useState<Post | null>(null)
	const [attachmentsPreview, setAttachmentsPreview] = useState<
		PostAttachmentInterface[] | []
	>([])
	const [previewIndex, setPreviewIndex] = useState(0)

	const {useGetGpPosts} = useGroup()
	const { useGetPosts, useDeleteMutation  } = usePost()
	const { useCreateReaction } = usePostReaction()
	const { data, isLoading, hasNextPage, fetchNextPage, isFetchingNextPage } =
	groupId ? useGetGpPosts(groupId!) :	useGetPosts()

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
						groupId
							? ['get', 'getGpPosts', groupId]
							: ['get', 'getPosts'],
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

	async function handleReaction(id: number) {
		try {
			let data = {
				reaction: 'like',
				id: id,
			}

		await reactionMutateAsync(data, {
				onSuccess: (res) => {
					queryClient.setQueryData(
						groupId ?
							['get' , 'getGpPosts' , groupId]:['get', 'getPosts'],
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

	console.log(currentUserRole)


	if (isLoading && !isFetchingNextPage) return <Loading className={'mt-2'}/>

	if(posts.length === 0 ) return <p className='text-sm text-center'> posts not found.</p>


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
						currentUserRole={currentUserRole}
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
