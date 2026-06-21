import React from 'react';

const Amenities = () => {
  return (
    <section id="amenities" className="amenities-section">
      <div className="container">
        <div className="amenities-grid">
          <div className="amenity-card">
            <div className="amenity-icon">🏊‍♂️</div>
            <h4>Rooftop Pool</h4>
            <p>Infinity pool with panoramic city views, open 6 am – 10 pm</p>
          </div>
          <div className="amenity-card">
            <div className="amenity-icon">💆‍♀️</div>
            <h4>Spa & Wellness</h4>
            <p>Full-service spa with 12 treatment rooms and expert therapists</p>
          </div>
          <div className="amenity-card">
            <div className="amenity-icon">🍽️</div>
            <h4>Fine Dining</h4>
            <p>Award-winning restaurant serving contemporary cuisine all day</p>
          </div>
          <div className="amenity-card">
            <div className="amenity-icon">🏋️‍♂️</div>
            <h4>Fitness Center</h4>
            <p>State-of-the-art gym with personal trainers available</p>
          </div>
          <div className="amenity-card">
            <div className="amenity-icon">🎪</div>
            <h4>Event Spaces</h4>
            <p>8 versatile halls for weddings, conferences, and celebrations</p>
          </div>
          <div className="amenity-card">
            <div className="amenity-icon">💼</div>
            <h4>Business Center</h4>
            <p>24/7 business lounge with meeting rooms and video conferencing</p>
          </div>
          <div className="amenity-card">
            <div className="amenity-icon">🍸</div>
            <h4>Rooftop Bar</h4>
            <p>Signature cocktails and live music every Friday and Saturday</p>
          </div>
          <div className="amenity-card">
            <div className="amenity-icon">🚗</div>
            <h4>Valet Parking</h4>
            <p>Complimentary valet service and secure underground parking</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Amenities;
