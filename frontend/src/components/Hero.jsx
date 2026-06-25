import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Hero = () => {
  const [isWidgetOpen, setIsWidgetOpen] = useState(false);
  const [formData, setFormData] = useState({
    room_type: '',
    check_in: '',
    check_out: '',
    adults: 2,
    children: 0,
    promo_code: ''
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value});
  };

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/availability?check_in=${formData.check_in}&check_out=${formData.check_out}&room_type=${formData.room_type}`);
  };

  return (
    <section className="hero">
      <div className="container">
        <div className="hero-content">
          <div className="hero-subtitle">Five-Star Luxury</div>
          <h1>Where Every Stay<br/>Becomes a <span className="text-gold">Story</span></h1>
          <p>Experience unrivalled elegance at ATLAS Hotel & Suites — your sanctuary of refined comfort, exceptional dining, and world-class service in the heart of the city.</p>
          <div className="hero-buttons">
            <button onClick={() => setIsWidgetOpen(!isWidgetOpen)} className="btn btn-gold">
              {isWidgetOpen ? 'Close Reservation' : 'Check Availability'}
            </button>
            <a href="#about" className="btn btn-outline">Discover ATLAS</a>
          </div>
        </div>

        <div className={`booking-widget ${isWidgetOpen ? 'open' : ''}`}>
          <h3>Reserve Your Stay</h3>
          <form onSubmit={handleSearch}>
            <div className="form-group">
              <label>Room Type</label>
              <select name="room_type" className="form-control" onChange={handleChange} value={formData.room_type}>
                <option value="">Any Room Type</option>
                <option value="Deluxe City View">Deluxe City View</option>
                <option value="Executive Suite">Executive Suite</option>
                <option value="Presidential Suite">Presidential Suite</option>
              </select>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Check-in</label>
                <input type="date" name="check_in" className="form-control" min={new Date().toISOString().split('T')[0]} required onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>Check-out</label>
                <input type="date" name="check_out" className="form-control" min={formData.check_in || new Date().toISOString().split('T')[0]} required onChange={handleChange} />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Adults</label>
                <input type="number" name="adults" min="1" className="form-control" value={formData.adults} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>Children</label>
                <input type="number" name="children" min="0" className="form-control" value={formData.children} onChange={handleChange} />
              </div>
            </div>
            <div className="form-group">
              <label>Promo Code (Optional)</label>
              <input type="text" name="promo_code" className="form-control" onChange={handleChange} />
            </div>
            <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '10px' }}>Check Availability</button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Hero;
