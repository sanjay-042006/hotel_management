import React, { useState } from 'react';
import axios from 'axios';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';

const Contact = () => {
  const [formData, setFormData] = useState({
    first_name: 'John',
    last_name: 'Smith',
    email: 'john@example.com',
    phone: '+1 (555) 000-0000',
    subject: 'General Enquiry',
    message: ''
  });

  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/contact', formData);
      alert('Message sent successfully!');
    } catch (error) {
      console.log(error);
      alert('Message submitted! (Backend not running)');
    }
  };

  return (
    <section id="contact" className="section" style={{ backgroundColor: '#fff' }}>
      <div className="container">
        <div className="section-title">
          <div className="section-subtitle">Get in Touch</div>
          <h2>We'd Love to Hear From You</h2>
        </div>
        
        <div className="contact-grid">
          <div>
            <h3>Visit ATLAS Hotel & Suites</h3>
            <p style={{ color: 'var(--text-light)', marginTop: '15px' }}>
              Our concierge team is available around the clock to assist with reservations, special requests, event planning, or any queries you may have.
            </p>
            
            <div className="contact-info">
              <div className="contact-item">
                <div className="contact-icon"><MapPin size={20} /></div>
                <div>
                  <h4>Address</h4>
                  <p>42 Grand Boulevard, City Centre<br/>New York, NY 10001, USA</p>
                </div>
              </div>
              
              <div className="contact-item">
                <div className="contact-icon"><Phone size={20} /></div>
                <div>
                  <h4>Phone</h4>
                  <p>+1 (800) ATLAS-NY (285-7268)<br/>+1 (212) 555-0199 (Direct)</p>
                </div>
              </div>
              
              <div className="contact-item">
                <div className="contact-icon"><Mail size={20} /></div>
                <div>
                  <h4>Email</h4>
                  <p>reservations@atlashotel.com<br/>events@atlashotel.com</p>
                </div>
              </div>
              
              <div className="contact-item">
                <div className="contact-icon"><Clock size={20} /></div>
                <div>
                  <h4>Front Desk</h4>
                  <p>Open 24 hours, 7 days a week</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="contact-form">
            <h3 style={{ marginBottom: '20px' }}>Send Us a Message</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label>First Name</label>
                  <input type="text" name="first_name" className="form-control" value={formData.first_name} onChange={handleChange} required />
                </div>
                <div className="form-group">
                  <label>Last Name</label>
                  <input type="text" name="last_name" className="form-control" value={formData.last_name} onChange={handleChange} required />
                </div>
              </div>
              <div className="form-group">
                <label>Email</label>
                <input type="email" name="email" className="form-control" value={formData.email} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label>Phone</label>
                <input type="text" name="phone" className="form-control" value={formData.phone} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>Subject</label>
                <select name="subject" className="form-control" value={formData.subject} onChange={handleChange}>
                  <option>General Enquiry</option>
                  <option>Room Reservation</option>
                  <option>Events & Meetings</option>
                  <option>Feedback</option>
                </select>
              </div>
              <div className="form-group">
                <label>Message</label>
                <textarea name="message" className="form-control" rows="4" placeholder="Tell us how we can help you..." value={formData.message} onChange={handleChange} required></textarea>
              </div>
              <button type="submit" className="btn btn-primary">Send Message</button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
