import {useInfiniteQuery, useMutation, useQuery} from "@tanstack/react-query";
import {followAction, getFollowingUser, getPhotos, getUserPosts, searchUser, userFollow} from "@/actions/user";

const useGetUserPosts = (username: string) => {
  return useInfiniteQuery({
    queryKey: ['get', 'getUserPosts', username],
    queryFn: ({pageParam}) => getUserPosts(username, pageParam),
    initialPageParam: null,
    getNextPageParam: (last) => last.meta?.next_cursor,
  })
}

const useFollowMutation = () => {
  return useMutation({
    mutationKey: ['post', 'followAction'],
    mutationFn: followAction
  })
}

const useGetUserFollow = (username:string) =>{
  return useQuery({
    queryKey: ['get' , 'follow' , username],
    queryFn:():Promise<UserFollowInterface>=>userFollow(username)
  })
}

const useGetFollowingUser = (username:string) =>{
  return useInfiniteQuery({
    queryKey:['get' , 'followingUser' , username] ,
    queryFn:({pageParam})=>getFollowingUser(username , pageParam),
    initialPageParam:null,
    getNextPageParam: (last) => last.meta?.next_cursor,
  })
}

const useGetPhotos =  (username:string) =>{
  return useInfiniteQuery({
    queryKey:['get' , 'getPhotos' , username],
    queryFn:({pageParam})=>getPhotos(username , pageParam),
    initialPageParam:null,
    getNextPageParam:(last) => last.meta?.next_cursor,
  })

}


const useSearchUser = (search:string) =>{
  return useInfiniteQuery({
    queryKey:['get' , 'searchUser' , search],
    queryFn:({pageParam})=>searchUser(search , pageParam),
    initialPageParam:null,
    getNextPageParam:(last) => last.meta?.next_cursor,
  })
}

export const useUser = () => {
  return {
    useGetUserPosts,
    useFollowMutation,
    useGetUserFollow,
    useGetFollowingUser,
    useGetPhotos,
    useSearchUser
  }
}