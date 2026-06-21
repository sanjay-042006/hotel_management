import React, { useState, useEffect } from 'react';
import { Star } from 'lucide-react';
import axios from 'axios';

const Reviews = () => {
  const MOCK_REVIEWS = [
    {
      id: 1,
      name: "Sarah Jenkins",
      rating: 5,
      date_string: "October 2025",
      text: "Absolutely stunning experience from start to finish. The Presidential Suite exceeded all expectations and the staff was incredibly attentive to our every need. Will definitely return!"
    },
    {
      id: 2,
      name: "Michael Chen",
      rating: 5,
      date_string: "August 2025",
      text: "The fine dining restaurant is out of this world. We stayed in the Executive Suite for a business trip and found it perfectly equipped. The rooftop pool offers breathtaking views."
    },
    {
      id: 3,
      name: "Emma Thompson",
      rating: 4,
      date_string: "July 2025",
      text: "Beautiful property with exceptional amenities. The spa services were top-notch. Only giving 4 stars because the valet took a little longer than expected during peak hours, but overall a wonderful stay."
    }
  ];

  const [reviews, setReviews] = useState([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [newName, setNewName] = useState('');
  const [newRating, setNewRating] = useState(5);
  const [newText, setNewText] = useState('');

  const fetchReviews = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/reviews');
      setReviews(res.data);
    } catch (err) {
      console.log("Backend not running or error fetching reviews, using mock data");
      setReviews(MOCK_REVIEWS);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleSubmitReview = async () => {
    try {
      await axios.post('http://localhost:5000/api/reviews', {
        name: newName,
        rating: newRating,
        text: newText
      });
      setNewName('');
      setNewRating(5);
      setNewText('');
      setIsFormOpen(false);
      fetchReviews();
    } catch (err) {
      console.error("Error submitting review", err);
      alert("Failed to submit review.");
    }
  };

  return (
    <section id="reviews" className="section" style={{ backgroundColor: '#F8F9FA' }}>
      <div className="container">
        <div className="section-title">
          <div className="section-subtitle">Guest Reviews</div>
          <h2>What Our Guests Say</h2>
          <button className="btn btn-primary" style={{ marginTop: '20px' }} onClick={() => setIsFormOpen(!isFormOpen)}>
            {isFormOpen ? 'Cancel' : 'Write a Review'}
          </button>
        </div>

        {isFormOpen && (
          <div style={{ backgroundColor: 'white', padding: '30px', borderRadius: '8px', marginBottom: '40px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', maxWidth: '600px', margin: '0 auto 40px auto' }}>
            <h3 style={{ marginBottom: '20px', fontFamily: 'Inter' }}>Share Your Experience</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <input type="text" placeholder="Your Name" className="form-control" style={{ padding: '12px', border: '1px solid #ddd', borderRadius: '4px' }} value={newName} onChange={e => setNewName(e.target.value)} />
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontWeight: '500' }}>Rating:</span>
                <div style={{ display: 'flex', cursor: 'pointer' }}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star 
                      key={star} 
                      size={24} 
                      onClick={() => setNewRating(star)}
                      fill={star <= newRating ? 'var(--gold)' : 'none'} 
                      color={star <= newRating ? 'var(--gold)' : '#ccc'}
                      style={{ transition: 'all 0.2s' }}
                    />
                  ))}
                </div>
              </div>
              
              <textarea placeholder="Write your review here..." className="form-control" rows="4" style={{ padding: '12px', border: '1px solid #ddd', borderRadius: '4px', resize: 'vertical' }} value={newText} onChange={e => setNewText(e.target.value)}></textarea>
              
              <button className="btn btn-primary" onClick={handleSubmitReview} disabled={!newName || !newText} style={{ alignSelf: 'flex-start', opacity: (!newName || !newText) ? 0.5 : 1 }}>Submit Review</button>
            </div>
          </div>
        )}
        
        <div className="rooms-grid">
          {reviews.map(review => (
            <div className="room-card" key={review.id} style={{ padding: '30px' }}>
              <div style={{ display: 'flex', color: 'var(--gold)', marginBottom: '15px' }}>
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={18} fill={i < review.rating ? 'var(--gold)' : 'none'} />
                ))}
              </div>
              <p style={{ fontStyle: 'italic', marginBottom: '20px', color: 'var(--text-main)' }}>"{review.text}"</p>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #eee', paddingTop: '15px' }}>
                <h4 style={{ fontFamily: 'Inter', fontWeight: '600' }}>{review.name}</h4>
                <span style={{ fontSize: '12px', color: 'var(--text-light)' }}>{review.date_string || new Date(review.created_at).toLocaleDateString()}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Reviews;
