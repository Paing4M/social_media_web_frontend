import {isImage, isVideo} from '@/lib/utils'
import {DownloadIcon, FileIcon, PlayIcon} from 'lucide-react'
import Image from 'next/image'

interface PostAttachmentsProps {
	attachments: PostAttachmentInterface[]
	handlePreview: (attachments: PostAttachmentInterface[], idx: number) => void
}

const PostAttachments = ({
	attachments,
	handlePreview,
}: PostAttachmentsProps) => {
	return (
		<div
			className={`mt-4 grid gap-3 ${
				attachments.length == 1
					? 'grid-cols-1'
					: 'grid-cols-1 sm:grid-cols-2'
			}`}
		>
			{attachments?.slice(0, 4)?.map((att, idx) => (
				<div
					onClick={() => handlePreview(attachments!, idx)}
					key={att.name + idx}
					className='relative h-full cursor-pointer'
				>
					{isImage(att) ? (
						<div className='relative h-full max-h-[350px]'>
							<Image
								unoptimized
								priority
								className='w-full rounded-md h-full object-cover'
								src={att.url!}
								width={120}
								height={120}
								alt='post-att'
							/>
						</div>
					) :
						isVideo(att) ?(
							<div className='relative'>
								<video src={att.url}></video>
								<div className='w-full h-full absolute left-0 top-0 bg-black/50'/>
								<PlayIcon className='w-14 h-14 absolute top-[50%] left-[50%] transform translate-x-[-50%] translate-y-[-50%] text-gray-400 z-10' />
							</div>
							) :
						(
						<>
							{/* cannot preview file */}
							<div className='relative rounded-md flex items-center justify-center flex-col w-full h-full p-4 bg-[#F8EDFF] gap-2'>
								<FileIcon className='size-20 text-muted-foreground' />
								<p className='text-muted-foreground text-xs text-center text-wrap'>
									{att.name}
								</p>
							</div>
						</>
					)
					}
					<a
						onClick={(e) => e.stopPropagation()}
						href={
							process.env.NEXT_PUBLIC_API_URL + '/api/download/' + att.id
						}
						download
						className='border-none block outline-none absolute top-2 z-10 right-2 bg-background rounded-md p-2'
					>
						<DownloadIcon className='size-5 ' />
					</a>

					{attachments && idx == 3 && attachments?.length > 4 && (
						<div className='absolute bg-primary/60 dark:bg-muted/80 dark:text-white top-0 left-0 right-0 bottom-0 flex items-center justify-center text-background cursor-pointer rounded-md'>
							{attachments?.length - 4} more
						</div>
					)}
				</div>
			))}
		</div>
	)
}

export default PostAttachments
