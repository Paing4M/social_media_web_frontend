import Axios from '@/lib/axios'

export interface SignUpData {
	name: string
	email: string
	password: string
	password_confirmation: string
}

export interface SignInData {
	email: string
	password: string
}

export const signUp = async (data: SignUpData) => {
	const res = await Axios.post('/register', data)
	return res.data
}

export const signIn = async (data: SignInData) => {
	const res = await Axios.post('/login', data)
	return res.data
}

export const logout = async () => {
	const res = await Axios.post('/logout')
	return res.data
}
