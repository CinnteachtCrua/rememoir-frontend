import { useQuery } from '@tanstack/react-query'
import { prompts, aiSuggestedPrompts } from '../data/dummy-data'

// NOTE: Replace with actual API calls
export function usePrompts(projectId: string) {
  return useQuery({
    queryKey: ['prompts', projectId],
    queryFn: async () => {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 300))
      return prompts.filter(p => p.projectId === projectId && !p.isUsed)
    }
  })
}

export function useAiSuggestedPrompts(projectId: string) {
  return useQuery({
    queryKey: ['ai-prompts', projectId],
    queryFn: async () => {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 400))
      return aiSuggestedPrompts.filter(p => p.projectId === projectId)
    }
  })
}