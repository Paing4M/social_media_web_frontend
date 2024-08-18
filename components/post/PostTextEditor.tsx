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
import { readFile } from '@/lib/utils'
import { v4 as uuidv4 } from 'uuid'
import PostPreviewAttachments from './PostPreviewAttachments'

interface PostTextEditorProps {
	user: UserInterface
}

export interface Error {
	body?: [string] | null
	attachments?: [string] | null
	attachment?: {
		[key: string]: string[] | null
	}
}

export interface Attachment {
	id: string
	file: File
	url: string
}

const PostTextEditor = ({ user }: PostTextEditorProps) => {
	const [error, setError] = useState<Error | null>(null)
	const [attachments, setAttachments] = useState<Attachment[] | []>([])
	const [extWarning, setExtWarning] = useState(false)

	const { useAddMutation } = usePost()
	const { mutateAsync, isPending } = useAddMutation()

	let extensions = [
		'jpg',
		'jpeg',
		'png',
		'gif',
		'webp',
		'mp3',
		'wav',
		'mp4',
		'doc',
		'docx',
		'pdf',
		'csv',
		'xls',
		'xlsx',
		'zip',
		'exe',
	]

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
					setExtWarning(false)
					editor?.commands.clearContent()
				},
			})
		} catch (err: any) {
			if (err?.response?.status == 422) {
				let errors = err?.response?.data?.errors

				for (let key in errors) {
					if (key.includes('attachments.')) {
						let [, idx] = key.split('.')
						const fileId = attachments[Number(idx)]?.id

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
		setExtWarning(false)
		let files = e.target.files
		if (files) {
			for (let i = 0; i < files.length; i++) {
				const file = files[i]

				let uploadFile = {
					id: uuidv4(),
					file: file,
					url: await readFile(file),
				}

				let ext = uploadFile.file.name.split('.').pop()

				if (!extensions.includes(ext!)) setExtWarning(true)

				setAttachments((prev) => [
					{ ...uploadFile, url: uploadFile.url as string },
					...prev,
				])
			}
		}

		e.target.value = ''
	}

	function removeUploadFile(id: string) {
		let updatedAttachments = attachments.filter((att) => att.id !== id)
		setAttachments(updatedAttachments)

		setError((prev) => {
			const updatedErrors = { ...prev?.attachment }
			delete updatedErrors[id]
			return { ...prev, attachment: updatedErrors }
		})
	}

	console.log(extWarning)

	return (
		<div className='bg-background p-4 rounded-lg shadow-sm border flex flex-col overflow-hidden h-fit max-h-[500px] gap-y-2'>
			<div className='flex items-start gap-4'>
				<UserAvatar src={user?.avatar_url!} name={user?.username!} />

				<div className='w-full'>
					<EditorContent
						editor={editor}
						className='w-full max-h-[10rem]  overflow-y-auto bg-muted px-4 py-2 rounded-lg '
					/>

					{extWarning && (
						<div className='bg-amber-100 text-sm border-l-4 my-2 py-2 border-amber-500 rounded-md text-gray-600 text-wrap'>
							<h6 className='px-2'>
								File must be following extensions:
							</h6>
							<small className='px-2'>
								{extensions.map((ext) => ext).join(', ')}
							</small>
						</div>
					)}

					{error?.attachments?.[0] && (
						<InputError error={error?.attachments?.[0]!} />
					)}

					{error?.attachment && <InputError error={'Invalid file'} />}

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
				<PostPreviewAttachments
					error={error!}
					attachments={attachments}
					removeUploadFile={removeUploadFile}
				/>
			)}
		</div>
	)
}

export default PostTextEditor
