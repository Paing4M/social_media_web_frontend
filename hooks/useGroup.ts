import {useInfiniteQuery, useMutation, useQuery} from "@tanstack/react-query";
import {
  changeGroupProfile,
  createGroup, getGroup,
  getGroups,
  groupRequestAction,
  inviteToGroup,
  joinGroup
} from "@/actions/group";


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
    queryKey: ['getGpBySlug' , slug],
    queryFn:()=>getGroup(slug)
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
    useGetGroupWithSlug
  }
}