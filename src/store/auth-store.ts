import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface AuthUser {
  id: string
  email: string
  name?: string
  emailConfirmed: boolean
}

interface AuthState {
  user: AuthUser | null
  setUser: (user: AuthUser | null) => void
  clearUser: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      setUser: (user) => set({ user }),
      clearUser: () => set({ user: null }),
    }),
    {
      name: 'auth-storage',
      // NOTE: In production, consider using secure storage for sensitive data
      // For JWT tokens, httpOnly cookies are preferred over localStorage
    }
  )
)