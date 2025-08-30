import { useQuery, useMutation, useQueryClient } from 'react-query'
import { authAPI } from '../services/api'
import toast from 'react-hot-toast'

export const useProfile = () => {
  return useQuery(
    'profile',
    () => authAPI.getProfile(),
    {
      select: (response) => response.data.user,
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000 // 10 minutes
    }
  )
}

export const useUpdateProfile = () => {
  const queryClient = useQueryClient()
  
  return useMutation(
    async (profileData) => {
      const response = await authAPI.updateProfile(profileData)
      return response.data
    },
    {
      onSuccess: (data) => {
        // Update both profile and auth context
        queryClient.setQueryData('profile', data.user)
        queryClient.invalidateQueries(['documents'])
        toast.success('Profile updated successfully!')
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || 'Failed to update profile')
      }
    }
  )
}

export const useChangePassword = () => {
  return useMutation(
    async (passwordData) => {
      const response = await authAPI.changePassword(passwordData)
      return response.data
    },
    {
      onSuccess: () => {
        toast.success('Password changed successfully!')
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || 'Failed to change password')
      }
    }
  )
}