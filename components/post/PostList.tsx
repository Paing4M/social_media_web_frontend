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

const PostList = () => {
	const [open, setOpen] = useState(false)
	const [openPreview, setOpenPreview] = useState(false)
	const [editPost, setEditPost] = useState<Post | null>(null)
	const [attachmentsPreview, setAttachmentsPreview] = useState<
		PostAttachmentInterface[] | []
	>([])
	const [previewIndex, setPreviewIndex] = useState(0)

	const { useGetPosts, useDeleteMutation } = usePost()
	const { useCreateReaction } = usePostReaction()
	const { data, isFetching, hasNextPage, fetchNextPage, isFetchingNextPage } =
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
					console.log(res)
					toast.success(res.message)
					queryClient.invalidateQueries({
						queryKey: ['get', 'getPosts'],
					})
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
					queryClient.invalidateQueries({
						queryKey: ['get', 'getPosts'],
					})
				},
			})
		} catch (err) {
			console.log(err)
		}
	}

	if (isFetching && !isFetchingNextPage) return <Loading />

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
						key={post.id}
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

export default PostList
