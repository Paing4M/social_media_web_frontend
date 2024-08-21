'use client'

import { usePost } from '@/hooks/usePost'
import { useQueryClient } from '@tanstack/react-query'
import { EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { FileIcon, PaperclipIcon, UploadIcon, XIcon } from 'lucide-react'
import Image from 'next/image'
import { isImage, readFile } from '@/lib/utils'
import InputError from '@/app/(auth)/InputError'
import '../post/style.css'
import Modal from './Modal'
import { Attachment, Error, extensions } from '../post/PostTextEditor'
import { v4 as uuidv4 } from 'uuid'

interface PostModalProps {
	title?: string
	post: Post | null
	open: boolean
	closeModal: () => void
}

interface UploadFile extends Attachment {}

type AttachmentType = PostAttachmentInterface | UploadFile

const PostEditModal = ({ post, open, closeModal, title }: PostModalProps) => {
	const [error, setError] = useState<Error | null>(null)
	const [files, setFiles] = useState<AttachmentType[]>(post?.attachments || [])
	const [deleteIds, setDeleteIds] = useState<Array<number> | []>([])
	const [extWarning, setExtWarning] = useState(false)

	const { useUpdateMutation } = usePost()
	const { mutateAsync, isPending } = useUpdateMutation()

	const editor = useEditor({
		content: post?.body,
		extensions: [
			StarterKit.configure({
				bold: false,
				italic: false,
			}),
		],
		immediatelyRender: false,
	})
	const input = editor?.getText({ blockSeparator: '\n' }) || ''

	const queryClient = useQueryClient()

	function handleCloseModal() {
		closeModal()
		setExtWarning(false)
		setError(null)
	}

	const handleUpdate = async () => {
		let uploadFiles = files
			?.filter((file) => {
				if ((file as UploadFile).file) {
					return file as UploadFile
				}
			})
			.map((file) => (file as UploadFile).file)

		const data = {
			body: input,
			id: post?.id!,
			deleteIds: deleteIds,
			attachments: uploadFiles,
		}

		try {
			await mutateAsync(data, {
				onSuccess: (res) => {
					// console.log(res)
					handleCloseModal()
					toast.success(res.message)
					queryClient.invalidateQueries({
						queryKey: ['get', 'getPosts'],
					})
				},
			})
		} catch (err: any) {
			if (err?.response?.status == 422) {
				let errors = err?.response?.data?.errors

				for (let key in errors) {
					if (key.includes('attachments.')) {
						let [, idx] = key.split('.')
						const fileId = files[Number(idx)]?.id

						if (fileId) {
							setError((prev) => ({
								attachment: {
									...prev?.attachment,
									[fileId]: errors?.[key],
								},
							}))
						}
					} else {
						setError(errors)
					}
				}
			}
		}
	}

	async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
		const selectedFiles = e.target.files
		if (selectedFiles) {
			const newFiles: UploadFile[] = []

			for (let i = 0; i < selectedFiles.length; i++) {
				const file = selectedFiles[i]

				let uploadFile = {
					id: uuidv4(),
					file: file,
					url: await readFile(file),
				} as UploadFile

				let ext = uploadFile.file.name.split('.').pop()

				if (!extensions.includes(ext!)) setExtWarning(true)

				newFiles.push(uploadFile)
			}

			setFiles((prev) => [...newFiles, ...prev!])
		}

		e.target.value = ''
	}

	async function removeFile(att: PostAttachmentInterface | UploadFile) {
		if ((att as PostAttachmentInterface).id) {
			setDeleteIds((prev) => [
				...prev!,
				(att as PostAttachmentInterface).id!,
			])
		}
		const removedFile = files.filter((file) => file !== att)
		setFiles(removedFile)

		setError((prev) => {
			const updatedErrors = { ...prev?.attachment }
			delete updatedErrors[(att as UploadFile).id]
			return { ...prev, attachment: updatedErrors }
		})
	}

	return (
		<Modal title={title} open={open} closeModal={closeModal}>
			<div className='mt-4 w-full'>
				{extWarning && (
					<div className='bg-amber-100 text-sm border-l-4 my-2 py-2 border-amber-500 rounded-md text-gray-600 text-wrap'>
						<h6 className='px-2'>File must be following extensions:</h6>
						<small className='px-2'>
							{extensions.map((ext) => ext).join(', ')}
						</small>
					</div>
				)}

				{error?.attachments?.[0] && (
					<InputError error={error?.attachments?.[0]!} />
				)}

				{error?.attachment &&
					Object.keys(error?.attachment!).length > 0 && (
						<InputError error={'Invalid file'} />
					)}

				<EditorContent
					editor={editor}
					className='w-full max-h-[10rem]  overflow-y-auto bg-muted px-4 py-2 rounded-lg '
				/>

				{files && (
					<div
						className={`mt-2 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3  gap-4 overflow-y-auto ${
							files.length === 1 ? 'grid-cols-1' : ''
						}`}
					>
						<label
							htmlFor='file'
							className='p-4 cursor-pointer bg-[#F8EDFF] flex flex-col rounded-md items-center justify-center'
						>
							<UploadIcon className='size-8' />
							<small>Upload File</small>
							<input
								id='file'
								onChange={handleFile}
								type='file'
								hidden
								multiple
							/>
						</label>

						{files?.map((att) => (
							<div
								key={
									(att as UploadFile).id ||
									(att as PostAttachmentInterface).id
								}
								className=' w-full h-full rounded-md  flex flex-col items-center '
							>
								{error?.attachment?.[(att as UploadFile).id] && (
									<small className='inline-block text-center text-red-500 mb-2'>
										Invalid File
									</small>
								)}

								<div className='w-full relative h-full flex flex-col items-center justify-center'>
									{isImage((att as UploadFile).file || att) ? (
										<div className='w-full h-full rounded-md overflow-hidden'>
											<Image
												src={
													(att as UploadFile).url ||
													(att as PostAttachmentInterface).path ||
													''
												}
												alt='preview-img'
												width={100}
												height={100}
												className='rounded-md w-full h-full object-cover'
											/>
										</div>
									) : (
										<div
											className={`bg-blue-400 w-full h-full rounded-md flex flex-col items-center justify-center p-2  ${
												error?.attachment?.[(att as UploadFile).id]
													? 'border-2 border-red-500'
													: ''
											}`}
										>
											<PaperclipIcon className='size-8' />
											<small className='text-center inline-block text-wrap text-xs mt-2'>
												{(att as UploadFile).file?.name ||
													(att as PostAttachmentInterface)?.name}
											</small>
										</div>
									)}

									<button
										onClick={() =>
											removeFile(
												(att as UploadFile) ||
													(att as PostAttachmentInterface)
											)
										}
										className='absolute top-2 right-2 bg-secondary-foreground/80 z-10 p-1 rounded-full'
									>
										<XIcon className='size-4 text-background' />
									</button>
								</div>
							</div>
						))}
					</div>
				)}

				<div className='mt-4 flex items-center justify-between'>
					<button
						onClick={closeModal}
						className='px-4 py-2 min-w-20 bg-muted-foreground text-background rounded-lg'
					>
						Cancle
					</button>

					<button
						disabled={isPending}
						onClick={handleUpdate}
						className={`px-4 py-2 text-secondary rounded-lg min-w-20   ${
							isPending ? 'bg-primary/80' : 'bg-primary'
						}`}
					>
						Save
					</button>
				</div>
			</div>
		</Modal>
	)
}

export default PostEditModal
