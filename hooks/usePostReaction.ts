import { createPostReaction } from '@/actions/post'
import { useMutation } from '@tanstack/react-query'

const useCreateReaction = () => {
	return useMutation({
		mutationKey: ['createReaction'],
		mutationFn: createPostReaction,
	})
}

export const usePostReaction = () => {
	return { useCreateReaction }
}
