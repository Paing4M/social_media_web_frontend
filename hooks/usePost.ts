import {addPost, deletePost, generateAiPost, getPosts, pinPost, updatePost} from '@/actions/post'
import {useInfiniteQuery, useMutation} from '@tanstack/react-query'

const useGetPosts = (search: string | null) => {
  return useInfiniteQuery({
    queryKey: ['get', 'getPosts', search],
    queryFn: ({pageParam}: { pageParam: string | null }) =>
      getPosts(pageParam!, search),
    initialPageParam: null,
    getNextPageParam: (last) => last.meta?.next_cursor,
  })
}

const useAddMutation = () => {
  return useMutation({
    mutationKey: ['post', 'addPost'],
    mutationFn: addPost,
  })
}

const useUpdateMutation = () => {
  return useMutation({
    mutationKey: ['put', 'updatePost'],
    mutationFn: updatePost,
  })
}

const useDeleteMutation = () => {
  return useMutation({
    mutationKey: ['delete', 'deletePost'],
    mutationFn: deletePost,
  })
}

const useAiGenerate = () => {
  return useMutation({
    mutationKey: ['post', 'generateAiPost'],
    mutationFn: generateAiPost
  })
}

const usePinPost = () => {
  return useMutation({
    mutationKey: ['post', 'pinPost'],
    mutationFn: pinPost
  })
}

export const usePost = () => {
  return {
    useAddMutation,
    useGetPosts,
    useUpdateMutation,
    useDeleteMutation,
    useAiGenerate,
    usePinPost
  }
}
