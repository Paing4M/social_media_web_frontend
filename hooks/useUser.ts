import {useInfiniteQuery, useMutation, useQuery} from "@tanstack/react-query";
import {followAction, getUserPosts} from "@/actions/user";

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


export const useUser = () => {
  return {
    useGetUserPosts,
    useFollowMutation
  }
}