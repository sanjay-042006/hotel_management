import React from 'react';
import { Check } from 'lucide-react';

const About = () => {
  return (
    <section id="about" className="section" style={{ backgroundColor: '#fff' }}>
      <div className="container">
        <div className="about-grid">
          <div className="about-img">
            <img src="/images/about.jpg" alt="ATLAS Hotel" onError={(e) => { e.target.src = 'https://as2.ftcdn.net/v2/jpg/07/18/13/51/1000_F_718135145_ryntaOBH3ohaTlV9H8LOoVMLrnGiqQfg.jpg' }} />
            <div className="about-badge">
              <h3>18</h3>
              <p>YEARS OF<br />EXCELLENCE</p>
            </div>
          </div>
          <div className="about-content">
            <div className="section-subtitle" style={{ justifyContent: 'flex-start' }}>About ATLAS</div>
            <h2>A Legacy of Luxury, A Promise of Perfection</h2>
            <p>Since 2006, ATLAS Hotel & Suites has been the preferred address for discerning travellers, business leaders, and celebrations that deserve nothing less than extraordinary. Nestled in the heart of the city, our 250-room property combines timeless elegance with modern conveniences.</p>
            <p>Our philosophy is simple: every guest is unique, and every stay should feel personal. From the moment you arrive to the moment you depart, our dedicated team ensures your experience exceeds every expectation.</p>

            <div className="about-features">
              <div className="about-feature"><Check size={16} /> Internationally trained staff</div>
              <div className="about-feature"><Check size={16} /> Michelin-starred restaurant</div>
              <div className="about-feature"><Check size={16} /> Sustainable luxury practices</div>
              <div className="about-feature"><Check size={16} /> Award-winning spa</div>
              <div className="about-feature"><Check size={16} /> ISO 9001 certified quality</div>
              <div className="about-feature"><Check size={16} /> Pet-friendly floors</div>
            </div>

            <button className="btn btn-gold">Get in Touch</button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
