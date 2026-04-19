import { Navigate, useLocation } from 'react-router-dom'
import { useUserAuthStore } from '@/store/userAuthStore'

interface ProtectedAppRouteProps {
  children: React.ReactNode
}

export function ProtectedAppRoute({ children }: ProtectedAppRouteProps) {
  const { isAuthenticated } = useUserAuthStore()
  const location = useLocation()

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return <>{children}</>
}
