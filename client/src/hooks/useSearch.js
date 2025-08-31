import { useState } from 'react'
import { useQuery, useMutation } from 'react-query'
import { searchAPI } from '../services/api'
import { debounce } from '../utils/helpers'
import toast from 'react-hot-toast'

export const useTextSearch = () => {
  const [searchParams, setSearchParams] = useState({
    q: '',
    category: '',
    author: '',
    page: 1,
    limit: 10
  })

  const { data, isLoading, error, refetch } = useQuery(
    ['text-search', searchParams],
    async () => {
      if (!searchParams.q.trim()) {
        return { data: [], pagination: { page: 1, pages: 0, total: 0 } }
      }
      const response = await searchAPI.textSearch(searchParams)
      return response.data
    },
    {
      enabled: false, // Manual trigger
      retry: 1
    }
  )

  const search = (params) => {
    setSearchParams(prev => ({ ...prev, ...params, page: 1 }))
    refetch()
  }

  const changePage = (page) => {
    setSearchParams(prev => ({ ...prev, page }))
    refetch()
  }

  return {
    results: data?.data || [],
    pagination: data?.pagination,
    isLoading,
    error,
    search,
    changePage,
    searchParams
  }
}

export const useSemanticSearch = () => {
  const [results, setResults] = useState([])

  const mutation = useMutation(
    async (searchData) => {
      const response = await searchAPI.semanticSearch(searchData)
      return response.data
    },
    {
      onSuccess: (data) => {
        setResults(data.data || [])
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || 'Semantic search failed')
        setResults([])
      }
    }
  )

  const search = (query, options = {}) => {
    const searchData = {
      query: query.trim(),
      threshold: options.threshold || 0.7,
      limit: options.limit || 10
    }
    mutation.mutate(searchData)
  }

  return {
    results,
    isLoading: mutation.isLoading,
    error: mutation.error,
    search
  }
}

export const useSearchSuggestions = (query) => {
  const debouncedQuery = debounce(query, 300)
  
  const { data } = useQuery(
    ['search-suggestions', debouncedQuery],
    async () => {
      if (!debouncedQuery || debouncedQuery.length < 2) {
        return { data: { tags: [], titles: [] } }
      }
      const response = await searchAPI.getSuggestions({ q: debouncedQuery })
      return response.data
    },
    {
      staleTime: 5 * 60 * 1000, // 5 minutes
      enabled: Boolean(debouncedQuery && debouncedQuery.length >= 2)
    }
  )

  return data?.data || { tags: [], titles: [] }
}