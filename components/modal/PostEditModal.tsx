'use client'

import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog'
import { usePost } from '@/hooks/usePost'
import { useQueryClient } from '@tanstack/react-query'
import { EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { FileIcon, UploadIcon, XIcon } from 'lucide-react'
import Image from 'next/image'
import { isImage, readFile } from '@/lib/utils'
import InputError from '@/app/(auth)/InputError'
import '../post/style.css'

interface PostModalProps {
	post: Post | null
	open: boolean
	closeModal: () => void
}

interface UploadFile {
	file: File
	url: string
}

type Attachment = PostAttachmentInterface | UploadFile

type Err = {
	body: [string]
	attachments: [string]
}

const PostEditModal = ({ post, open, closeModal }: PostModalProps) => {
	const [error, setError] = useState<Err | null>(null)
	const [files, setFiles] = useState<Attachment[]>(post?.attachments || [])
	const [deleteIds, setDeleteIds] = useState<Array<number> | []>([])

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
					closeModal()
					toast.success(res.message)
					queryClient.invalidateQueries({
						queryKey: ['get', 'getPosts'],
					})
				},
			})
		} catch (err: any) {
			console.log(err)
			if (err?.response?.status == 422) {
				setError(err?.response?.data?.errors)
			}
		}
	}

	async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
		const selectedFiles = e.target.files
		if (selectedFiles) {
			const newFiles: UploadFile[] = []

			for (let i = 0; i < selectedFiles.length; i++) {
				const file = selectedFiles[i]

				const uploadFile: UploadFile = {
					file: file,
					url: (await readFile(file)) as string,
				}

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
	}

	return (
		<Dialog open={open} onOpenChange={closeModal}>
			<DialogContent
				onInteractOutside={(e) => {
					e.preventDefault()
				}}
			>
				<DialogHeader>
					<DialogTitle>Edit Post</DialogTitle>

					<DialogDescription asChild>
						<div className='mt-4 w-full'>
							{error?.body && <InputError error={error?.body?.[0]} />}

							<EditorContent
								editor={editor}
								className='w-full max-h-[10rem]  overflow-y-auto bg-muted px-4 py-2 rounded-lg '
							/>

							{files && (
								<div
									className={`h-auto max-h-[500px] overflow-y-auto mt-6 grid gap-2 ${
										files.length == 1
											? 'grid-cols-1'
											: 'grid-cols-1 sm:grid-cols-2'
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

									{files?.map((att, idx) => (
										<div
											key={
												(att as UploadFile)?.file?.name ||
												(att as PostAttachmentInterface).name + idx
											}
											className='relative h-full'
										>
											{isImage((att as UploadFile)?.file || att) ? (
												<div className='relative h-[300px]'>
													<Image
														unoptimized
														priority
														className='w-full rounded-md h-full object-cover'
														src={
															(att as UploadFile).url! ||
															(att as PostAttachmentInterface)
																.url!
														}
														width={120}
														height={120}
														alt='post-att'
													/>
												</div>
											) : (
												<>
													{/* cannot preview file */}
													<div className='relative rounded-md flex items-center justify-center flex-col w-full h-full p-4 bg-[#F8EDFF] gap-2'>
														<FileIcon className='size-20 text-muted-foreground' />
														<p className='text-muted-foreground text-xs text-center text-wrap'>
															{(att as UploadFile).file?.name ||
																(att as PostAttachmentInterface)
																	.name}
														</p>
													</div>
												</>
											)}

											<button
												onClick={() =>
													removeFile(
														(att as UploadFile) ||
															(att as PostAttachmentInterface)
													)
												}
												className='border-none outline-none absolute top-2 z-10 right-2 bg-background rounded-md p-2'
											>
												<XIcon className='size-5 ' />
											</button>
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
					</DialogDescription>
				</DialogHeader>
			</DialogContent>
		</Dialog>
	)
}

export default PostEditModal
