import {useInfiniteQuery, useMutation, useQuery} from "@tanstack/react-query";
import {
  changeGroupProfile,
  createGroup, getGpPosts, getGroup, getGroupPhotos,
  getGroups, gpChangeRole, gpRemoveUser,
  groupRequestAction,
  inviteToGroup,
  joinGroup, leaveGroup, searchGroup
} from "@/actions/group";
import {searchUser} from "@/actions/user";


const useGetGroups = () => {
  return useInfiniteQuery({
    queryKey: ['get', 'groups'],
    queryFn: ({pageParam}: { pageParam: string | null }) =>
      getGroups(pageParam!),
    initialPageParam: null,
    getNextPageParam: (lastPage) => lastPage.meta?.next_cursor

  })
}

const useCreateGroup = () => {
  return useMutation({
    mutationKey: ['post', 'createGroup'],
    mutationFn: createGroup
  })
}

const useGroupProfile = () => {
  return useMutation({
    mutationKey: ['profile', 'changeGroupProfile'],
    mutationFn: changeGroupProfile
  })
}

const useInviteToGroup = () => {
  return useMutation({
    mutationKey: ['post', 'inviterUser'],
    mutationFn: inviteToGroup
  })
}

const useJoinGroup = () => {
  return useMutation({
    mutationKey: ['post', 'joinGroup'],
    mutationFn: joinGroup
  })
}


const useGpAction = () => {
  return useMutation({
    mutationKey: ['post', 'gpAction'],
    mutationFn: groupRequestAction
  })
}

const useGetGroupWithSlug = (slug: string) => {
  return useQuery({
    queryKey: ['getGpBySlug', slug],
    queryFn: () => getGroup(slug)
  })
}

const useGetGpPosts = (id: number) => {
  return useInfiniteQuery({
    queryKey: ['get', 'getGpPosts', id],
    queryFn: ({pageParam}: { pageParam: string | null }) =>
      getGpPosts(id, pageParam!)
    ,
    initialPageParam: null,
    getNextPageParam: (lastPage) => lastPage.meta?.next_cursor
  })
}

const useGpChangeRole = () => {
  return useMutation({
    mutationKey: ['post', 'changeGpRole'],
    mutationFn: gpChangeRole
  })
}


const useRemoveGpUser = () => {
  return useMutation({
    mutationKey: ['post', 'removeGpUser'],
    mutationFn: gpRemoveUser
  })
}

const useGetGpPhotos = (slug: string) => {
  return useInfiniteQuery({
    queryKey: ['get', 'getGpPhotos', slug],
    queryFn: ({pageParam}) => getGroupPhotos(slug, pageParam),
    initialPageParam: null,
    getNextPageParam: (lastPage) => lastPage.meta?.next_cursor
  })
}

const useSearchGroup = (search: string) => {
  return useInfiniteQuery({
    queryKey: ['get', 'searchGroup', search],
    queryFn: ({pageParam}) => searchGroup(search, pageParam),
    initialPageParam: null,
    getNextPageParam: (last) => last.meta?.next_cursor,
  })
}


export const useGroup = () => {
  return {
    useCreateGroup,
    useGetGroups,
    useGroupProfile,
    useInviteToGroup,
    useJoinGroup,
    useGpAction,
    useGetGroupWithSlug,
    useGetGpPosts,
    useGpChangeRole,
    useRemoveGpUser,
    useGetGpPhotos,
    useSearchGroup,

  }
}