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
import { Button } from '../ui/button'
import { useSession } from 'next-auth/react'
import { useComment } from '@/hooks/useComment'
import { CmtError } from './PostComment'
import toast from 'react-hot-toast'
import InputError from '@/app/(auth)/InputError'
import { useCustomEditor } from '../UseCustomEditor'
import { EditorContent } from '@tiptap/react'
import { useCommentReaction } from '@/hooks/useCommentReaction'
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from '@radix-ui/react-accordion'
import SubCommentForm from './SubCommentForm'
import { useQueryClient } from '@tanstack/react-query'

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
			'text-sm gap-1 px-2 rounded flex items-center text-sx ' +
			props.className
		}
	>
		{children}
	</button>
)

const PostCommentItem = ({
	comment: postComment,
	postId,
}: PostCommentProps) => {
	const [editMode, setEditMode] = useState(false)
	const [error, setError] = useState<CmtError | null>(null)
	const [comment, setComment] = useState<CommentType | null>(postComment)

	const { data } = useSession()

	const { useCreateComment } = useComment()
	const { mutateAsync: createCommentAsync, isPending: creatingCmtPending } =
		useCreateComment()

	const { useCreateReaction } = useCommentReaction()
	const { mutateAsync: createCmtReactionAsync } = useCreateReaction()

	const { useUpdateComment, useDeleteComment } = useComment()
	const { mutateAsync: updateCmtAsync, isPending } = useUpdateComment()

	const { mutateAsync: deleteCmtAsync } = useDeleteComment()

	const editor = useCustomEditor({ content: comment?.comment! })
	let input = editor?.getText({ blockSeparator: '\n' }) || ''

	const replyEditor = useCustomEditor({ placeholder: 'Reply a comment...' })
	let replyInput = replyEditor?.getText({ blockSeparator: '\n' }) || ''

	function handleEdit() {
		setEditMode(true)
	}

	function cancelEditMode() {
		setEditMode(false)
		setError(null)
	}

	useEffect(() => {
		if (editor && editMode) {
			editor.commands.setContent(comment?.comment!)
		}
	}, [editMode, editor, comment?.comment])

	async function handleCmtUpdate(e: React.FormEvent) {
		e.preventDefault()

		try {
			let data = {
				id: comment?.id!,
				comment: input,
			}
			await updateCmtAsync(data!, {
				onSuccess: (res) => {
					// console.log(res)

					// update the post comment
					setComment(res.comment)
					editor?.commands?.clearContent()
					cancelEditMode()
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
			await deleteCmtAsync(comment?.id!, {
				onSuccess: (res) => {
					// console.log(res)

					// delete the post comment
					setComment(null)

					// cancelEditMode()
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
				id: comment?.id!,
				reaction: 'like',
			}

			await createCmtReactionAsync(data!, {
				onSuccess: (res) => {
					setComment(res.comment)
				},
			})
		} catch (err) {
			console.log(err)
		}
	}

	let queryClient = useQueryClient()

	async function replyComment() {
		try {
			const data = {
				post_id: postId,
				comment: replyInput,
				parent_id: comment?.id!,
			}
			await createCommentAsync(data!, {
				onSuccess: (res) => {
					// console.log('reply', res)
					setComment((prev) => {
						if (prev === null) {
							return null
						}
						return {
							...prev,
							comments: [res.comment, ...(prev.comments || [])],
						}
					})
					queryClient.invalidateQueries({
						queryKey: ['get', 'getPosts'],
					})
					replyEditor?.commands.clearContent()
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

	if (!comment) return

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

						{data?.user.id == comment?.user.id && (
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
									className='w-full max-h-[10rem]  overflow-y-auto bg-background px-2 py-1 text-sm rounded-lg '
								/>

								{error?.comment && (
									<InputError error={error?.comment?.[0]} />
								)}

								<div className='flex gap-3 justify-end mt-2'>
									<Button
										size='sm'
										onClick={() => {
											cancelEditMode()
										}}
										variant={'outline'}
									>
										Cancel
									</Button>

									<Button
										size='sm'
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

				<Accordion type='single' collapsible>
					<AccordionItem value='subCommment'>
						{/* comment reaction */}
						<div className='flex items-center'>
							<CmtReactionBtn
								className={`${
									comment?.reacted_by_user
										? 'bg-indigo-300 dark:bg-indigo-400'
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

							<AccordionTrigger asChild>
								<CmtReactionBtn>
									<ReplyIcon className='size-4' />
									<span className='text-sm'>
										{' '}
										{comment.comments.length > 0 &&
											`(${comment.comments.length})`}{' '}
										reply
									</span>
								</CmtReactionBtn>
							</AccordionTrigger>
						</div>
						<AccordionContent
							className='data-[state=open]:animate-accordion-down 
            data-[state=closed]:animate-accordion-up '
						>
							<SubCommentForm
								editor={replyEditor!}
								replyComment={replyComment}
							/>
							<div className='mt-1'>
								{comment?.comments &&
									comment?.comments.map((subCmt) => (
										<PostCommentItem
											key={subCmt.id}
											comment={subCmt}
											postId={postId}
										/>
									))}
							</div>
						</AccordionContent>
					</AccordionItem>
				</Accordion>
			</div>
		</div>
	)
}

export default PostCommentItem
