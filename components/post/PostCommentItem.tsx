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
import {
	EllipsisIcon,
	PencilIcon,
	ReplyIcon,
	ThumbsUpIcon,
	TrashIcon,
} from 'lucide-react'
import React, {
	ButtonHTMLAttributes,
	PropsWithChildren,
	useEffect,
	useState,
} from 'react'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { useSession } from 'next-auth/react'
import { useComment } from '@/hooks/useComment'
import { CmtError } from './PostComment'
import toast from 'react-hot-toast'
import { useQueryClient } from '@tanstack/react-query'
import InputError from '@/app/(auth)/InputError'
import { useCustomEditor } from '../UseCustomEditor'
import { EditorContent } from '@tiptap/react'
import { useCommentReaction } from '@/hooks/useCommentReaction'

interface PostCommentProps {
	comment: CommentType
	postId: number
}

interface CmtReactionBtn
	extends PropsWithChildren<ButtonHTMLAttributes<HTMLButtonElement>> {}

const CmtReactionBtn = ({ children, ...props }: CmtReactionBtn) => (
	<button
		{...props}
		className={
			'text-sm gap-1 px-2 rounded flex items-center ' + props.className
		}
	>
		{children}
	</button>
)

const PostCommentItem = ({ comment, postId }: PostCommentProps) => {
	const [editMode, setEditMode] = useState(false)
	const [error, setError] = useState<CmtError | null>(null)

	const { data } = useSession()

	const { useCreateReaction } = useCommentReaction()
	const { mutateAsync: createCmtReactionAsync } = useCreateReaction()

	const { useUpdateComment, useDeleteComment } = useComment()
	const { mutateAsync: updateCmtAsync, isPending } = useUpdateComment()

	const { mutateAsync: deleteCmtAsync } = useDeleteComment()
	const queryClient = useQueryClient()

	const editor = useCustomEditor({ content: comment?.comment! })
	let input = editor?.getText({ blockSeparator: '\n' }) || ''

	function handleEdit() {
		setEditMode(true)
	}

	function cancleEditMode() {
		setEditMode(false)
		setError(null)
	}

	useEffect(() => {
		if (editor && editMode) {
			editor.commands.setContent(comment?.comment)
		}
	}, [editMode, editor, comment?.comment])

	async function handleCmtUpdate(e: React.FormEvent) {
		e.preventDefault()

		try {
			let data = {
				id: comment?.id,
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
										post.id === postId
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

	async function handleDelete() {
		try {
			await deleteCmtAsync(comment.id, {
				onSuccess: (res) => {
					// console.log(res)

					// delete the post comment
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
										post.id === postId
											? {
													...post,
													comments: post.comments?.filter(
														(cmt) => cmt.id !== res.comment?.id
													),
													comment_count: post.comment_count - 1,
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
		} catch (err) {
			console.log(err)
		}
	}

	async function handleLike() {
		try {
			let data = {
				id: comment.id,
				reaction: 'like',
			}

			await createCmtReactionAsync(data, {
				onSuccess: (res) => {
					// console.log(res)
					queryClient.setQueryData(
						['get', 'getPosts'],
						(oldData: QueryDataInterface<Post[]> | undefined) => {
							if (!oldData) return

							return {
								...oldData,
								pages: oldData.pages.map((page) => ({
									...page,
									data: page.data.map((post) =>
										post.id === postId
											? {
													...post,
													comments: post.comments.map((cmt) =>
														cmt.id == res.comment.id
															? res.comment
															: cmt
													),
											  }
											: post
									),
								})),
							}
						}
					)
				},
			})
		} catch (err) {
			console.log(err)
		}
	}

	console.log(comment?.reacted_by_user)

	return (
		<div className='flex gap-2 items-start mb-3 last-of-type:mb-0'>
			<UserAvatar
				name={comment?.user?.username}
				src={comment?.user?.avatar_url!}
			/>
			<div className='w-full'>
				<div className='p-3 rounded-md bg-secondary rounded-tl-none w-full'>
					<div className='flex items-center justify-between'>
						<div className='flex items-center gap-2'>
							<h3 className='font-semibold'>
								{comment?.user?.username}
							</h3>
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
											onClick={handleDelete}
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
								<EditorContent
									editor={editor}
									className='w-full max-h-[10rem]  overflow-y-auto bg-background px-4 py-2 rounded-lg '
								/>

								{error?.comment && (
									<InputError error={error?.comment?.[0]} />
								)}

								<div className='flex gap-3 justify-end mt-2'>
									<Button
										onClick={() => {
											cancleEditMode()
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

				{/* comment reaction */}
				<div className='flex items-center'>
					<CmtReactionBtn
						className={`${
							comment?.reacted_by_user
								? 'text-indigo-400 dark:text-indigo-300'
								: ''
						}`}
						onClick={handleLike}
					>
						<ThumbsUpIcon className='size-3' />
						{comment?.reaction_count > 0 && (
							<span>({comment?.reaction_count})</span>
						)}

						{comment?.reacted_by_user ? 'liked' : 'like'}
					</CmtReactionBtn>

					<CmtReactionBtn>
						<ReplyIcon className='size-4' />
						<span className='text-sm'>reply</span>
					</CmtReactionBtn>
				</div>
			</div>
		</div>
	)
}

export default PostCommentItem
