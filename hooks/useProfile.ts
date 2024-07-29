import { changeProfile } from '@/actions/profile'
import { useMutation } from '@tanstack/react-query'

const useProfileMutation = () => {
	return useMutation({
		mutationKey: ['updateProfile'],
		mutationFn: changeProfile,
	})
}

export const useProfile = () => {
	return {
		useProfileMutation,
	}
}
