import { addPost, deletePost, getPosts, updatePost } from '@/actions/post'
import { useInfiniteQuery, useMutation, useQuery } from '@tanstack/react-query'

const useGetPosts = () => {
	return useInfiniteQuery({
		queryKey: ['get', 'getPosts'],
		queryFn: ({ pageParam }: { pageParam: string | null }) =>
			getPosts(pageParam!),
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

export const usePost = () => {
	return {
		useAddMutation,
		useGetPosts,
		useUpdateMutation,
		useDeleteMutation,
	}
}
