import 'dotenv/config'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

const DEFAULT_CITIES = [
  'Celaya,MX', 'Guanajuato,MX', 'León,MX', 'Querétaro,MX', 'Ciudad de México,MX',
  'Guadalajara,MX', 'Monterrey,MX', 'Puebla,MX', 'Tijuana,MX', 'Cancún,MX',
  'Madrid,ES', 'Buenos Aires,AR', 'Bogotá,CO', 'New York,US', 'Tokyo,JP',
]

// Uso: npm run load:weather            -> carga la lista por defecto
//      npm run load:weather -- "Mérida,MX" "Lima,PE"  -> carga las ciudades indicadas
const cities = process.argv.length > 2 ? process.argv.slice(2) : DEFAULT_CITIES

async function loadCity(q) {
  const qs = new URLSearchParams({
    q,
    appid: process.env.OPENWEATHER_API_KEY,
    units: 'metric',
    lang: 'es',
  })
  const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?${qs}`)
  if (res.status === 404) throw new Error('ciudad no encontrada')
  if (!res.ok) throw new Error(`OpenWeather respondió ${res.status}`)
  const d = await res.json()

  const { error: cErr } = await supabase.from('cities').upsert({
    id: d.id,
    name: d.name,
    country: d.sys.country,
    lat: d.coord.lat,
    lon: d.coord.lon,
  })
  if (cErr) throw cErr

  const { error: rErr } = await supabase.from('weather_readings').upsert(
    {
      city_id: d.id,
      observed_at: new Date(d.dt * 1000).toISOString(),
      temp: d.main.temp,
      feels_like: d.main.feels_like,
      humidity: d.main.humidity,
      wind_speed: d.wind.speed,
      description: d.weather[0].description,
      icon: d.weather[0].icon,
    },
    { onConflict: 'city_id,observed_at' }
  )
  if (rErr) throw rErr
}

for (const city of cities) {
  try {
    await loadCity(city)
    console.log(`${city}`)
  } catch (e) {
    console.error(`err, ${city}: ${e.message}`)
  }
}