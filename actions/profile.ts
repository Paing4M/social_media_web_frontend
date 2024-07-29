import Axios from '@/lib/axios'

export interface ChangeProfile {
	name?: string | null
	username?: string | null
}

export const changeProfile = async (data: ChangeProfile) => {
	const res = await Axios.patch('/user/profile', data)
	return res.data
}
