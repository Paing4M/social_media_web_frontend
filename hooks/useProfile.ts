import {changeProfileImage, changeProfileInfo, getUserProfile} from '@/actions/profile'
import {useMutation, useQuery} from '@tanstack/react-query'

const useProfileInfoMutation = () => {
  return useMutation({
    mutationKey: ['updateProfile', 'info'],
    mutationFn: changeProfileInfo,
  })
}

const useProfileImageMutation = () => {
  return useMutation({
    mutationKey: ['updateProfile', 'image'],
    mutationFn: changeProfileImage,
  })
}


const useGetUserProfile = (username: string) => {
  return useQuery({
    queryKey: ['getProfile', username],
    queryFn: () => getUserProfile(username)
  })
}


export const useProfile = () => {
  return {
    useProfileInfoMutation,
    useProfileImageMutation,
    useGetUserProfile,
  }
}
