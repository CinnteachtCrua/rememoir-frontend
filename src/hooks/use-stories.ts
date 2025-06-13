import { useQuery } from '@tanstack/react-query'
import { stories } from '../data/dummy-data'

// NOTE: Replace with actual API calls
export function useStories(projectId: string) {
  return useQuery({
    queryKey: ['stories', projectId],
    queryFn: async () => {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 400))
      return stories.filter(s => s.projectId === projectId)
    }
  })
}