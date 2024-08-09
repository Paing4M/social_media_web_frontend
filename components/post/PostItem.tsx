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

interface PostItemProps {
	post: Post
	handleEdit: (post: Post) => void
}

const PostItem = ({ post, handleEdit }: PostItemProps) => {
	const [seeMore, setseeMore] = useState(false)

	return (
		<div className='p-4 rounded-lg bg-background shadow-sm border'>
			<div className='flex items-center justify-between'>
				<div className='flex items-start gap-3'>
					<UserAvatar name='banana' />
					<div>
						<h3 className='text-[16px] font-semibold tracking-wide '>
							Banana
						</h3>
						<p className='text-muted-foreground text-[13px] leading-4'>
							2024, 03, 01
						</p>
					</div>
				</div>

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
							<button className='flex items-center border-none outline-none gap-2 w-full cursor-pointer'>
								<TrashIcon className='size-4' />
								Delete
							</button>
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
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

			<div className='mt-4 grid  grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3'>
				{/* image */}
				{/* {att.map((a, idx) => (
					<div key={idx} className='relative'>
						<Image
							className='w-full rounded-md h-full object-cover'
							src={a}
							width={120}
							height={120}
							alt='post-att'
						/>
						<button className='border-none outline-none absolute top-2 right-2 bg-background rounded-md p-2'>
							<DownloadIcon className='size-5 ' />
						</button>
					</div>
				))} */}

				{/* cannot preview file */}
				<div className='relative rounded-md flex items-center justify-center flex-col w-full h-full bg-[#F8EDFF]'>
					<FileIcon className='size-20 text-muted-foreground' />
					<p className='text-muted-foreground text-sm'>file name</p>
					<button className='border-none outline-none absolute top-2 right-2 bg-background rounded-md p-2'>
						<DownloadIcon className='size-5 ' />
					</button>
				</div>
			</div>

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
