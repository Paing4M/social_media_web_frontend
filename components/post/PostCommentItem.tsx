'use client'

import { formatDate } from '@/lib/utils'
import UserAvatar from '../avatar/UserAvatar'
import SeeMore from './SeeMore'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { EllipsisIcon, PencilIcon, TrashIcon } from 'lucide-react'
import React, { useState } from 'react'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { useSession } from 'next-auth/react'
import { useComment } from '@/hooks/useComment'
import { CmtError } from './PostComment'
import toast from 'react-hot-toast'
import { useQueryClient } from '@tanstack/react-query'
import InputError from '@/app/(auth)/InputError'

interface PostCommentProps {
	comment: CommentType
	postId: number
}

const PostCommentItem = ({ comment, postId }: PostCommentProps) => {
	const [editMode, setEditMode] = useState(false)
	const [input, setInput] = useState(comment?.comment!)
	const [error, setError] = useState<CmtError | null>(null)

	const { data } = useSession()
	const { useUpdateComment } = useComment()
	const { mutateAsync: updateCmtAsync, isPending } = useUpdateComment()
	const queryClient = useQueryClient()

	function handleEdit() {
		setEditMode(true)
	}

	function cancleEditMode() {
		setEditMode(false)
		setError(null)
	}

	async function handleCmtUpdate(e: React.FormEvent) {
		e.preventDefault()

		try {
			let data = {
				id: comment?.id,
				post_id: postId,
				comment: input,
			}
			await updateCmtAsync(data, {
				onSuccess: (res) => {
					// console.log(res)

					// update the post comment
					queryClient.setQueryData(
						['get', 'getPosts'],
						(oldData: QueryDataInterface<Post[]> | undefined) => {
							if (!oldData) return

							// update the post comment
							const newData = {
								...oldData,
								pages: oldData.pages.map((page) => ({
									...page,
									data: page.data.map((post) =>
										post.id === res.post_id
											? {
													...post,
													comments: post.comments?.map((cmt) =>
														cmt.id === res.comment?.id
															? res.comment
															: cmt
													),
											  }
											: post
									),
								})),
							}

							return newData
						}
					)

					cancleEditMode()
					toast.success(res?.message)
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
		<div className='flex gap-2 items-start mb-2 last-of-type:mb-0'>
			<UserAvatar
				name={comment?.user?.username}
				src={comment?.user?.avatar_url!}
			/>

			<div className='p-3 rounded-md bg-secondary rounded-tl-none w-full'>
				<div className='flex items-center justify-between'>
					<div className='flex items-center gap-2'>
						<h3 className='font-semibold'>{comment?.user?.username}</h3>
						<span className='text-xs text-muted-foreground'>
							{formatDate(comment?.created_at)}
						</span>
					</div>

					{data?.user.id == comment.user.id && (
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<button className='border-none outline-none'>
									<EllipsisIcon className='size-5' />
								</button>
							</DropdownMenuTrigger>

							<DropdownMenuContent>
								<DropdownMenuItem asChild>
									<button
										onClick={handleEdit}
										className='flex items-center border-none outline-none gap-2 w-full cursor-pointer'
									>
										<PencilIcon className='size-4' />
										Edit
									</button>
								</DropdownMenuItem>

								<DropdownMenuItem asChild>
									<button
										onClick={''}
										className='flex items-center border-none outline-none gap-2 w-full cursor-pointer'
									>
										<TrashIcon className='size-4' />
										Delete
									</button>
								</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
					)}
				</div>

				{editMode ? (
					<form onSubmit={handleCmtUpdate}>
						<div>
							<Input
								onChange={(e) => setInput(e.target.value)}
								value={input}
							/>

							{error?.comment && (
								<InputError error={error?.comment?.[0]} />
							)}

							<div className='flex gap-3 justify-end mt-2'>
								<Button
									onClick={() => {
										cancleEditMode()
										setInput(comment?.comment!)
									}}
									variant={'outline'}
								>
									Cancle
								</Button>

								<Button
									disabled={!input || isPending}
									type='submit'
									className='bg-muted-foreground text-white hover:bg-muted-foreground/80 '
								>
									Update
								</Button>
							</div>
						</div>
					</form>
				) : (
					<SeeMore text={comment?.comment!} className='text-sm' />
				)}
			</div>
		</div>
	)
}

export default PostCommentItem
