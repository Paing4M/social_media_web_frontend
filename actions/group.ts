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

interface InviteGroupInterface {
  slug: string
  value?: string
}

interface JoinGroupInterface {
  token?: string | null
  user_id?: number | null
  group_id?: number | null
  slug?: string | null
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
  const res = await Axios.post('/group/profile/' + data.slug, data, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
  return res.data
}

export const inviteToGroup = async (data: InviteGroupInterface) => {
  const res = await Axios.post('/group/invite/' + data.slug, {value: data.value})
  return res.data
}

export const joinGroup = async (data: JoinGroupInterface) => {
  const res = await Axios.post('/group/join/' + data.slug, data)
  return res.data
}

export const groupRequestAction = async (data: {
  action: string,
  user_id: number,
  group_slug: string
}) => {
  const res = await Axios.post('/group/request-action/' + data.group_slug, data)
  return res.data
}

export const getGroup = async (slug: string) => {
  const res = await Axios.get('/group/' + slug)
  return res.data
}

export const getGpPosts = async (id :number , cursor: string | null = null) =>{
  const res = await Axios.get(`/group/${id}/post?cursor=${cursor}`)
  return res.data
}


type GpChangeRole = {
  user_id:number,
  role :string,
  slug:string
}
export const gpChangeRole = async (data:GpChangeRole) =>{
  const res = await Axios.post('/group/change-role/' + data.slug , {user_id:data.user_id , role:data.role})
  return res.data
}

type GpRemoveUser = {

}
export const gpRemoveUser = async (slug:string , user_id:number ) =>{
  const res = await Axios.post(`/group/${slug}/user/${user_id}/remove-from-group` )
  return res.data
}