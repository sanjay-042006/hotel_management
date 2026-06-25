import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Payment = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const bookingData = location.state;

  const [loading, setLoading] = useState(false);

  if (!bookingData) {
    return <div style={{ padding: '100px', textAlign: 'center' }}>No booking data found. <a href="/">Go Home</a></div>;
  }

  const handlePayment = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate payment processing delay
    setTimeout(async () => {
      try {
        await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/bookings`, {
          room_type: bookingData.roomName,
          check_in: bookingData.checkIn,
          check_out: bookingData.checkOut,
          adults: bookingData.adults,
          children: bookingData.children,
          total_price: bookingData.totalPrice
        });
        alert('Payment successful! Your room is booked.');
        navigate('/booked-rooms');
      } catch (err) {
        if (err.response) {
          alert('Error: ' + (err.response.data.message || err.response.data.error || 'Failed to process payment'));
        } else {
          console.log("Backend not running, mock success");
          alert('Payment processed (Mock). Navigating to booked rooms.');
          navigate('/booked-rooms');
        }
      } finally {
        setLoading(false);
      }
    }, 1500);
  };

  return (
    <div style={{ backgroundColor: '#F8F9FA', minHeight: 'calc(100vh - 400px)', padding: '100px 0', display: 'flex', justifyContent: 'center' }}>
      <div style={{ backgroundColor: '#fff', padding: '40px', borderRadius: '8px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)', width: '100%', maxWidth: '500px' }}>
        <h2 style={{ marginBottom: '20px', fontFamily: 'Playfair Display', color: 'var(--primary)', textAlign: 'center' }}>Secure Payment</h2>
        
        <div style={{ backgroundColor: '#F0F4F8', padding: '15px', borderRadius: '4px', marginBottom: '30px', fontSize: '14px' }}>
          <strong>Booking Summary:</strong><br/>
          {bookingData.roomName}<br/>
          {bookingData.checkIn} to {bookingData.checkOut}<br/>
          <strong style={{ fontSize: '18px', color: 'var(--primary)', display: 'block', marginTop: '10px' }}>Amount to Pay: ${bookingData.totalPrice}</strong>
        </div>

        <form onSubmit={handlePayment}>
          <div className="form-group">
            <label>Name on Card</label>
            <input type="text" className="form-control" placeholder="John Doe" required />
          </div>
          <div className="form-group" style={{ marginTop: '15px' }}>
            <label>Card Number</label>
            <input type="text" className="form-control" placeholder="**** **** **** ****" required />
          </div>
          <div className="form-row" style={{ marginTop: '15px' }}>
            <div className="form-group">
              <label>Expiry Date</label>
              <input type="text" className="form-control" placeholder="MM/YY" required />
            </div>
            <div className="form-group">
              <label>CVC</label>
              <input type="text" className="form-control" placeholder="123" required />
            </div>
          </div>
          
          <button type="submit" className="btn btn-gold" style={{ width: '100%', marginTop: '30px', height: '50px', fontSize: '16px' }} disabled={loading}>
            {loading ? 'Processing...' : `Pay $${bookingData.totalPrice}`}
          </button>
          
          <div style={{ textAlign: 'center', marginTop: '15px', fontSize: '12px', color: 'var(--text-light)' }}>
            This is a demo payment gateway. No real charges will be made.
          </div>
        </form>
      </div>
    </div>
  );
};

export default Payment;
