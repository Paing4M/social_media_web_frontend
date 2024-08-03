'use client'

import { useState } from 'react'
import UserAvatar from '../avatar/UserAvatar'
import Image from 'next/image'
import {
	DownloadIcon,
	FileIcon,
	MessageSquareIcon,
	ThumbsUpIcon,
} from 'lucide-react'
import { Button } from '../ui/button'

const PostItem = () => {
	const [seeMore, setseeMore] = useState(false)

	let t = `Lorem ipsum dolor sit amet consectetur adipisicing elit. Magnam eius
				voluptas incidunt illum! Commodi, necessitatibus facilis, deserunt
				consectetur culpa sed autem expedita, beatae quis placeat fuga
				asperiores nulla esse nostrum?`

	let att = [
		'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8d2FsbHBhcGVyfGVufDB8fDB8fHww',
		'https://images.unsplash.com/photo-1487088678257-3a541e6e3922?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8d2FsbHBhcGVyfGVufDB8fDB8fHww',
		'https://images.unsplash.com/photo-1458682625221-3a45f8a844c7?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8d2FsbHBhcGVyfGVufDB8fDB8fHww',
		'https://images.unsplash.com/photo-1487088678257-3a541e6e3922?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8d2FsbHBhcGVyfGVufDB8fDB8fHww',
	]

	return (
		<div className='p-4 rounded-lg bg-background shadow-sm border'>
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

			<p
				onClick={() => setseeMore((prev) => !prev)}
				className='mt-2 select-none '
			>
				{t.length > 100 && !seeMore ? t.slice(0, 100) : t}{' '}
				{t.length > 0 && !seeMore && (
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
				{att.map((a, idx) => (
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
				))}

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
					className='flex items-center gap-2 w-full justify-center'
				>
					<ThumbsUpIcon className='size-5' />
					Like
				</Button>

				<Button
					variant={'secondary'}
					className='flex items-center gap-2 w-full justify-center py-2 '
				>
					<MessageSquareIcon className='size-5' /> Comment
				</Button>
			</div>
		</div>
	)
}

export default PostItem
