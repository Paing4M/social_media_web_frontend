'use client'

import { AccordionTrigger } from '@radix-ui/react-accordion'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { useCustomEditor } from '../UseCustomEditor'
import InputError from '@/app/(auth)/InputError'
import { Editor, EditorContent, useEditor } from '@tiptap/react'
import { useEffect } from 'react'

interface SubCommentFormProps {
	replyComment: () => void
	editor: Editor
}

const SubCommentForm = ({ replyComment, editor }: SubCommentFormProps) => {
	return (
		<form
			onSubmit={(e) => {
				e.preventDefault()
				replyComment()
			}}
		>
			<div className='flex items-center justify-between gap-2'>
				<EditorContent
					editor={editor}
					className='flex-1 w-full max-h-[10rem]  overflow-y-auto bg-background p-2 text-sm rounded-lg border'
				/>

				{/* {error?.comment && <InputError error={error?.comment?.[0]} />} */}

				<div className='flex gap-1 justify-end'>
					<AccordionTrigger asChild>
						<Button size='sm' variant={'outline'}>
							Cancel
						</Button>
					</AccordionTrigger>

					<Button
						size='sm'
						type='submit'
						className='!px-2 !py-0 bg-muted-foreground text-white hover:bg-muted-foreground/80 '
					>
						Reply
					</Button>
				</div>
			</div>
		</form>
	)
}

export default SubCommentForm
