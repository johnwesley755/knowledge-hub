import { useQuery, useMutation, useQueryClient } from 'react-query'
import api from '../services/api'
import toast from 'react-hot-toast'

export const useDocuments = (filters = {}) => {
  return useQuery(
    ['documents', filters],
    async () => {
      const params = new URLSearchParams(filters)
      const response = await api.get(`/documents?${params}`)
      return response.data
    },
    {
      staleTime: 5 * 60 * 1000, // 5 minutes
    }
  )
}

export const useDocument = (id) => {
  return useQuery(
    ['document', id],
    async () => {
      const response = await api.get(`/documents/${id}`)
      return response.data.data
    },
    {
      enabled: !!id
    }
  )
}

export const useCreateDocument = () => {
  const queryClient = useQueryClient()
  
  return useMutation(
    async (documentData) => {
      const response = await api.post('/documents', documentData)
      return response.data
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('documents')
        toast.success('Document created successfully!')
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || 'Failed to create document')
      }
    }
  )
}

export const useUpdateDocument = () => {
  const queryClient = useQueryClient()
  
  return useMutation(
    async ({ id, ...documentData }) => {
      const response = await api.put(`/documents/${id}`, documentData)
      return response.data
    },
    {
      onSuccess: (data, variables) => {
        queryClient.invalidateQueries('documents')
        queryClient.invalidateQueries(['document', variables.id])
        toast.success('Document updated successfully!')
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || 'Failed to update document')
      }
    }
  )
}

export const useDeleteDocument = () => {
  const queryClient = useQueryClient()
  
  return useMutation(
    async (id) => {
      const response = await api.delete(`/documents/${id}`)
      return response.data
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('documents')
        toast.success('Document deleted successfully!')
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || 'Failed to delete document')
      }
    }
  )
}

export const useToggleLike = () => {
  const queryClient = useQueryClient()
  
  return useMutation(
    async (documentId) => {
      const response = await api.post(`/documents/${documentId}/like`)
      return response.data
    },
    {
      onSuccess: (data, documentId) => {
        queryClient.invalidateQueries(['document', documentId])
        queryClient.invalidateQueries('documents')
      }
    }
  )
}

export const useDocumentVersions = (documentId) => {
  return useQuery(
    ['document-versions', documentId],
    async () => {
      const response = await api.get(`/documents/${documentId}/versions`)
      return response.data.data
    },
    {
      enabled: !!documentId
    }
  )
}