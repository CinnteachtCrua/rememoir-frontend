import { useQuery } from '@tanstack/react-query'
import { projects } from '../data/dummy-data'

// NOTE: Replace with actual API calls
export function useProjects() {
  return useQuery({
    queryKey: ['projects'],
    queryFn: async () => {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500))
      return projects
    }
  })
}

export function useProject(projectId: string) {
  return useQuery({
    queryKey: ['project', projectId],
    queryFn: async () => {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 300))
      return projects.find(p => p.id === projectId)
    }
  })
}