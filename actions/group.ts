import Axios from "@/lib/axios";

export interface CreateGroupInterface {
  name: string
  about: string
  auto_approval: boolean
}

export interface GroupProfile {
  cover?: File | null
  thumbnail?: File | null
  slug: string
}

export const getGroups = async (cursor: string | null = null) => {
  const res = await Axios.get('/group?cursor=' + cursor)
  return res.data
}

export const createGroup = async (data: CreateGroupInterface) => {
  const res = await Axios.post('/group', data)
  return res.data
}


export const changeGroupProfile = async (data: GroupProfile) => {
  console.log(data)


  const res = await Axios.post('/group/profile/' + data.slug, data , {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
  return res.data
}
