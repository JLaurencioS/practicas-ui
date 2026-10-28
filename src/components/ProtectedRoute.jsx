import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function ProtectedRoute() {
  const { session, loading } = useAuth()
  if (loading) return <div className="loader" />
  return session ? <Outlet /> : <Navigate to="/login" replace />
}