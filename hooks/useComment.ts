import { addComment, updateComment } from '@/actions/comment'
import { useMutation } from '@tanstack/react-query'

const useCreateComment = () => {
	return useMutation({
		mutationKey: ['post', 'comment'],
		mutationFn: addComment,
	})
}

const useUpdateComment = () => {
	return useMutation({
		mutationKey: ['update', 'comment'],
		mutationFn: updateComment,
	})
}

export const useComment = () => {
	return {
		useCreateComment,
		useUpdateComment,
	}
}
