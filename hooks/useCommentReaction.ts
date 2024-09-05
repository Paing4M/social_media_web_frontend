import { createCmtReaction } from '@/actions/comment'
import { useMutation } from '@tanstack/react-query'

const useCreateReaction = () => {
	return useMutation({
		mutationKey: ['createCmtReaction'],
		mutationFn: createCmtReaction,
	})
}

export const useCommentReaction = () => {
	return { useCreateReaction }
}
