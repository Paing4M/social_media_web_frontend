import { changeProfileImage, changeProfileInfo } from '@/actions/profile'
import { useMutation } from '@tanstack/react-query'

const useProfileInfoMutation = () => {
	return useMutation({
		mutationKey: ['updateProfile', 'info'],
		mutationFn: changeProfileInfo,
	})
}

const useProfileImageMutation = () => {
	return useMutation({
		mutationKey: ['updateProfile', 'image'],
		mutationFn: changeProfileImage,
	})
}

export const useProfile = () => {
	return {
		useProfileInfoMutation,
		useProfileImageMutation,
	}
}
