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

interface PostModalProps {
	post: Post | null
	open: boolean
	setIsOpen: (open: boolean) => void
}

const PostEditModal = ({ post, open, setIsOpen }: PostModalProps) => {
	const [error, setError] = useState(null)

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
		const data = {
			body: input,
			id: post?.id!,
		}

		try {
			await mutateAsync(data, {
				onSuccess: (res) => {
					console.log(res)
					setIsOpen(false)
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

	return (
		<Dialog open={open} onOpenChange={setIsOpen}>
			<DialogContent
				onInteractOutside={(e) => {
					e.preventDefault()
				}}
			>
				<DialogHeader>
					<DialogTitle>Edit Post</DialogTitle>
					<DialogDescription asChild>
						<div className='mt-4'>
							<EditorContent
								editor={editor}
								className='w-full max-h-[10rem]  overflow-y-auto bg-muted px-4 py-2 rounded-lg '
							/>

							<div className='mt-4 flex items-center justify-between'>
								<button
									onClick={() => setIsOpen(false)}
									className='px-4 py-2 min-w-20 bg-muted-foreground text-background rounded-lg'
								>
									Cancle
								</button>

								<button
									disabled={isPending}
									onClick={handleUpdate}
									className={`px-4 py-2 text-secondary rounded-lg min-w-20 ${
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
