import { isImage } from '@/lib/utils'
import { Attachment, Error } from './PostTextEditor'
import Image from 'next/image'
import { PaperclipIcon, XIcon } from 'lucide-react'

interface PostPreviewAttachmentsProps {
	attachments: Attachment[]
	error: Error
	removeUploadFile: (id: string) => void
}

const PostPreviewAttachments = ({
	attachments,
	error,
	removeUploadFile,
}: PostPreviewAttachmentsProps) => {
	return (
		<div
			className={`mt-2 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3  gap-4 overflow-y-auto ${
				attachments.length === 1 ? 'grid-cols-1' : ''
			}`}
		>
			{attachments?.map((att) => (
				<div
					key={att.id}
					className=' w-full h-full rounded-md  flex flex-col items-center '
				>
					{error?.attachment?.[att.id] && (
						<small className='inline-block text-center text-red-500 mb-2'>
							{error?.attachment?.[att.id]}
						</small>
					)}

					<div className='w-full relative h-full flex flex-col items-center justify-center'>
						{isImage(att.file) ? (
							<div className='w-full h-full rounded-md overflow-hidden'>
								<Image
									src={att.url}
									alt='preview-img'
									width={100}
									height={100}
									className='rounded-md w-full h-full object-cover'
								/>
							</div>
						) : (
							<div
								className={`bg-blue-400 w-full h-full rounded-md flex flex-col items-center justify-center p-2  ${
									error?.attachment?.[att.id]?.[0]
										? 'border-2 border-red-500'
										: ''
								}`}
							>
								<PaperclipIcon className='size-8' />
								<small className='text-center inline-block text-wrap text-xs mt-2'>
									{att.file.name}
								</small>
							</div>
						)}

						<button
							onClick={() => removeUploadFile(att.id)}
							className='absolute top-2 right-2 bg-secondary-foreground/80 z-10 p-1 rounded-full'
						>
							<XIcon className='size-4 text-background' />
						</button>
					</div>
				</div>
			))}
		</div>
	)
}

export default PostPreviewAttachments
