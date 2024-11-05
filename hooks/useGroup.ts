import {useMutation} from "@tanstack/react-query";
import {createGroup} from "@/actions/group";

const useCreateGroup = () =>{
  return useMutation({
    mutationKey:['post' , 'createGroup'],
    mutationFn:createGroup
  })
}



export  const useGroup = ()=>{
  return {
    useCreateGroup,
  }
}