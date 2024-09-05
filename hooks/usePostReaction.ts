import { createPostReaction } from '@/actions/post'
import { useMutation } from '@tanstack/react-query'

const useCreateReaction = () => {
	return useMutation({
		mutationKey: ['createPostReaction'],
		mutationFn: createPostReaction,
	})
}

export const usePostReaction = () => {
	return { useCreateReaction }
}
