import { logout, signIn, signUp } from '@/actions/auth'
import { useMutation } from '@tanstack/react-query'

const useSignUpMutation = () => {
	return useMutation({
		mutationKey: ['signUp'],
		mutationFn: signUp,
	})
}

const useSignInMutation = () => {
	return useMutation({
		mutationKey: ['signIn'],
		mutationFn: signIn,
	})
}

const useLogoutMutation = () => {
	return useMutation({
		mutationKey: ['logout'],
		mutationFn: logout,
	})
}

export const useAuth = () => {
	return {
		useSignUpMutation,
		useSignInMutation,
		useLogoutMutation,
	}
}
