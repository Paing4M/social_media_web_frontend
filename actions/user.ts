import Axios from '@/lib/axios'

export const getUserByUsername = async (username: string) => {
  const res = await Axios.get('/user/' + username)
  return res.data
}


export const getUserPosts = async (username: string, cursor: string | null = null) => {
  const res = await Axios.get(`/user/${username}/posts`)
  return res.data
}