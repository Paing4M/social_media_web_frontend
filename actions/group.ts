import Axios from "@/lib/axios";

export interface CreateGroupInterface {
  name : string
  about : string
  auto_approval : boolean
}

export const createGroup = async (data:CreateGroupInterface)=>{
  const res = await Axios.post('/group' ,data )
  return res.data
}