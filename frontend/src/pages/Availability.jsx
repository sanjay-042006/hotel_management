import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Availability = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  
  const [checkIn, setCheckIn] = useState(searchParams.get('check_in') || '');
  const [checkOut, setCheckOut] = useState(searchParams.get('check_out') || '');
  const [roomType, setRoomType] = useState(searchParams.get('room_type') || '');
  
  const [availability, setAvailability] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchAvailability = async () => {
    if (!checkIn || !checkOut) return;
    setLoading(true);
    try {
      const res = await axios.post('http://localhost:5000/api/availability', { check_in: checkIn, check_out: checkOut, room_type: roomType });
      setAvailability(res.data);
    } catch (err) {
      console.log('Backend not running, using mock availability');
      // Mock data logic
      setAvailability([
        { room_id: 1, room_name: 'Deluxe City View', price_per_night: 189, available: 7, total_quantity: 10 },
        { room_id: 2, room_name: 'Executive Suite', price_per_night: 320, available: 10, total_quantity: 10 },
        { room_id: 3, room_name: 'Presidential Suite', price_per_night: 890, available: 2, total_quantity: 10 }
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (checkIn && checkOut) {
      fetchAvailability();
    }
    window.scrollTo(0, 0);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchAvailability();
  };

  return (
    <div style={{ backgroundColor: '#F8F9FA', minHeight: 'calc(100vh - 400px)', padding: '100px 0' }}>
      <div className="container">
        <div className="section-title">
          <h2>Check Availability</h2>
        </div>
        
        <div style={{ backgroundColor: '#fff', padding: '30px', borderRadius: '8px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)', marginBottom: '40px' }}>
          <form onSubmit={handleSearch} style={{ display: 'flex', gap: '20px', alignItems: 'flex-end' }}>
            <div className="form-group" style={{ flex: 1, marginBottom: 0 }}>
              <label>Check-in</label>
              <input type="date" className="form-control" value={checkIn} onChange={e => setCheckIn(e.target.value)} required />
            </div>
            <div className="form-group" style={{ flex: 1, marginBottom: 0 }}>
              <label>Check-out</label>
              <input type="date" className="form-control" value={checkOut} onChange={e => setCheckOut(e.target.value)} required />
            </div>
            <div className="form-group" style={{ flex: 1, marginBottom: 0 }}>
              <label>Room Type</label>
              <select className="form-control" value={roomType} onChange={e => setRoomType(e.target.value)}>
                <option value="">Any</option>
                <option value="Deluxe City View">Deluxe City View</option>
                <option value="Executive Suite">Executive Suite</option>
                <option value="Presidential Suite">Presidential Suite</option>
              </select>
            </div>
            <button type="submit" className="btn btn-primary" style={{ height: '42px' }}>Search</button>
          </form>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px' }}>Loading...</div>
        ) : availability.length > 0 ? (
          <div className="rooms-grid">
            {availability.map(room => {
              if (roomType && roomType !== 'Any' && room.room_name !== roomType) return null;
              
              return (
                <div className="room-card" key={room.room_id} style={{ padding: '30px' }}>
                  <h3 style={{ marginBottom: '10px' }}>{room.room_name}</h3>
                  <div style={{ fontSize: '24px', color: 'var(--primary)', fontFamily: 'Playfair Display', marginBottom: '20px' }}>
                    ${room.price_per_night} <span style={{ fontSize: '14px', fontFamily: 'Inter' }}>/ night</span>
                  </div>
                  
                  <div style={{ padding: '15px', backgroundColor: room.available > 0 ? '#E6F4EA' : '#FCE8E6', borderRadius: '4px', marginBottom: '20px' }}>
                    <strong style={{ color: room.available > 0 ? '#137333' : '#C5221F' }}>
                      {room.available} out of {room.total_quantity} rooms available
                    </strong>
                    <div style={{ fontSize: '12px', marginTop: '5px' }}>For dates: {checkIn} to {checkOut}</div>
                  </div>
                  
                  {room.available > 0 ? (
                    <button 
                      className="btn btn-gold" 
                      style={{ width: '100%' }}
                      onClick={() => navigate(`/book/${room.room_id}?check_in=${checkIn}&check_out=${checkOut}`)}
                    >
                      Select Room
                    </button>
                  ) : (
                    <button className="btn btn-outline" style={{ width: '100%', color: '#999', borderColor: '#ddd' }} disabled>
                      Sold Out
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '40px', backgroundColor: '#fff', borderRadius: '8px' }}>
            {checkIn ? 'No availability found.' : 'Please select dates to check availability.'}
          </div>
        )}
      </div>
    </div>
  );
};

export default Availability;
