import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import Home from './pages/Home'
import BookedRooms from './pages/BookedRooms'
import Login from './pages/Login'
import Register from './pages/Register'
import Availability from './pages/Availability'
import BookingFlow from './pages/BookingFlow'
import Payment from './pages/Payment'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import AdminLogin from './pages/AdminLogin'
import AdminDashboard from './pages/AdminDashboard'

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/availability" element={<Availability />} />
          <Route path="/book/:roomId" element={<BookingFlow />} />
          <Route path="/payment" element={<Payment />} />
          <Route path="/booked-rooms" element={<BookedRooms />} />
          <Route path="/admin-login" element={<AdminLogin />} />
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
        </Routes>
        <Footer />
      </Router>
    </AuthProvider>
  )
}

export default App
