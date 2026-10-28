import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'

const PAGE_SIZE = 20
const IMG = 'https://image.tmdb.org/t/p/w500'

export default function Movies() {
  const [input, setInput] = useState('')
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [movies, setMovies] = useState([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      setError('')
      const from = (page - 1) * PAGE_SIZE
      let q = supabase
        .from('movies')
        .select('id, title, poster_path, release_date', { count: 'exact' })
        .order('popularity', { ascending: false })
        .range(from, from + PAGE_SIZE - 1)
      if (search) q = q.ilike('title', `%${search}%`)

      const { data, count, error } = await q
      if (error) setError('No se pudieron cargar las películas.')
      else {
        setMovies(data)
        setTotal(count ?? 0)
      }
      setLoading(false)
    }
    load()
  }, [search, page])

  const onSubmit = (e) => {
    e.preventDefault()
    setPage(1)
    setSearch(input.trim())
  }

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE))

  return (
    <div className="page">
      <form onSubmit={onSubmit} className="searchbar">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Buscar película…"
        />
        <button className="btn">Buscar</button>
      </form>

      {loading && <div className="loader" />}
      {error && <div className="error">{error}</div>}
      {!loading && !error && movies.length === 0 && (
        <div className="error">Sin resultados.</div>
      )}

      <div className="movie-grid">
        {movies.map((m) => (
          <Link to={`/peliculas/${m.id}`} key={m.id} className="movie-card">
            {m.poster_path ? (
              <img src={IMG + m.poster_path} alt={m.title} loading="lazy" />
            ) : (
              <div className="no-poster">Sin póster</div>
            )}
            <div className="movie-info">
              <h4>{m.title}</h4>
              <span>{m.release_date?.slice(0, 4) ?? '—'}</span>
            </div>
          </Link>
        ))}
      </div>

      <div className="pagination">
        <button className="btn" disabled={page === 1} onClick={() => setPage(page - 1)}>← Anterior</button>
        <span>Página {page} de {totalPages}</span>
        <button className="btn" disabled={page >= totalPages} onClick={() => setPage(page + 1)}>Siguiente →</button>
      </div>
    </div>
  )
}