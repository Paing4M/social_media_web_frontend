'use client'

import { useSession } from 'next-auth/react'
import UserAvatar from '../avatar/UserAvatar'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { AccordionTrigger } from '@radix-ui/react-accordion'
import PostCommentItem from './PostCommentItem'
import { useComment } from '@/hooks/useComment'
import { useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import InputError from '@/app/(auth)/InputError'
import toast from 'react-hot-toast'

type PostCommentProps = {
	post: Post
}

type CmtError = {
	comment: [string]
}

const PostComment = ({ post }: PostCommentProps) => {
	const [input, setInput] = useState('')
	const [error, setError] = useState<CmtError | null>(null)
	const { useCreateComment } = useComment()
	const { mutateAsync, isPending } = useCreateComment()

	const queryClient = useQueryClient()
	const session = useSession()

	const handleComment = async (e: React.FormEvent) => {
		e.preventDefault()
		try {
			const data = {
				id: post?.id,
				comment: input,
			}
			await mutateAsync(data, {
				onSuccess: (res) => {
					queryClient.setQueryData(
						['get', 'getPosts'],
						(oldData: QueryDataInterface<Post[]> | undefined) => {
							if (!oldData) return

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
											  }
											: post
									),
								})),
							}

							return newData
						}
					)

					toast.success(res?.message)
					setInput('')
					setError(null)
				},
			})
		} catch (err: any) {
			console.log(err)
			if (err?.response.status === 422) {
				setError(err?.response?.data?.errors)
			}
		}
	}

	return (
		<form
			onSubmit={handleComment}
			className='mt-3 h-fit max-h-[500px] overflow-hidden flex flex-col '
		>
			<div className='flex items-start gap-2'>
				<UserAvatar
					name={session?.data?.user.username!}
					src={session?.data?.user?.avatar_url!}
				/>
				<div className='w-full'>
					<Input
						value={input}
						onChange={(e) => setInput(e.target.value)}
						placeholder='Write a comment'
					/>

					{error?.comment && <InputError error={error?.comment?.[0]} />}
				</div>
			</div>

			<div className='flex gap-3 justify-end mt-2'>
				<AccordionTrigger asChild>
					<Button variant={'outline'}>Cancle</Button>
				</AccordionTrigger>
				<Button
					disabled={!input || isPending}
					type='submit'
					className='bg-muted-foreground text-white hover:bg-muted-foreground/80 '
				>
					Send
				</Button>
			</div>

			{/* comments */}
			{post?.comments && post?.comments.length > 0 && (
				<div className='mt-4 flex-1 pb-b h-full overflow-y-auto'>
					{post?.comments.slice(0, 5).map((comment) => (
						<PostCommentItem key={comment.id} comment={comment} />
					))}
				</div>
			)}
		</form>
	)
}

export default PostComment
