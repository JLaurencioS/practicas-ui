import 'dotenv/config'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

const PAGES = Number(process.argv[2] ?? 10) // cuántas páginas cargar (20 películas c/u)

async function tmdb(path, params = {}) {
  const qs = new URLSearchParams({
    api_key: process.env.TMDB_API_KEY,
    language: 'es-MX',
    ...params,
  })
  const res = await fetch(`https://api.themoviedb.org/3${path}?${qs}`)
  if (!res.ok) throw new Error(`TMDb respondió ${res.status} en ${path}`)
  return res.json()
}

async function main() {
  // 1. Géneros
  const { genres } = await tmdb('/genre/movie/list')
  const { error: gErr } = await supabase.from('genres').upsert(genres)
  if (gErr) throw gErr
  const validGenres = new Set(genres.map((g) => g.id))
  console.log(`✔ ${genres.length} géneros`)

  // 2. Películas, página por página (paginación del API)
  for (let page = 1; page <= PAGES; page++) {
    try {
      const data = await tmdb('/movie/popular', { page })

      const movies = data.results.map((m) => ({
        id: m.id,
        title: m.title,
        original_title: m.original_title,
        overview: m.overview,
        poster_path: m.poster_path,
        backdrop_path: m.backdrop_path,
        release_date: m.release_date || null,
        vote_average: m.vote_average,
        popularity: m.popularity,
      }))

      const links = data.results.flatMap((m) =>
        m.genre_ids
          .filter((g) => validGenres.has(g))
          .map((g) => ({ movie_id: m.id, genre_id: g }))
      )

      const { error: mErr } = await supabase.from('movies').upsert(movies)
      if (mErr) throw mErr
      const { error: lErr } = await supabase
        .from('movie_genres')
        .upsert(links, { onConflict: 'movie_id,genre_id' })
      if (lErr) throw lErr

      console.log(`Página ${page}/${PAGES}: ${movies.length} películas`)
    } catch (e) {
      console.error(`Error en página ${page}:`, e.message)
    }
  }
  console.log('Carga terminada')
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})