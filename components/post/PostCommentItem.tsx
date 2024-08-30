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
import { useState } from 'react'
import { Input } from '../ui/input'

interface PostCommentProps {
	comment: CommentType
}

const PostCommentItem = ({ comment }: PostCommentProps) => {
	const [editMode, setEditMode] = useState(false)
	const [input, setInput] = useState(comment?.comment!)

	function handleEdit() {
		setEditMode(true)
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
				</div>

				{editMode ? (
					<div>
						<Input
							onChange={(e) => setInput(e.target.value)}
							value={input}
						/>
					</div>
				) : (
					<SeeMore text={comment?.comment!} className='text-sm' />
				)}
			</div>
		</div>
	)
}

export default PostCommentItem
