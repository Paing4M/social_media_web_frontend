import Axios from '@/lib/axios'

export const getUserByUsername = async (username: string) => {
  const res = await Axios.get('/user/' + username)
  return res.data
}

export const getUserPosts = async (username: string, cursor: string | null = null) => {
  const res = await Axios.get(`/user/${username}/posts`)
  return res.data
}

export const followAction = async (user_id: number) => {
  const res = await Axios.post('/user/follow-action', {user_id})
  return res.data
}

export const userFollow = async (username: string) => {
  const res = await Axios.get(`/user/${username}/following`)
  return res.data
}

export const getFollowingUser = async (username: string, cursor: string | null = null) => {
  const res = await Axios.get(`/user/${username}/get-following-user?cursor=${cursor}`)
  return res.data
}

export const getPhotos = async (username: string , cursor:string|null = null) => {
  const res = await Axios.get(`/user/${username}/photos?cursor=${cursor}`)
  return res.data
}