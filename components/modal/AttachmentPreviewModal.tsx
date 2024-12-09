'use client'

import { isImage } from '@/lib/utils'
import Modal from './Modal'
import Image from 'next/image'
import { ChevronLeftIcon, ChevronRightIcon, Paperclip } from 'lucide-react'

interface AttachmentPreviewModalProps {
	attachments: PostAttachmentInterface[]
	open: boolean
	closeModal: () => void
	idx: number
	setIndex: (idx: number) => void
}

const AttachmentPreviewModal = ({
	attachments,
	open,
	closeModal,
	idx,
	setIndex,
}: AttachmentPreviewModalProps) => {
	function next() {
		if (idx == attachments.length - 1) {
			setIndex(0)
		} else {
			setIndex(idx + 1)
		}
	}

	function prev() {
		if (idx == 0) {
			setIndex(attachments.length - 1)
		} else {
			setIndex(idx - 1)
		}
	}

	return (
		<Modal
			className='max-w-none h-screen rounded-none bg-primary/50 backdrop-blur-md dark:bg-muted/50 text-background dark:text-white'
			open={open}
			closeModal={closeModal}
		>
			<div className='w-full flex items-center justify-center h-full p-4 relative'>
				{isImage(attachments[idx]) ? (
					<div className='relative w-full h-full '>
						<Image
							src={attachments[idx]?.url!}
							className='object-contain '
							alt='preview-img'
							fill
						/>
					</div>
				) : (
					<div className='bg-blue-200 max-w-[300px] w-full p-4 rounded-lg text-black h-[300px] flex flex-col items-center justify-center gap-4'>
						<Paperclip className='size-10' />
						<small className='w-full text-center text-wrap'>
							{attachments[idx]?.name}
						</small>
					</div>
				)}

				<button
					onClick={prev}
					className='absolute top-[50%] left-0 translate-y-[-50%] hover:text-white'
				>
					<ChevronLeftIcon className='size-14 sm:size-20 ' />
				</button>
				<button
					onClick={next}
					className='absolute top-[50%] right-0 translate-y-[-50%] hover:text-white'
				>
					<ChevronRightIcon className='size-14 sm:size-20' />
				</button>
			</div>
		</Modal>
	)
}

export default AttachmentPreviewModal
