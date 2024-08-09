'use client'

import UserAvatar from '../avatar/UserAvatar'
import './style.css'
import { Button } from '../ui/button'
import { usePost } from '@/hooks/usePost'
import { useState } from 'react'
import InputError from '@/app/(auth)/InputError'
import toast from 'react-hot-toast'
import Loading from '../Loading'

import { EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import { useQueryClient } from '@tanstack/react-query'

interface PostTextEditorProps {
	user: UserInterface
}

interface Error {
	body?: [string] | null
}

const PostTextEditor = ({ user }: PostTextEditorProps) => {
	const [error, setError] = useState<Error | null>(null)

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
			await mutateAsync(
				{ body: input },
				{
					onSuccess: (res) => {
						// console.log(res)
						queryClient.invalidateQueries({
							queryKey: ['get', 'getPosts'],
						})
						toast.success(res?.message)
						setError(null)
						editor?.commands.clearContent()
					},
				}
			)
		} catch (err: any) {
			// console.log(err)
			if (err?.response?.status == 422) {
				setError(err?.response?.data?.errors)
			}
		}
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
							<input type='file' hidden id='file' />
							<label
								className='inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background cursor-pointer transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 text-primary-foreground h-10 px-4 py-2 min-w-20 bg-muted-foreground hover:bg-muted-foreground/90 '
								htmlFor='file'
							>
								Files
							</label>
						</div>

						<Button
							disabled={isPending || !input}
							className='min-w-20 bg-muted-foreground hover:bg-muted-foreground/90 transition'
							onClick={onSubmit}
						>
							{isPending ? <Loading /> : 'Post'}
						</Button>
					</div>
				</div>
			</div>
		</div>
	)
}

export default PostTextEditor
