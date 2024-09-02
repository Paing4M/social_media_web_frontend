import Axios from '@/lib/axios'

interface AddCommentInterface {
	post_id?: number
	comment: string
}

interface UpdateCommentInterface extends AddCommentInterface {
	id: number
	_method?: string
}

export const addComment = async (data: AddCommentInterface) => {
	const res = await Axios.post('/comment', data)

	return res.data
}

export const updateComment = async (data: UpdateCommentInterface) => {
	data['_method'] = 'PUT'

	const res = await Axios.post('/comment/' + data.id, data)

	return res.data
}

export const deleteComment = async (id: number) => {
	const res = await Axios.delete('/comment/' + id)

	return res.data
}
