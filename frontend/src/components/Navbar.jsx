import React, { useContext, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Menu, X } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Do not render navbar on admin routes
  if (location.pathname.startsWith('/admin')) {
    return null;
  }

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <nav className="navbar">
      <div className="container">
        <Link to="/" className="navbar-logo" onClick={closeMenu}>
          <div className="logo-box">A</div>
          <div>
            <div style={{ fontFamily: 'Playfair Display', fontSize: '20px', letterSpacing: '2px', fontWeight: 'bold' }}>ATLAS</div>
            <div style={{ fontSize: '10px', letterSpacing: '2px', color: '#A0AEC0' }}>HOTEL & SUITES</div>
          </div>
        </Link>
        
        <button className="mobile-menu-btn" onClick={toggleMenu} aria-label="Toggle Menu">
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        <div className={`navbar-links ${isMenuOpen ? 'active' : ''}`}>
          <Link to="/" onClick={closeMenu}>Home</Link>
          <a href="/#about" onClick={closeMenu}>About</a>
          <a href="/#rooms" onClick={closeMenu}>Rooms</a>
          <a href="/#amenities" onClick={closeMenu}>Amenities</a>
          <a href="/#gallery" onClick={closeMenu}>Gallery</a>
          <a href="/#reviews" onClick={closeMenu}>Reviews</a>
          <a href="/#contact" onClick={closeMenu}>Contact</a>
          {user ? (
            <>
              <Link to="/booked-rooms" onClick={closeMenu}>My Bookings</Link>
              <span className="user-greeting" style={{ color: 'var(--gold)', fontWeight: 'bold' }}>Hi, {user.username}</span>
              <button onClick={handleLogout} className="btn logout-btn" style={{ background: 'transparent', color: '#fff', border: '1px solid #fff', padding: '5px 10px' }}>Logout</button>
              <Link to="/admin-login" onClick={closeMenu}>Admin</Link>
            </>
          ) : (
            <>
              <Link to="/login" onClick={closeMenu}>Login</Link>
              <Link to="/register" onClick={closeMenu}>Register</Link>
              <Link to="/admin-login" onClick={closeMenu}>Admin</Link>
            </>
          )}
          <a href="/#rooms" className="btn btn-gold book-now-btn" onClick={closeMenu}>Book Now</a>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
