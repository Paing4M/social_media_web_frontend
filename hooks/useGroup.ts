import {useInfiniteQuery, useMutation, useQuery} from "@tanstack/react-query";
import {changeGroupProfile, createGroup, getGroups} from "@/actions/group";


const useGetGroups = ()=>{
  return useInfiniteQuery({
    queryKey:['get' , 'groups'],
    queryFn:({pageParam}:{pageParam:string | null} )=>
      getGroups(pageParam!),
    initialPageParam:null ,
    getNextPageParam:(lastPage)=>lastPage.meta?.next_cursor

  })
}

const useCreateGroup = () =>{
  return useMutation({
    mutationKey:['post' , 'createGroup'],
    mutationFn:createGroup
  })
}

const useGroupProfile = () =>{
  return  useMutation({
    mutationKey:['profile'  , 'changeGroupProfile'],
    mutationFn:changeGroupProfile
  })
}

export  const useGroup = ()=>{
  return {
    useCreateGroup,
    useGetGroups,
    useGroupProfile
  }
}