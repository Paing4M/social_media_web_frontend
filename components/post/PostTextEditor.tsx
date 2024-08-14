'use client'

import UserAvatar from '../avatar/UserAvatar'
import './style.css'
import { Button } from '../ui/button'
import { usePost } from '@/hooks/usePost'
import React, { useState } from 'react'
import InputError from '@/app/(auth)/InputError'
import toast from 'react-hot-toast'
import Loading from '../Loading'

import { EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import { useQueryClient } from '@tanstack/react-query'
import { isImage, readFile } from '@/lib/utils'
import Image from 'next/image'
import { PaperclipIcon, XIcon } from 'lucide-react'

interface PostTextEditorProps {
	user: UserInterface
}

interface Error {
	body?: [string] | null
}

interface Attachment {
	file: File
	url: string
}

const PostTextEditor = ({ user }: PostTextEditorProps) => {
	const [error, setError] = useState<Error | null>(null)
	const [attachments, setAttachments] = useState<Attachment[] | []>([])

	const { useAddMutation } = usePost()
	const { mutateAsync, isPending } = useAddMutation()

	const editor = useEditor({
		extensions: [
			StarterKit.configure({
				bold: false,
				italic: false,
			}),
			Placeholder.configure({
				placeholder: "What's on your mind ...",
			}),
		],
		immediatelyRender: false,
	})

	const input = editor?.getText({ blockSeparator: '\n' }) || ''

	const queryClient = useQueryClient()

	async function onSubmit() {
		try {
			let data = {
				body: input,
				attachments: attachments.map((att) => att.file),
			}

			await mutateAsync(data, {
				onSuccess: (res) => {
					// console.log(res)
					queryClient.invalidateQueries({
						queryKey: ['get', 'getPosts'],
					})

					setAttachments([])
					toast.success(res?.message)
					setError(null)
					editor?.commands.clearContent()
				},
			})
		} catch (err: any) {
			// console.log(err)
			if (err?.response?.status == 422) {
				setError(err?.response?.data?.errors)
			}
		}
	}

	async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
		let files = e.target.files
		if (files) {
			for (let i = 0; i < files.length; i++) {
				const file = files[i]

				let uploadFile = {
					file: file,
					url: await readFile(file),
				}

				setAttachments(
					(prev) =>
						[
							{ ...uploadFile, url: uploadFile.url as string },
							...prev,
						] as Attachment[]
				)
			}
		}

		e.target.value = ''
	}

	function removeUploadFile(file: File) {
		let removedFile = attachments.filter((att) => att.file !== file)
		setAttachments(removedFile)
	}

	return (
		<div className='bg-background p-4 rounded-lg shadow-sm border flex flex-col overflow-hidden h-fit max-h-[400px] gap-y-2'>
			<div className='flex items-start gap-4'>
				<UserAvatar src={user?.avatar_url!} name={user?.username!} />

				<div className='w-full'>
					<EditorContent
						editor={editor}
						className='w-full max-h-[10rem]  overflow-y-auto bg-muted px-4 py-2 rounded-lg '
					/>

					{error?.body && <InputError error={error?.body?.[0]} />}

					<div className='flex items-center justify-end gap-6 mt-3'>
						<div>
							<input
								onChange={handleFile}
								type='file'
								hidden
								id='attachment'
								multiple
							/>
							<label
								className='inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background cursor-pointer transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 text-primary-foreground h-10 px-4 py-2 min-w-20 bg-muted-foreground hover:bg-muted-foreground/90 '
								htmlFor='attachment'
							>
								Files
							</label>
						</div>

						<Button
							disabled={isPending || !(attachments.length > 0 || input)}
							className='min-w-20 bg-muted-foreground hover:bg-muted-foreground/90 transition'
							onClick={onSubmit}
						>
							{isPending ? <Loading /> : 'Post'}
						</Button>
					</div>
				</div>
			</div>

			{/* preview attachment */}
			{attachments.length > 0 && (
				<div
					className={`overflow-y-auto grid gap-2 mt-3  h-full ${
						attachments.length === 1 ? 'grid-cols-1' : 'grid-cols-2'
					}`}
				>
					{attachments?.slice(0, 4)?.map((att, idx) => (
						<div
							key={att.file.name + idx}
							className={`relative overflow-hidden`}
						>
							<>
								{att.url ? (
									<Image
										src={att.url}
										alt='preview-img'
										width={100}
										height={100}
										className='rounded-md w-full h-full object-cover'
									/>
								) : (
									<div className=' bg-blue-400 h-full rounded-md flex flex-col items-center justify-center text-wrap p-4'>
										<PaperclipIcon className='size-8' />
										<small className='text-center text-xs '>
											{att.file.name}
										</small>
									</div>
								)}

								{attachments.length > 4 && idx == 3 && (
									<div className='absolute bg-primary/50 top-0 left-0 right-0  bottom-0 flex items-center justify-center text-background cursor-pointer rounded-md'>
										{attachments.length - 4} more
									</div>
								)}
							</>

							<button
								onClick={() => removeUploadFile(att.file)}
								className='absolute top-1 right-2 bg-secondary-foreground/80 z-10 p-1 rounded-full'
							>
								<XIcon className='size-4 text-background' />
							</button>
						</div>
					))}
				</div>
			)}
		</div>
	)
}

export default PostTextEditor
