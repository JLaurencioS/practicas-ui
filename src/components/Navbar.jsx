import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
  const { user, signOut } = useAuth()
  return (
    <nav className="navbar">
      <Link to="/" className="brand">Prácticas</Link>
      <div className="nav-links">
        <Link to="/clima">Weather Map</Link>
        <Link to="/peliculas">TMDB</Link>
      </div>
      <div className="nav-user">
        <span>{user?.user_metadata?.user_name || user?.email}</span>
        <button onClick={signOut}>Salir</button>
      </div>
    </nav>
  )
}