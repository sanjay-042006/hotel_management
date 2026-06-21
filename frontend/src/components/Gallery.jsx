import React from 'react';

const Gallery = () => {
  return (
    <section id="gallery" className="section" style={{ backgroundColor: '#fff' }}>
      <div className="container">
        <div className="section-title">
          <div className="section-subtitle">Gallery</div>
          <h2>Glimpses of ATLAS</h2>
          <p style={{ color: 'var(--text-light)', marginTop: '10px' }}>A visual journey through our spaces, crafted for moments worth remembering</p>
        </div>

        <div className="gallery-grid" style={{ marginTop: '40px' }}>
          <div className="gallery-item gallery-item-tall">
            <img src="https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=600&q=80" alt="Resort" />
          </div>
          <div className="gallery-item">
            <img src="https://imgs.search.brave.com/sbMAEu9FJ5BNjZBvM68z3Q5YXy4Ew6AmokXw8EWGtAI/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9tZWRp/YS5nZXR0eWltYWdl/cy5jb20vaWQvMjEx/NjU1Mjk3OS9waG90/by9wbGF5ZnVsLWV4/dGVuZGVkLWZhbWls/eS1oYXZpbmctZnVu/LWluLXRoZS1zd2lt/bWluZy1wb29sLmpw/Zz9zPTYxMng2MTIm/dz0wJms9MjAmYz16/N3ZjN1Q5Zm5fVnZm/QjB6UU0zMUxTVWEy/cVkxdTR3ZllOVDNR/ZDRVQTc0PQ" alt="Pool" />
          </div>
          <div className="gallery-item">
            <img src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=600&q=80" alt="Dining" />
          </div>
          <div className="gallery-item">
            <img src="https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?auto=format&fit=crop&w=600&q=80" alt="Lounge" />
          </div>
          <div className="gallery-item">
            <img src="https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=600&q=80" alt="Room" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Gallery;
