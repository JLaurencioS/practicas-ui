//import { useState } from 'react'

import { Routes, Route, Outlet } from 'react-router-dom'
import ProtectedRoute from './components/ProtectedRoute'
import Navbar from './components/Navbar'
import Login from './pages/Login'
import Home from './pages/Home'
import Weather from './pages/Weather'
import Movies from './pages/Movies'
import MovieDetail from './pages/MovieDetail'

function Layout() {
  return (
    <>
      <Navbar />
      <Outlet />
    </>
  )
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route element={<ProtectedRoute />}>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/clima" element={<Weather />} />
          <Route path="/peliculas" element={<Movies />} />
          <Route path="/peliculas/:id" element={<MovieDetail />} />
        </Route>
      </Route>
    </Routes>
  )
}