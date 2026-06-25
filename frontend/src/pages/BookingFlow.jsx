import React, { useState, useEffect, useContext } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const BookingFlow = () => {
  const { roomId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const searchParams = new URLSearchParams(location.search);
  
  const [room, setRoom] = useState(null);
  const [checkIn, setCheckIn] = useState(searchParams.get('check_in') || '');
  const [checkOut, setCheckOut] = useState(searchParams.get('check_out') || '');
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const [nights, setNights] = useState(0);

  useEffect(() => {
    if (!user) {
      alert("Please login to book a room");
      navigate('/login');
      return;
    }

    const fetchRoom = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/rooms`);
        const found = res.data.find(r => r.id.toString() === roomId);
        if (found) {
          setRoom(found);
          calculatePrice(found.price_per_night, checkIn, checkOut);
        }
      } catch (err) {
        console.log("Mock room fetch");
        // Mock fallback
        const mockRoom = { id: roomId, name: "Selected Room", price_per_night: 200 };
        setRoom(mockRoom);
        calculatePrice(mockRoom.price_per_night, checkIn, checkOut);
      }
    };
    fetchRoom();
    window.scrollTo(0, 0);
  }, [roomId, user]);

  const calculatePrice = (pricePerNight, start, end) => {
    if (start && end) {
      const startDate = new Date(start);
      const endDate = new Date(end);
      const diffTime = Math.abs(endDate - startDate);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
      
      if (diffDays > 0) {
        setNights(diffDays);
        setTotalPrice(diffDays * pricePerNight);
      } else {
        setNights(0);
        setTotalPrice(0);
      }
    }
  };

  const handleDateChange = (type, value) => {
    if (type === 'in') {
      setCheckIn(value);
      if (room) calculatePrice(room.price_per_night, value, checkOut);
    } else {
      setCheckOut(value);
      if (room) calculatePrice(room.price_per_night, checkIn, value);
    }
  };

  const handleProceed = (e) => {
    e.preventDefault();
    if (nights <= 0) {
      alert("Please select valid dates");
      return;
    }
    // Pass booking details to payment page
    navigate('/payment', {
      state: {
        roomId,
        roomName: room.name,
        checkIn,
        checkOut,
        adults,
        children,
        totalPrice,
        nights
      }
    });
  };

  if (!room) return <div style={{ padding: '100px', textAlign: 'center' }}>Loading...</div>;

  return (
    <div style={{ backgroundColor: '#F8F9FA', minHeight: 'calc(100vh - 400px)', padding: '100px 0', display: 'flex', justifyContent: 'center' }}>
      <div style={{ backgroundColor: '#fff', padding: '40px', borderRadius: '8px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)', width: '100%', maxWidth: '600px' }}>
        <h2 style={{ marginBottom: '10px', fontFamily: 'Playfair Display', color: 'var(--primary)' }}>Complete Your Booking</h2>
        <h4 style={{ marginBottom: '30px', color: 'var(--gold)' }}>{room.name}</h4>
        
        <form onSubmit={handleProceed}>
          <div className="form-row">
            <div className="form-group">
              <label>Check-in</label>
              <input type="date" className="form-control" min={new Date().toISOString().split('T')[0]} value={checkIn} onChange={e => handleDateChange('in', e.target.value)} required />
            </div>
            <div className="form-group">
              <label>Check-out</label>
              <input type="date" className="form-control" min={checkIn || new Date().toISOString().split('T')[0]} value={checkOut} onChange={e => handleDateChange('out', e.target.value)} required />
            </div>
          </div>
          
          <div className="form-row" style={{ marginTop: '15px' }}>
            <div className="form-group">
              <label>Adults</label>
              <input type="number" min="1" className="form-control" value={adults} onChange={e => setAdults(e.target.value)} required />
            </div>
            <div className="form-group">
              <label>Children</label>
              <input type="number" min="0" className="form-control" value={children} onChange={e => setChildren(e.target.value)} required />
            </div>
          </div>
          
          <div style={{ marginTop: '30px', padding: '20px', backgroundColor: '#F0F4F8', borderRadius: '4px' }}>
            <h4 style={{ marginBottom: '15px', fontFamily: 'Inter' }}>Price Summary</h4>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
              <span>${room.price_per_night} x {nights} nights</span>
              <span>${totalPrice}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', borderTop: '1px solid #ddd', paddingTop: '10px', marginTop: '10px', fontSize: '18px' }}>
              <span>Total</span>
              <span>${totalPrice}</span>
            </div>
          </div>
          
          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '30px', height: '50px', fontSize: '16px' }}>Proceed to Payment</button>
        </form>
      </div>
    </div>
  );
};

export default BookingFlow;
