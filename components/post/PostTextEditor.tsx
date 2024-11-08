'use client'

import UserAvatar from '../avatar/UserAvatar'
import './style.css'
import {Button} from '../ui/button'
import {usePost} from '@/hooks/usePost'
import React, {useEffect, useState} from 'react'
import InputError from '@/app/(auth)/InputError'
import toast from 'react-hot-toast'
import Loading from '../Loading'
import {EditorContent} from '@tiptap/react'
import {useQueryClient} from '@tanstack/react-query'
import {readFile} from '@/lib/utils'
import {v4 as uuidv4} from 'uuid'
import PostPreviewAttachments from './PostPreviewAttachments'
import {useCustomEditor} from '../UseCustomEditor'

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

export let extensions = [
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

const PostTextEditor = ({ user }: PostTextEditorProps) => {
	const [error, setError] = useState<Error | null>(null)
	const [attachments, setAttachments] = useState<Attachment[] | []>([])
	const [extWarning, setExtWarning] = useState(false)

	const { useAddMutation } = usePost()
	const { mutateAsync, isPending } = useAddMutation()

	const editor = useCustomEditor({ placeholder: "What's on your mind ..." })
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
					queryClient.setQueryData(
						['get', 'getPosts'],
						(oldData: QueryDataInterface<Post[]>) => {
							return {
								...oldData,
								pages: oldData.pages.map((page) => {
									return {
										...page,
										data: [res?.post, ...page.data],
									}
								}),
							}
						}
					)

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

				setAttachments((prev) => [
					{ ...uploadFile, url: uploadFile.url as string },
					...prev,
				])
			}
		}

		e.target.value = ''
	}

	// console.log(error)

	useEffect(() => {
		const hasInvalidFile = attachments.some((file) => {
			const ext = file.file?.name?.split('.').pop()
			return ext && !extensions.includes(ext)
		})

		setExtWarning(hasInvalidFile)
	}, [attachments])

	function removeUploadFile(id: string) {
		let updatedAttachments = attachments.filter((att) => att.id !== id)
		setAttachments(updatedAttachments)

		setError((prev) => {
			const updatedErrors = { ...prev?.attachment }
			delete updatedErrors[id]
			return { ...prev, attachment: updatedErrors }
		})
	}

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

					{error?.body?.[0] && <InputError error={error?.body?.[0]!} />}

					{error?.attachments?.[0] !== error?.body?.[0] && (
						<InputError error={error?.attachments?.[0]!} />
					)}

					{error?.attachment &&
						Object.keys(error?.attachment!).length > 0 && (
							<InputError
								error={'Invalid file found. Please remove it.'}
							/>
						)}

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
								className='inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background cursor-pointer transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 text-primary-foreground h-10 px-4 py-2 min-w-20 bg-muted-foreground text-white hover:bg-muted-foreground/90 '
								htmlFor='attachment'
							>
								Files
							</label>
						</div>

						<Button
							disabled={isPending || !(attachments.length > 0 || input)}
							className='min-w-20 bg-muted-foreground hover:bg-muted-foreground/90 text-white transition'
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
