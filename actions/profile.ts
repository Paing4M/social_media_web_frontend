import Axios from '@/lib/axios'

export interface ChangeProfile {
	name?: string | null
	username?: string | null
}

export interface ChangeProfileImage {
	cover?: File | null
	avatar?: File | null
}

export const changeProfileInfo = async (data: ChangeProfile) => {
	const res = await Axios.patch('/user/change-profile-info', data)
	return res.data
}

export const changeProfileImage = async (data: ChangeProfileImage) => {
	const res = await Axios.post('/user/change-profile-image', data, {
		headers: {
			'Content-Type': 'multipart/form-data',
		},
	})
	return res.data
}


export const getUserProfile =  async (username:string) =>{
	const res = await Axios.get('/user/' + username)
	return res.data
}