import Axios from '@/lib/axios'

interface AddPostInterface {
	body: string
	group_id?: number | null
}

interface UpdatePostInterface {
	id: number
	body: string
	_method?: string
}

export interface ReactionData {
	reaction: string
	id: number
}

export const addPost = async (data: AddPostInterface) => {
	const res = await Axios.post('/post', data)
	return res.data
}

export const getPosts = async (cursor: string | null = null , search:string | null = null) => {
	const res = await Axios.get(`/post?cursor=${cursor}${search ? `&search=${search}` : ''}`)
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

export const deletePost = async (id: number) => {
	const res = await Axios.delete('/post/' + id)
	return res.data
}

export const createPostReaction = async (data: ReactionData) => {
	const res = await Axios.post(`/post/${data.id}/reaction`, {
		reaction: data.reaction,
	})
	return res.data
}


export const generateAiPost = async (prompt:string) =>{
	const res = await Axios.post('/post/generate-ai-post' , {prompt})
	return res.data
}

export const pinPost  = async  (postId:number) =>{
	const res = await Axios.post(`/post/pin-post/${postId}`)
	return res.data
}