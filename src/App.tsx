import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AuthGuard } from './components/auth/auth-guard'
import { DashboardLayout } from './components/layout/dashboard-layout'
import { StoriesPage } from './pages/stories'
import { PromptsPage } from './pages/prompts'
import { SettingsPage } from './pages/settings'
import { OrderBookPage } from './pages/order-book'
import { ProjectSetupPage } from './pages/project-setup'
import { SessionsPage } from './pages/sessions'
import { LoginPage } from './pages/auth/login-page'
import { SignUpPage } from './pages/auth/signup-page'
import { SetPasswordPage } from './pages/auth/set-password-page'
import { ForgotPasswordPage } from './pages/auth/forgot-password-page'
import { ResetPasswordPage } from './pages/auth/reset-password-page'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 1,
    },
  },
})

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          {/* Public routes - no authentication required */}
          <Route path="/session/:sessionId" element={<SessionsPage />} />
          
          {/* Authentication routes - redirect if already authenticated */}
          <Route path="/login" element={
            <AuthGuard requireAuth={false}>
              <LoginPage />
            </AuthGuard>
          } />
          <Route path="/signup" element={
            <AuthGuard requireAuth={false}>
              <SignUpPage />
            </AuthGuard>
          } />
          <Route path="/set-password/:token" element={
            <AuthGuard requireAuth={false}>
              <SetPasswordPage />
            </AuthGuard>
          } />
          <Route path="/forgot-password" element={
            <AuthGuard requireAuth={false}>
              <ForgotPasswordPage />
            </AuthGuard>
          } />
          <Route path="/reset-password/:token" element={
            <AuthGuard requireAuth={false}>
              <ResetPasswordPage />
            </AuthGuard>
          } />
          
          {/* Protected routes - require authentication */}
          <Route path="/setup" element={
            <AuthGuard>
              <ProjectSetupPage />
            </AuthGuard>
          } />
          
          {/* Dashboard routes - require authentication */}
          <Route path="/" element={
            <AuthGuard>
              <DashboardLayout />
            </AuthGuard>
          }>
            <Route index element={<Navigate to="/stories" replace />} />
            <Route path="stories" element={<StoriesPage />} />
            <Route path="prompts" element={<PromptsPage />} />
            <Route path="settings" element={<SettingsPage />} />
            <Route path="order" element={<OrderBookPage />} />
          </Route>

          {/* Catch all route - redirect to login */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    </QueryClientProvider>
  )
}

export default App