import { useState } from 'react'
import { supabase } from '../lib/supabase'

export default function Weather() {
  const [query, setQuery] = useState('')
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const search = async (e) => {
    e.preventDefault()
    if (!query.trim()) return
    setLoading(true)
    setError('')
    setData(null)

    const { data: city, error: err } = await supabase
      .from('cities')
      .select(
        'name, country, weather_readings(temp, feels_like, humidity, wind_speed, description, icon, observed_at)'
      )
      .ilike('name', `%${query.trim()}%`)
      .order('observed_at', { referencedTable: 'weather_readings', ascending: false })
      .limit(1, { referencedTable: 'weather_readings' })
      .limit(1)
      .maybeSingle()

    setLoading(false)
    if (err) return setError('Error al consultar la base de datos. Intenta de nuevo.')
    if (!city || !city.weather_readings.length)
      return setError(`No hay datos de "${query}". Cárgala con: npm run load:weather -- "${query},MX"`)
    setData({ ...city, ...city.weather_readings[0] })
  }

  return (
    <div className="page">
      <h1>Dashboard de Clima</h1>
      <form onSubmit={search} className="searchbar">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar ciudad…"
        />
        <button className="btn">Buscar</button>
      </form>

      {loading && <div className="loader" />}
      {error && <div className="error">{error}</div>}

      {data && (
        <>
          <h2 className="city-title">{data.name}, {data.country}</h2>
          <div className="weather-grid">
            <div className="card main-card">
              <img
                src={`https://openweathermap.org/img/wn/${data.icon}@4x.png`}
                alt={data.description}
              />
              <div className="temp">{Math.round(data.temp)}°C</div>
              <div className="desc">{data.description}</div>
            </div>
            <div className="card"><h3>Sensación</h3><p>{Math.round(data.feels_like)}°C</p>
              <img src="\temperature-half-solid-full.svg" alt="Sensación térmica"  />
            </div>
            <div className="card"><h3>Humedad</h3><p> {data.humidity}%</p>
              <img src="/droplet-solid-full.svg" alt="Humedad"  />  
            </div>
            <div className="card"><h3>Viento</h3><p> {data.wind_speed} m/s</p>
              <img src="/wind-solid-full.svg" alt="Viento"  />  
              
            </div>
          </div>
          <small>Última lectura: {new Date(data.observed_at).toLocaleString()}</small>
        </>
      )}
    </div>
  )
}