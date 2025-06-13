import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/auth-store'

// NOTE: These are placeholder functions - replace with actual Supabase Auth calls
export interface AuthUser {
  id: string
  email: string
  name?: string
  emailConfirmed: boolean
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface SignUpData {
  email: string
  password: string
  name?: string
}

export interface ResetPasswordData {
  password: string
  token: string
}

// Placeholder auth functions - replace with Supabase client calls
const authApi = {
  async signInWithPassword(credentials: LoginCredentials): Promise<{ user: AuthUser; session: any }> {
    // In real implementation:
    // const { data, error } = await supabase.auth.signInWithPassword({
    //   email: credentials.email,
    //   password: credentials.password,
    // });
    // if (error) throw error;
    // return data;
    
    await new Promise(resolve => setTimeout(resolve, 1000)) // Simulate API delay
    
    if (credentials.email === 'test@example.com' && credentials.password === 'password') {
      return {
        user: {
          id: 'user-1',
          email: credentials.email,
          name: 'Test User',
          emailConfirmed: true
        },
        session: { access_token: 'mock-jwt-token', refresh_token: 'mock-refresh-token' }
      }
    }
    throw new Error('Invalid credentials')
  },

  async signUp(data: SignUpData): Promise<{ user: AuthUser; session: any }> {
    // In real implementation:
    // const { data: authData, error } = await supabase.auth.signUp({
    //   email: data.email,
    //   password: data.password,
    //   options: {
    //     data: {
    //       name: data.name,
    //     }
    //   }
    // });
    // if (error) throw error;
    // return authData;
    
    await new Promise(resolve => setTimeout(resolve, 1000))
    return {
      user: {
        id: 'new-user-id',
        email: data.email,
        name: data.name,
        emailConfirmed: false
      },
      session: { access_token: 'mock-jwt-token', refresh_token: 'mock-refresh-token' }
    }
  },

  async setPassword(password: string, token: string): Promise<{ user: AuthUser }> {
    // In real implementation:
    // const { data, error } = await supabase.auth.updateUser({
    //   password: password
    // });
    // if (error) throw error;
    // return data;
    
    await new Promise(resolve => setTimeout(resolve, 1000))
    return {
      user: {
        id: 'user-from-token',
        email: 'user@example.com',
        name: 'User Name',
        emailConfirmed: true
      }
    }
  },

  async resetPasswordForEmail(email: string): Promise<void> {
    // In real implementation:
    // const { error } = await supabase.auth.resetPasswordForEmail(email, {
    //   redirectTo: `${window.location.origin}/reset-password`,
    // });
    // if (error) throw error;
    
    await new Promise(resolve => setTimeout(resolve, 1000))
    console.log('Password reset email sent to:', email)
  },

  async updatePassword(password: string, token: string): Promise<{ user: AuthUser }> {
    // In real implementation:
    // const { data, error } = await supabase.auth.updateUser({
    //   password: password
    // });
    // if (error) throw error;
    // return data;
    
    await new Promise(resolve => setTimeout(resolve, 1000))
    return {
      user: {
        id: 'user-from-reset',
        email: 'user@example.com',
        name: 'User Name',
        emailConfirmed: true
      }
    }
  },

  async signOut(): Promise<void> {
    // In real implementation:
    // const { error } = await supabase.auth.signOut();
    // if (error) throw error;
    
    await new Promise(resolve => setTimeout(resolve, 500))
  },

  async getCurrentUser(): Promise<AuthUser | null> {
    // In real implementation:
    // const { data: { user } } = await supabase.auth.getUser();
    // return user;
    
    const storedUser = localStorage.getItem('auth-user')
    return storedUser ? JSON.parse(storedUser) : null
  }
}

export function useAuth() {
  const { user, setUser, clearUser } = useAuthStore()
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  // Get current user session
  const { data: currentUser, isLoading } = useQuery({
    queryKey: ['auth-user'],
    queryFn: authApi.getCurrentUser,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })

  // Login mutation
  const loginMutation = useMutation({
    mutationFn: authApi.signInWithPassword,
    onSuccess: (data) => {
      setUser(data.user)
      localStorage.setItem('auth-user', JSON.stringify(data.user))
      localStorage.setItem('auth-session', JSON.stringify(data.session))
      queryClient.setQueryData(['auth-user'], data.user)
      navigate('/stories')
    },
  })

  // Sign up mutation
  const signUpMutation = useMutation({
    mutationFn: authApi.signUp,
    onSuccess: (data) => {
      setUser(data.user)
      localStorage.setItem('auth-user', JSON.stringify(data.user))
      localStorage.setItem('auth-session', JSON.stringify(data.session))
      queryClient.setQueryData(['auth-user'], data.user)
      navigate('/setup')
    },
  })

  // Set password mutation
  const setPasswordMutation = useMutation({
    mutationFn: ({ password, token }: { password: string; token: string }) =>
      authApi.setPassword(password, token),
    onSuccess: (data) => {
      setUser(data.user)
      localStorage.setItem('auth-user', JSON.stringify(data.user))
      queryClient.setQueryData(['auth-user'], data.user)
      navigate('/setup')
    },
  })

  // Forgot password mutation
  const forgotPasswordMutation = useMutation({
    mutationFn: authApi.resetPasswordForEmail,
  })

  // Reset password mutation
  const resetPasswordMutation = useMutation({
    mutationFn: ({ password, token }: ResetPasswordData) =>
      authApi.updatePassword(password, token),
    onSuccess: (data) => {
      setUser(data.user)
      localStorage.setItem('auth-user', JSON.stringify(data.user))
      queryClient.setQueryData(['auth-user'], data.user)
      navigate('/stories')
    },
  })

  // Sign out mutation
  const signOutMutation = useMutation({
    mutationFn: authApi.signOut,
    onSuccess: () => {
      clearUser()
      localStorage.removeItem('auth-user')
      localStorage.removeItem('auth-session')
      queryClient.setQueryData(['auth-user'], null)
      queryClient.clear()
      navigate('/login')
    },
  })

  return {
    user: currentUser || user,
    isLoading,
    isAuthenticated: !!(currentUser || user),
    login: loginMutation.mutate,
    signUp: signUpMutation.mutate,
    setPassword: setPasswordMutation.mutate,
    forgotPassword: forgotPasswordMutation.mutate,
    resetPassword: resetPasswordMutation.mutate,
    signOut: signOutMutation.mutate,
    isLoginLoading: loginMutation.isPending,
    isSignUpLoading: signUpMutation.isPending,
    isSetPasswordLoading: setPasswordMutation.isPending,
    isForgotPasswordLoading: forgotPasswordMutation.isPending,
    isResetPasswordLoading: resetPasswordMutation.isPending,
    isSignOutLoading: signOutMutation.isPending,
    loginError: loginMutation.error,
    signUpError: signUpMutation.error,
    setPasswordError: setPasswordMutation.error,
    forgotPasswordError: forgotPasswordMutation.error,
    resetPasswordError: resetPasswordMutation.error,
  }
}