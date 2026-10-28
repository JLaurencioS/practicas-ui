import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { supabase } from '../lib/supabase'

export default function MovieDetail() {
  const { id } = useParams()
  const [movie, setMovie] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    supabase
      .from('movies')
      .select('*, movie_genres(genres(name))')
      .eq('id', id)
      .single()
      .then(({ data, error }) => {
        if (error) setError('No se encontró la película.')
        else setMovie(data)
        setLoading(false)
      })
  }, [id])

  if (loading) return <div className="loader" />
  if (error) return <div className="page"><div className="error">{error}</div></div>

  const bg = movie.backdrop_path && `https://image.tmdb.org/t/p/w1280${movie.backdrop_path}`

  return (
    <div className="detail" style={{ backgroundImage: bg ? `linear-gradient(#000c,#000f), url(${bg})` : undefined }}>
      <Link to="/peliculas" className="back">← Volver</Link>
      <div className="detail-body">
        {movie.poster_path && <img src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} alt={movie.title} />}
        <div>
          <h1>{movie.title}</h1>
          <p className="meta">
            {movie.release_date?.slice(0, 4)} · ⭐ {movie.vote_average}
          </p>
          <div className="tags">
            {movie.movie_genres.map((g) => <span key={g.genres.name}>{g.genres.name}</span>)}
          </div>
          <p>{movie.overview || 'Sin descripción.'}</p>
        </div>
      </div>
    </div>
  )
}