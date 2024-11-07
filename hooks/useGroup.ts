import {useMutation, useQuery} from "@tanstack/react-query";
import {createGroup, getGroups} from "@/actions/group";


const useGetGroups = ()=>{
  return useQuery({
    queryKey:['get' , 'groups'],
    queryFn:getGroups
  })
}

const useCreateGroup = () =>{
  return useMutation({
    mutationKey:['post' , 'createGroup'],
    mutationFn:createGroup
  })
}



export  const useGroup = ()=>{
  return {
    useCreateGroup,
    useGetGroups,
  }
}