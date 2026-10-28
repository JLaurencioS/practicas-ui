import { Link } from 'react-router-dom' 

export default function Home() {
  return (
    <div className="home">
      <Link to="/clima" className="home-card weather-bg">
        <img src="../src/pages/weather-icon.png" alt="Weather Icon" />
        {/* <h2>Dashboard de Clima</h2> */}
      </Link>
      <Link to="/peliculas" className="home-card movies-bg">
        <img src="../src/pages/movies-icon.png" alt="Movies Icon"  />
        {/* <h2>Explorador de Películas</h2> */}
      </Link>
    </div>
  )
}