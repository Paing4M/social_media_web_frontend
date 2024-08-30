import { addComment } from '@/actions/comment'
import { useMutation } from '@tanstack/react-query'

const useCreateComment = () => {
	return useMutation({
		mutationKey: ['post', 'comment'],
		mutationFn: addComment,
	})
}

export const useComment = () => {
	return {
		useCreateComment,
	}
}
