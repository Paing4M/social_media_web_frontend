import Axios from '@/lib/axios'
import { dataTagSymbol } from '@tanstack/react-query'

interface AddCommentInterface {
	post_id?: number
	comment: string
	parent_id?:number
}

interface UpdateCommentInterface extends AddCommentInterface {
	id: number
	_method?: string
}

interface CmtReactionData {
	id: number
	reaction: string
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

export const createCmtReaction = async (data: CmtReactionData) => {
	const res = await Axios.post('/comment/' + data.id + '/reaction', {
		reaction: data.reaction,
	})

	return res.data
}
