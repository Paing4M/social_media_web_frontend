import { useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'

type UseCustomEditor = {
	placeholder?: string | null
	content?: string | null
}

export const useCustomEditor = ({
	placeholder = null,
	content = null,
}: UseCustomEditor = {}) => {
	const extensions = [
		StarterKit.configure({
			bold: false,
			italic: false,
		}),
	]

	// Conditionally add the Placeholder extension
	if (placeholder) {
		extensions.push(
			Placeholder.configure({
				placeholder: placeholder,
			})
		)
	}

	const editor = useEditor({
		content,
		extensions,
		immediatelyRender: false,
	})

	return editor
}
