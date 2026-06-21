import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="container">
        <Link to="/" className="navbar-logo">
          <div className="logo-box">A</div>
          <div>
            <div style={{ fontFamily: 'Playfair Display', fontSize: '20px', letterSpacing: '2px', fontWeight: 'bold' }}>ATLAS</div>
            <div style={{ fontSize: '10px', letterSpacing: '2px', color: '#A0AEC0' }}>HOTEL & SUITES</div>
          </div>
        </Link>
        <div className="navbar-links">
          <Link to="/">Home</Link>
          <a href="/#about">About</a>
          <a href="/#rooms">Rooms</a>
          <a href="/#amenities">Amenities</a>
          <a href="/#gallery">Gallery</a>
          <a href="/#reviews">Reviews</a>
          <a href="/#contact">Contact</a>
          {user ? (
            <>
              <Link to="/booked-rooms">My Bookings</Link>
              <span style={{ color: 'var(--gold)', fontWeight: 'bold' }}>Hi, {user.username}</span>
              <button onClick={handleLogout} className="btn" style={{ background: 'transparent', color: '#fff', border: '1px solid #fff', padding: '5px 10px' }}>Logout</button>
            </>
          ) : (
            <>
              <Link to="/login">Login</Link>
              <Link to="/register">Register</Link>
            </>
          )}
          <a href="/#rooms" className="btn btn-gold">Book Now</a>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
