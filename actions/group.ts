import Axios from "@/lib/axios";

export interface CreateGroupInterface {
  name : string
  about : string
  auto_approval : boolean
}

export const getGroups = async(cursor:string | null = null) =>{
  const res = await  Axios.get('/group?cursor=' + cursor)
  return res.data
}

export const createGroup = async (data:CreateGroupInterface)=>{
  const res = await Axios.post('/group' ,data )
  return res.data
}

