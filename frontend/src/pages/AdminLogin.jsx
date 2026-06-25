import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import '../admin.css';

const AdminLogin = () => {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(false);

    try {
      setIsLoading(true);
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const res = await axios.post(`${apiUrl}/api/auth/admin/login`, {
        username: formData.username,
        password: formData.password
      });

      // Save admin credentials
      localStorage.setItem('adminToken', res.data.token);
      localStorage.setItem('adminUsername', res.data.username);
      localStorage.setItem('adminRole', res.data.role || 'Super Admin');

      // Set default header for admin calls
      axios.defaults.headers.common['Authorization'] = `Bearer ${res.data.token}`;

      navigate('/admin-dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid admin credentials');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="admin-login-overlay" style={{
      backgroundImage: `linear-gradient(rgba(15, 32, 64, 0.8), rgba(15, 32, 64, 0.85)), url('https://images.unsplash.com/photo-1542314831-c6a4d14d8c85?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80')`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      fontFamily: 'Inter, sans-serif'
    }}>
      <div className="admin-login-card admin-modal" style={{
        backgroundColor: '#FFFFFF',
        borderRadius: '16px',
        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)',
        width: '100%',
        maxWidth: '480px',
        padding: '50px 40px',
        textAlign: 'center',
        position: 'relative'
      }}>
        <button 
          onClick={() => navigate('/')}
          style={{
            position: 'absolute',
            top: '20px',
            left: '20px',
            background: 'transparent',
            border: 'none',
            color: '#718096',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            cursor: 'pointer',
            fontSize: '13px',
            fontWeight: 600
          }}
        >
          <ChevronLeft size={16} /> Back
        </button>
        {/* Brand Logo */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '15px', marginBottom: '30px' }}>
          <div style={{
            backgroundColor: '#D4AF37',
            color: '#0F2040',
            width: '45px',
            height: '45px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            fontFamily: 'Playfair Display, serif',
            fontSize: '28px',
            fontWeight: 'bold',
            borderRadius: '4px'
          }}>A</div>
          <div style={{ textAlign: 'left' }}>
            <div style={{ fontFamily: 'Playfair Display, serif', fontSize: '24px', letterSpacing: '2px', fontWeight: 'bold', color: '#0F2040', lineHeight: 1 }}>ATLAS</div>
            <div style={{ fontSize: '10px', letterSpacing: '2px', color: '#718096', fontWeight: 600, marginTop: '2px' }}>HOTEL & SUITES</div>
          </div>
        </div>

        <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: '26px', color: '#0F2040', marginBottom: '8px', fontWeight: 'bold' }}>Admin Portal</h2>
        <p style={{ color: '#718096', fontSize: '14px', marginBottom: '35px' }}>Sign in to manage your property</p>

        {error && (
          <div style={{
            backgroundColor: '#FFF5F5',
            border: '1px solid #FED7D7',
            color: '#C53030',
            padding: '12px',
            borderRadius: '6px',
            fontSize: '14px',
            marginBottom: '20px',
            textAlign: 'center'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ textAlign: 'left' }}>
          <div className="form-group" style={{ marginBottom: '20px' }}>
            <label style={{
              display: 'block',
              fontSize: '11px',
              fontWeight: '700',
              color: '#4A5568',
              letterSpacing: '1px',
              textTransform: 'uppercase',
              marginBottom: '8px'
            }}>Username</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="e.g. admin"
              required
              style={{
                width: '100%',
                padding: '14px 16px',
                border: '1px solid #E2E8F0',
                borderRadius: '8px',
                fontSize: '15px',
                outline: 'none',
                transition: 'border-color 0.2s',
                fontFamily: 'inherit'
              }}
              onFocus={(e) => e.target.style.borderColor = '#1A365D'}
              onBlur={(e) => e.target.style.borderColor = '#E2E8F0'}
            />
          </div>

          <div className="form-group" style={{ marginBottom: '30px' }}>
            <label style={{
              display: 'block',
              fontSize: '11px',
              fontWeight: '700',
              color: '#4A5568',
              letterSpacing: '1px',
              textTransform: 'uppercase',
              marginBottom: '8px'
            }}>Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              required
              style={{
                width: '100%',
                padding: '14px 16px',
                border: '1px solid #E2E8F0',
                borderRadius: '8px',
                fontSize: '15px',
                outline: 'none',
                transition: 'border-color 0.2s',
                fontFamily: 'inherit'
              }}
              onFocus={(e) => e.target.style.borderColor = '#1A365D'}
              onBlur={(e) => e.target.style.borderColor = '#E2E8F0'}
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            style={{
              width: '100%',
              backgroundColor: '#1E40AF',
              color: '#FFFFFF',
              padding: '14px',
              border: 'none',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'background-color 0.2s',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}
            onMouseOver={(e) => e.target.style.backgroundColor = '#1E3A8A'}
            onMouseOut={(e) => e.target.style.backgroundColor = '#1E40AF'}
          >
            {isLoading ? 'Signing In...' : 'Sign In →'}
          </button>
        </form>

        <div style={{ marginTop: '40px', borderTop: '1px solid #EDF2F7', paddingTop: '20px' }}>
          <div style={{ fontSize: '11px', color: '#718096', fontWeight: 500 }}>ATLAS Hotel Management System v2.4.1</div>
          <div style={{ fontSize: '10px', color: '#A0AEC0', marginTop: '4px' }}>Powered By MenTee Technologies Private Limited</div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
