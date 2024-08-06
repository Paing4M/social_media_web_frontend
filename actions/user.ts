import Axios from '@/lib/axios'

export const getUserByUsername = async (username: string) => {
	const res = await Axios.get('/user/' + username)
	return res.data
}
