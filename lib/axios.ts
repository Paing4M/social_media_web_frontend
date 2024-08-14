import axios, { AxiosRequestHeaders } from 'axios'
import { getSession } from 'next-auth/react'

try {
	axios.get(process.env.NEXT_PUBLIC_API_URL + '/sanctum/csrf-cookie', {
		headers: {
			Accept: 'application/json',
			'Content-Type': 'application/json',
		},
	})
} catch (err) {
	console.log('err_sanctum - ', err)
}

const Axios = axios.create({
	baseURL: `${process.env.NEXT_PUBLIC_API_URL}/api`,
	withCredentials: true,
	withXSRFToken: true,
})

Axios.interceptors.request.use(
	async (config) => {
		const session = await getSession()
		const token = session?.user?.token!

		let headers = {
			Authorization: `Bearer ${token}`,
			Accept: 'application/json',
			// 'Content-Type': 'application/json',
		} as AxiosRequestHeaders

		if (
			config.url?.includes('change-profile-image') ||
			config.url?.includes('post')
		) {
			headers = {
				...headers,
				'Content-Type': 'multipart/form-data',
			} as AxiosRequestHeaders
		}

		config.headers = headers

		return config
	},
	async (response) => response
)
export default Axios
