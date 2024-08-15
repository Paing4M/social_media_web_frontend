'use client'

import { useState } from 'react'
import UserAvatar from '../avatar/UserAvatar'
import Image from 'next/image'
import {
	DownloadIcon,
	EllipsisVerticalIcon,
	FileIcon,
	MessageSquareIcon,
	PencilIcon,
	ThumbsUpIcon,
	TrashIcon,
} from 'lucide-react'
import { Button } from '../ui/button'
import {
	DropdownMenu,
	DropdownMenuTrigger,
	DropdownMenuContent,
	DropdownMenuItem,
} from '../ui/dropdown-menu'
import { formatDate, isImage } from '@/lib/utils'
import { useSession } from 'next-auth/react'
import PostAttachments from './PostAttachments'

interface PostItemProps {
	post: Post
	handleEdit: (post: Post) => void
	handleDelete: (id: number) => void
	handlePreview: (attachments: PostAttachmentInterface[], idx: number) => void
}

const PostItem = ({
	post,
	handleEdit,
	handleDelete,
	handlePreview,
}: PostItemProps) => {
	const [seeMore, setseeMore] = useState(false)
	const session = useSession()

	return (
		<div className='p-4 rounded-lg bg-background shadow-sm border'>
			<div className='flex items-center justify-between'>
				<div className='flex items-start gap-3'>
					<UserAvatar
						name={post?.user?.name!}
						src={post?.user?.avatar_url!}
					/>
					<div>
						<h3 className='text-[16px] font-semibold tracking-wide '>
							{post?.user?.name}
						</h3>
						<p className='text-muted-foreground text-xs leading-4'>
							{formatDate(post?.created_at!)}
						</p>
					</div>
				</div>

				{post?.user.id == session?.data?.user.id && (
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<button className='border-none outline-none'>
								<EllipsisVerticalIcon className='size-5' />
							</button>
						</DropdownMenuTrigger>
						<DropdownMenuContent>
							<DropdownMenuItem asChild>
								<button
									onClick={() => handleEdit(post)}
									className='flex items-center border-none outline-none gap-2 w-full cursor-pointer'
								>
									<PencilIcon className='size-4' />
									Edit
								</button>
							</DropdownMenuItem>

							<DropdownMenuItem asChild>
								<button
									onClick={() => handleDelete(post?.id)}
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

			<p
				onClick={() => setseeMore((prev) => !prev)}
				className='mt-2 select-none '
			>
				{post?.body?.length > 100 && !seeMore
					? post?.body?.slice(0, 100)
					: post?.body}{' '}
				{post?.body?.length > 100 && !seeMore && (
					<span
						onClick={(e) => {
							e.stopPropagation()
							setseeMore((prev) => !prev)
						}}
						className='text-blue-500 cursor-pointer text-sm'
					>
						more ...
					</span>
				)}
			</p>

			{post.attachments && (
				<PostAttachments
					handlePreview={handlePreview}
					attachments={post?.attachments!}
				/>
			)}

			<div className='mt-4 grid grid-cols-2 gap-4 py-2'>
				<Button
					variant={'secondary'}
					className='flex items-center gap-2 w-full justify-center bg-secondary hover:bg-muted-foreground/80 hover:text-white transition'
				>
					<ThumbsUpIcon className='size-5' />
					Like
				</Button>

				<Button
					variant={'secondary'}
					className='flex items-center gap-2 w-full justify-center py-2  bg-secondary hover:bg-muted-foreground/80 hover:text-white transition'
				>
					<MessageSquareIcon className='size-5' /> Comment
				</Button>
			</div>
		</div>
	)
}

export default PostItem
