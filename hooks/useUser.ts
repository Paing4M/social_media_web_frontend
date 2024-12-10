import {useInfiniteQuery, useQuery} from "@tanstack/react-query";
import {getUserPosts} from "@/actions/user";

const useGetUserPosts = (username:string) =>{
  return useInfiniteQuery({
    queryKey:['get' , 'getUserPosts' , username],
    queryFn:({pageParam})=>getUserPosts(username , pageParam),
    initialPageParam: null,
    getNextPageParam: (last) => last.meta?.next_cursor,
  })

}


export const useUser  = () =>{
  return {
    useGetUserPosts
  }
}