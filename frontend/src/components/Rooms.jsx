import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { BedDouble, Wifi, Eye, Bath, Coffee, Tv, User, Search, Home, Check } from 'lucide-react';

const MOCK_ROOMS = [
  {
    id: 1,
    name: "Deluxe City View",
    description: "Spacious room with panoramic city views, king-size bed, and premium furnishings designed for ultimate rest.",
    price_per_night: 189,
    image_url: "/images/room1.webp",
    features: ["King Bed", "Free WiFi", "City View", "Bathtub"],
    total_quantity: 10
  },
  {
    id: 2,
    name: "Executive Suite",
    description: "A separate living area, work desk, and lounge — perfect for business travellers who demand both comfort and function.",
    price_per_night: 320,
    image_url: "/images/room2.webp",
    features: ["King Bed", "Kitchenette", "Lounge Area", "Smart TV"],
    total_quantity: 10
  },
  {
    id: 3,
    name: "Presidential Suite",
    description: "The pinnacle of ATLAS luxury — a full-floor suite with private terrace, butler service, and unmatched skyline views.",
    price_per_night: 890,
    image_url: "/images/room3.webp",
    features: ["2 Bedrooms", "Butler", "Skyline View", "Jacuzzi"],
    total_quantity: 10
  }
];

const featureIcons = {
  "King Bed": <BedDouble size={14} />,
  "Free WiFi": <Wifi size={14} />,
  "City View": <Eye size={14} />,
  "Bathtub": <Bath size={14} />,
  "Kitchenette": <Coffee size={14} />,
  "Lounge Area": <Home size={14} />,
  "Smart TV": <Tv size={14} />,
  "2 Bedrooms": <BedDouble size={14} />,
  "Butler": <User size={14} />,
  "Skyline View": <Eye size={14} />,
  "Jacuzzi": <Bath size={14} />
};

const Rooms = () => {
  const [rooms, setRooms] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/rooms');
        setRooms(res.data);
      } catch (err) {
        console.log("Backend not running, using mock data for rooms");
        setRooms(MOCK_ROOMS);
      }
    };
    fetchRooms();
  }, []);

  return (
    <section id="rooms" className="section" style={{ backgroundColor: '#F8F9FA' }}>
      <div className="container">
        <div className="section-title">
          <h2>Rooms & Suites</h2>
        </div>
        <div className="rooms-grid">
          {rooms.map(room => (
            <div className="room-card" key={room.id}>
              <div className="room-img" style={{ backgroundImage: `url(${room.image_url}), url('https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=600&q=80')` }}></div>
              <div className="room-details">
                <h3>{room.name}</h3>
                <p>{room.description}</p>
                <div className="room-features">
                  {room.features && room.features.map((f, idx) => (
                    <div key={idx} className="feature-badge">
                      {featureIcons[f] || <Check size={14} />} {f}
                    </div>
                  ))}
                </div>
                <div className="room-footer">
                  <div className="room-price">${room.price_per_night} <span>/ night</span></div>
                  <button className="btn btn-primary" onClick={() => navigate(`/book/${room.id}`)}>Book Now</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Rooms;
