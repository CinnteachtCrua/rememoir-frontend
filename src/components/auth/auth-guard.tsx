import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../hooks/use-auth'

interface AuthGuardProps {
  children: React.ReactNode
  requireAuth?: boolean
  redirectTo?: string
}

export function AuthGuard({ children, requireAuth = true, redirectTo }: AuthGuardProps) {
  const { isAuthenticated, isLoading } = useAuth()
  const location = useLocation()

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  // Redirect unauthenticated users away from protected routes
  if (requireAuth && !isAuthenticated) {
    return <Navigate to={redirectTo || '/login'} state={{ from: location }} replace />
  }

  // Redirect authenticated users away from auth routes
  if (!requireAuth && isAuthenticated) {
    const from = location.state?.from?.pathname || '/stories'
    return <Navigate to={from} replace />
  }

  return <>{children}</>
}