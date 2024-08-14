import Axios from '@/lib/axios'

interface AddPostInterface {
	body: string
}

interface UpdatePostInterface {
	id: number
	body: string
	_method?: string
}

interface GetPostsInterface {
	cursor?: string | null
}

export const addPost = async (data: AddPostInterface) => {
	const res = await Axios.post('/post', data)
	return res.data
}

export const getPosts = async (cursor: string | null = null) => {
	const res = await Axios.get('/post?cursor=' + cursor)
	return res.data
}

export const updatePost = async (data: UpdatePostInterface) => {
	const updateData = {
		...data,
		_method: 'PUT',
	}
	const res = await Axios.post('/post/' + data.id, updateData)
	return res.data
}
