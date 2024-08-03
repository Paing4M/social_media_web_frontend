'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import UserAvatar from '../avatar/UserAvatar'
import './style.css'
import { Button } from '../ui/button'

interface PostTextEditorProps {
	user: UserInterface
}

const PostTextEditor = ({ user }: PostTextEditorProps) => {
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

	async function onSubmit() {
		editor?.commands.clearContent()
	}

	return (
		<div className='bg-background p-4 rounded-lg shadow-sm border flex flex-col overflow-hidden h-fit max-h-[400px] gap-y-2'>
			<div className='flex items-start gap-4'>
				<UserAvatar src={user?.avatar_path!} name={user?.username!} />

				<div className='w-full'>
					<EditorContent
						editor={editor}
						className='w-full max-h-[10rem]  overflow-y-auto bg-muted px-4 py-2 rounded-lg '
					/>

					<div className='flex items-center justify-between gap-6 mt-3'>
						<div>
							<input type='file' hidden id='file' />
							<label
								className='inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background cursor-pointer transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 text-primary-foreground h-10 px-4 py-2 min-w-20 bg-primary hover:bg-primary/90'
								htmlFor='file'
							>
								Files
							</label>
						</div>

						<Button
							className='min-w-20 bg-primary hover:bg-primary/90'
							onClick={onSubmit}
						>
							Post
						</Button>
					</div>
				</div>
			</div>
		</div>
	)
}

export default PostTextEditor
