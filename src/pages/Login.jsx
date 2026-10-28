import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const { session, signIn } = useAuth()
  if (session) return <Navigate to="/" replace />

  return (
    <div className="login">
      <div className="card login-card">
        <h1>Bienvenido</h1>
        <p>Inicia sesión para continuar</p>
        <button className="btn" onClick={() => signIn('github')}>Continuar con GitHub</button>
        {/* Para Google: signIn('google') (requiere activarlo en Supabase) */}
      </div>
    </div>
  )
}