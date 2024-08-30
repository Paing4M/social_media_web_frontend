import Axios from '@/lib/axios'

interface AddCommentInterface {
	id: number
	comment: string
}

export const addComment = async (data: AddCommentInterface) => {
	const res = await Axios.post('/comment/' + data.id, {
		comment: data.comment,
	})

	return res.data
}
