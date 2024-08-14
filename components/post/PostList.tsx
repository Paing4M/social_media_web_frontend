'use client'

import { usePost } from '@/hooks/usePost'
import PostItem from './PostItem'
import InfiniteScrollContainer from '../InfiniteScrollContainer'
import Loading from '../Loading'
import PostEditModal from '../modal/PostEditModal'
import { useEffect, useState } from 'react'

const PostList = () => {
	const [open, setOpen] = useState(false)
	const [editPost, setEditPost] = useState<Post | null>(null)

	const { useGetPosts } = usePost()
	const { data, isFetching, hasNextPage, fetchNextPage, isFetchingNextPage } =
		useGetPosts()

	const posts = data?.pages.flatMap((page) => page.data) || []

	function handleEdit(post: Post) {
		setOpen(true)
		setEditPost(post)
	}

	function closeModal() {
		setOpen(false)
		setEditPost(null)
	}


	return (
		<>
			<InfiniteScrollContainer
				isOnBottom={() => {
					hasNextPage && !isFetchingNextPage && fetchNextPage()
				}}
				className='mt-5 pb-5 flex flex-col gap-5'
			>
				{posts?.map((post) => (
					<PostItem key={post.id} post={post!} handleEdit={handleEdit} />
				))}

				{isFetchingNextPage && <Loading />}
			</InfiniteScrollContainer>

			<PostEditModal
				key={editPost?.id!}
				post={editPost}
				open={open}
				closeModal={closeModal}
			/>
		</>
	)
}

export default PostList
