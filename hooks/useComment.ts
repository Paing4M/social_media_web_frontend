import { addComment, deleteComment, updateComment } from '@/actions/comment'
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

const useDeleteComment = () => {
	return useMutation({
		mutationKey: ['delete', 'comment'],
		mutationFn: deleteComment,
	})
}

export const useComment = () => {
	return {
		useCreateComment,
		useUpdateComment,
		useDeleteComment,
	}
}
