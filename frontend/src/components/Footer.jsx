import React from 'react';


const Footer = () => {
  return (
    <footer>
      <div className="footer-top">
        <div className="container">
          <h2>Stay in the Loop</h2>
          <p>Subscribe to receive exclusive offers, seasonal packages, and hotel news straight to your inbox.</p>
          <div className="subscribe-form">
            <input type="email" placeholder="Your email address" />
            <button className="btn btn-gold">Subscribe</button>
          </div>
        </div>
      </div>
      <div className="footer-main">
        <div className="container">
          <div className="footer-grid">
            <div>
              <div className="footer-logo">
                <div className="footer-logo-box">A</div>
                <div>
                  <div style={{ fontFamily: 'Playfair Display', fontSize: '20px', letterSpacing: '2px', fontWeight: 'bold' }}>ATLAS</div>
                  <div style={{ fontSize: '10px', letterSpacing: '2px', color: '#A0AEC0' }}>HOTEL & SUITES</div>
                </div>
              </div>
              <p>ATLAS Hotel & Suites has been setting the standard for luxury hospitality since 2006. We believe every guest deserves an extraordinary experience.</p>
              <div className="social-links">
                <a href="#" className="social-link">f</a>
                <a href="#" className="social-link">t</a>
                <a href="#" className="social-link">x</a>
                <a href="#" className="social-link">in</a>
              </div>
            </div>
            <div className="footer-links">
              <h4>QUICK LINKS</h4>
              <ul>
                <li><a href="#">Home</a></li>
                <li><a href="#about">About Us</a></li>
                <li><a href="#rooms">Rooms & Suites</a></li>
                <li><a href="#amenities">Amenities</a></li>
                <li><a href="#gallery">Gallery</a></li>
                <li><a href="#reviews">Guest Reviews</a></li>
              </ul>
            </div>
            <div className="footer-links">
              <h4>SERVICES</h4>
              <ul>
                <li><a href="#rooms">Room Reservation</a></li>
                <li><a href="#">Spa Booking</a></li>
                <li><a href="#">Fine Dining</a></li>
                <li><a href="#">Event Spaces</a></li>
                <li><a href="#">Business Center</a></li>
                <li><a href="#">Concierge</a></li>
              </ul>
            </div>
            <div className="footer-links">
              <h4>CONTACT</h4>
              <ul>
                <li style={{ color: '#A0AEC0', marginBottom: '15px' }}>
                  42 Grand Boulevard<br/>
                  City Centre, NY 10001<br/>
                  United States
                </li>
                <li style={{ color: '#A0AEC0' }}>
                  +1 (800) 285-7268<br/>
                  <a href="mailto:reservations@atlashotel.com">reservations@atlashotel.com</a>
                </li>
              </ul>
            </div>
          </div>
          <div className="footer-bottom">
            <div>© 2026 ATLAS Hotel & Suites. All rights reserved. Designed By MenThee Technologies Private Limited.</div>
            <div className="footer-bottom-links">
              <a href="#">Privacy Policy</a>
              <a href="#">Terms of Service</a>
              <a href="#">Cookie Policy</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
