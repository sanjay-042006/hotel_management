import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { 
  Wifi, Waves, Flower, Dumbbell, Utensils, Car, Briefcase, Trash2, Edit, 
  Plus, Users, User, Calendar, CheckSquare, Settings, Star, AlertTriangle, 
  AlertCircle, LogOut, Check, X, Award, FileText, ChevronRight, RefreshCw, 
  BarChart2, DollarSign, Bed, CheckCircle, UserCheck, Shield, ChevronLeft,
  UserMinus
} from 'lucide-react';

const AdminDashboard = () => {
  const [currentTab, setCurrentTab] = useState('dashboard');
  const [adminUser, setAdminUser] = useState('');
  const [adminRole, setAdminRole] = useState('Super Admin');
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Data states for modules
  const [rooms, setRooms] = useState([]);
  const [roomTypes, setRoomTypes] = useState([]);
  const [amenities, setAmenities] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [waitlist, setWaitlist] = useState([]);
  const [guests, setGuests] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [todayCheckins, setTodayCheckins] = useState([]);
  const [todayCheckouts, setTodayCheckouts] = useState([]);

  // Active item for Edit/Create modals
  const [activeModal, setActiveModal] = useState(null); // 'add-room', 'edit-room', 'add-type', 'edit-type', 'add-amenity', 'edit-amenity', 'add-booking', 'edit-booking', 'check-in', 'check-out', 'edit-guest'
  const [selectedItem, setSelectedItem] = useState(null);
  const [modalForm, setModalForm] = useState({});

  // Sub-filters
  const [filters, setFilters] = useState({
    roomStatus: '',
    roomType: '',
    bookingStatus: '',
    bookingSearch: '',
    guestSearch: ''
  });

  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  // Check auth and load basic statistics
  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    const username = localStorage.getItem('adminUsername');
    const role = localStorage.getItem('adminRole');

    if (!token || !username) {
      navigate('/admin-login');
      return;
    }

    setAdminUser(username);
    if (role) setAdminRole(role);

    // Apply header
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

    fetchDashboardStats();
  }, [navigate]);

  // Refetch data when tab changes
  useEffect(() => {
    if (!localStorage.getItem('adminToken')) return;
    
    if (currentTab === 'dashboard') {
      fetchDashboardStats();
    } else if (currentTab === 'rooms') {
      fetchRooms();
      fetchRoomTypes();
    } else if (currentTab === 'room-types') {
      fetchRoomTypes();
    } else if (currentTab === 'amenities') {
      fetchAmenities();
    } else if (currentTab === 'reservations') {
      fetchBookings();
      fetchRoomTypes();
    } else if (currentTab === 'calendar') {
      fetchBookings();
      fetchRooms();
    } else if (currentTab === 'group-bookings') {
      fetchBookings();
    } else if (currentTab === 'waitlist') {
      fetchWaitlist();
      fetchRoomTypes();
    } else if (currentTab === 'guests') {
      fetchGuests();
    } else if (currentTab === 'loyalty') {
      fetchGuests();
    } else if (currentTab === 'feedback') {
      fetchReviews();
    } else if (currentTab === 'check-in') {
      fetchTodayCheckins();
    } else if (currentTab === 'check-out') {
      fetchTodayCheckouts();
    }
  }, [currentTab]);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${apiUrl}/api/admin/dashboard-stats`);
      setStats(res.data);
      setAlerts(res.data.alerts || []);
      setError('');
    } catch (err) {
      handleApiError(err, 'Failed to fetch dashboard stats');
    } finally {
      setLoading(false);
    }
  };

  const handleApiError = (err, defaultMsg) => {
    if (err.response?.status === 401 || err.response?.status === 403) {
      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminUsername');
      navigate('/admin-login');
    } else {
      setError(err.response?.data?.message || defaultMsg);
    }
  };

  // ----------------- API FETCHERS -----------------
  const fetchRooms = async () => {
    try {
      const res = await axios.get(`${apiUrl}/api/admin/rooms`);
      setRooms(res.data);
    } catch (err) { handleApiError(err, 'Failed to load rooms'); }
  };

  const fetchRoomTypes = async () => {
    try {
      const res = await axios.get(`${apiUrl}/api/admin/room-types`);
      setRoomTypes(res.data);
    } catch (err) { handleApiError(err, 'Failed to load room types'); }
  };

  const fetchAmenities = async () => {
    try {
      const res = await axios.get(`${apiUrl}/api/admin/amenities`);
      setAmenities(res.data);
    } catch (err) { handleApiError(err, 'Failed to load amenities'); }
  };

  const fetchBookings = async () => {
    try {
      const res = await axios.get(`${apiUrl}/api/admin/bookings`);
      setBookings(res.data);
    } catch (err) { handleApiError(err, 'Failed to load bookings'); }
  };

  const fetchWaitlist = async () => {
    try {
      const res = await axios.get(`${apiUrl}/api/admin/waitlist`);
      setWaitlist(res.data);
    } catch (err) { handleApiError(err, 'Failed to load waitlist'); }
  };

  const fetchGuests = async () => {
    try {
      const res = await axios.get(`${apiUrl}/api/admin/guests`);
      setGuests(res.data);
    } catch (err) { handleApiError(err, 'Failed to load guests'); }
  };

  const fetchReviews = async () => {
    try {
      const res = await axios.get(`${apiUrl}/api/admin/reviews`);
      setReviews(res.data);
    } catch (err) { handleApiError(err, 'Failed to load reviews'); }
  };

  const fetchTodayCheckins = async () => {
    try {
      const res = await axios.get(`${apiUrl}/api/admin/check-in/today`);
      setTodayCheckins(res.data);
    } catch (err) { handleApiError(err, 'Failed to load arrivals'); }
  };

  const fetchTodayCheckouts = async () => {
    try {
      const res = await axios.get(`${apiUrl}/api/admin/check-out/today`);
      setTodayCheckouts(res.data);
    } catch (err) { handleApiError(err, 'Failed to load departures'); }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUsername');
    localStorage.removeItem('adminRole');
    navigate('/admin-login');
  };

  // ----------------- CRUD SUBMISSIONS -----------------

  const handleCreateRoom = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${apiUrl}/api/admin/rooms`, modalForm);
      setActiveModal(null);
      fetchRooms();
    } catch (err) { alert(err.response?.data?.message || 'Error creating room'); }
  };

  const handleUpdateRoom = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`${apiUrl}/api/admin/rooms/${selectedItem.id}`, modalForm);
      setActiveModal(null);
      fetchRooms();
    } catch (err) { alert(err.response?.data?.message || 'Error updating room'); }
  };

  const handleDeleteRoom = async (id) => {
    if (!window.confirm('Are you sure you want to delete this physical room?')) return;
    try {
      await axios.delete(`${apiUrl}/api/admin/rooms/${id}`);
      fetchRooms();
    } catch (err) { alert(err.response?.data?.message || 'Error deleting room'); }
  };

  const handleCreateRoomType = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...modalForm,
        features: modalForm.features_string ? modalForm.features_string.split(',').map(f => f.trim()) : []
      };
      await axios.post(`${apiUrl}/api/admin/room-types`, payload);
      setActiveModal(null);
      fetchRoomTypes();
    } catch (err) { alert(err.response?.data?.message || 'Error creating room type'); }
  };

  const handleUpdateRoomType = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...modalForm,
        features: modalForm.features_string ? modalForm.features_string.split(',').map(f => f.trim()) : selectedItem.features
      };
      await axios.put(`${apiUrl}/api/admin/room-types/${selectedItem.id}`, payload);
      setActiveModal(null);
      fetchRoomTypes();
    } catch (err) { alert(err.response?.data?.message || 'Error updating room type'); }
  };

  const handleDeleteRoomType = async (id) => {
    if (!window.confirm('Delete this Room Type? All physical rooms tied to it will lose their type.')) return;
    try {
      await axios.delete(`${apiUrl}/api/admin/room-types/${id}`);
      fetchRoomTypes();
    } catch (err) { alert(err.response?.data?.message || 'Error deleting room type'); }
  };

  const handleCreateAmenity = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${apiUrl}/api/admin/amenities`, modalForm);
      setActiveModal(null);
      fetchAmenities();
    } catch (err) { alert(err.response?.data?.message || 'Error adding amenity'); }
  };

  const handleUpdateAmenity = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`${apiUrl}/api/admin/amenities/${selectedItem.id}`, modalForm);
      setActiveModal(null);
      fetchAmenities();
    } catch (err) { alert(err.response?.data?.message || 'Error updating amenity'); }
  };

  const handleDeleteAmenity = async (id) => {
    if (!window.confirm('Delete this amenity?')) return;
    try {
      await axios.delete(`${apiUrl}/api/admin/amenities/${id}`);
      fetchAmenities();
    } catch (err) { alert(err.response?.data?.message || 'Error deleting amenity'); }
  };

  const handleCreateBooking = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${apiUrl}/api/admin/bookings`, modalForm);
      setActiveModal(null);
      fetchBookings();
    } catch (err) { alert(err.response?.data?.message || 'Error creating booking'); }
  };

  const handleUpdateBooking = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`${apiUrl}/api/admin/bookings/${selectedItem.id}`, modalForm);
      setActiveModal(null);
      fetchBookings();
    } catch (err) { alert(err.response?.data?.message || 'Error updating booking'); }
  };

  const handleCancelBooking = async (id) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) return;
    try {
      await axios.delete(`${apiUrl}/api/admin/bookings/${id}`);
      fetchBookings();
    } catch (err) { alert(err.response?.data?.message || 'Error cancelling booking'); }
  };

  const handlePromoteWaitlist = async (id) => {
    try {
      const res = await axios.post(`${apiUrl}/api/admin/waitlist/${id}/promote`);
      alert(res.data.message);
      fetchWaitlist();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to promote waitlisted guest.');
    }
  };

  const handleDeleteWaitlist = async (id) => {
    if (!window.confirm('Remove guest from waitlist?')) return;
    try {
      await axios.delete(`${apiUrl}/api/admin/waitlist/${id}`);
      fetchWaitlist();
    } catch (err) { alert(err.response?.data?.message || 'Error removing waitlist entry'); }
  };

  const handleUpdateGuest = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`${apiUrl}/api/admin/guests/${selectedItem.id}`, modalForm);
      setActiveModal(null);
      fetchGuests();
    } catch (err) { alert(err.response?.data?.message || 'Error updating guest'); }
  };

  const handleReviewModerate = async (id, status) => {
    try {
      await axios.put(`${apiUrl}/api/admin/reviews/${id}`, { status });
      fetchReviews();
    } catch (err) { alert(err.response?.data?.message || 'Error moderating review'); }
  };

  const handleDeleteReview = async (id) => {
    if (!window.confirm('Delete this review?')) return;
    try {
      await axios.delete(`${apiUrl}/api/admin/reviews/${id}`);
      fetchReviews();
    } catch (err) { alert(err.response?.data?.message || 'Error deleting review'); }
  };

  const handleCheckInSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${apiUrl}/api/admin/check-in/process`, {
        booking_id: selectedItem.id,
        physical_room_id: modalForm.physical_room_id
      });
      setActiveModal(null);
      fetchTodayCheckins();
    } catch (err) { alert(err.response?.data?.message || 'Error completing check-in'); }
  };

  const handleCheckOutSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${apiUrl}/api/admin/check-out/process`, {
        booking_id: selectedItem.id,
        flag_maintenance: modalForm.flag_maintenance || false,
        maintenance_notes: modalForm.maintenance_notes || ''
      });
      setActiveModal(null);
      fetchTodayCheckouts();
    } catch (err) { alert(err.response?.data?.message || 'Error completing check-out'); }
  };

  const handleResolveAlert = async (id) => {
    try {
      await axios.put(`${apiUrl}/api/admin/alerts/${id}`, { status: 'resolved' });
      fetchDashboardStats();
    } catch (err) { alert('Failed to resolve alert'); }
  };

  // Helper to open CRUD Modals
  const openModal = (type, item = null) => {
    setSelectedItem(item);
    setActiveModal(type);
    if (type === 'add-room') {
      setModalForm({ room_number: '', room_type_id: roomTypes[0]?.id || '', status: 'Available', maintenance_notes: '' });
    } else if (type === 'edit-room' && item) {
      setModalForm({ room_number: item.room_number, room_type_id: item.room_type_id, status: item.status, maintenance_notes: item.maintenance_notes || '' });
    } else if (type === 'add-type') {
      setModalForm({ name: '', description: '', price_per_night: 150, total_quantity: 10, features_string: '', image_url: '/images/room1.webp' });
    } else if (type === 'edit-type' && item) {
      setModalForm({ name: item.name, description: item.description, price_per_night: item.price_per_night, total_quantity: item.total_quantity, features_string: item.features?.join(', ') || '', image_url: item.image_url });
    } else if (type === 'add-amenity') {
      setModalForm({ name: '', category: 'Wellness', icon_name: 'Wifi', description: '', status: 'Active' });
    } else if (type === 'edit-amenity' && item) {
      setModalForm({ name: item.name, category: item.category, icon_name: item.icon_name, description: item.description || '', status: item.status });
    } else if (type === 'add-booking') {
      setModalForm({ guest_name: '', guest_email: '', guest_phone: '', room_id: roomTypes[0]?.id || '', check_in: '', check_out: '', adults: 1, children: 0, total_price: 150, status: 'Confirmed', is_group: false, group_name: '', group_size: 1 });
    } else if (type === 'edit-booking' && item) {
      setModalForm({ room_id: item.room_id || '', check_in: item.check_in, check_out: item.check_out, adults: item.adults, children: item.children, total_price: item.total_price, status: item.status, is_group: item.is_group, group_name: item.group_name || '', group_size: item.group_size || 1 });
    } else if (type === 'edit-guest' && item) {
      setModalForm({ username: item.username, email: item.email, phone: item.phone || '', loyalty_points: item.loyalty_points, membership_tier: item.membership_tier });
    } else if (type === 'check-in' && item) {
      setModalForm({ physical_room_id: item.available_physical_rooms[0]?.id || '' });
    } else if (type === 'check-out' && item) {
      setModalForm({ flag_maintenance: false, maintenance_notes: '' });
    }
  };

  // ----------------- RENDER SUB-VIEWS -----------------

  const renderDashboard = () => {
    if (!stats) return <p style={{ color: '#fff' }}>Loading stats...</p>;
    
    // Revenue Trends Chart Geometry Math (SVG)
    const chartWidth = 550;
    const chartHeight = 220;
    const paddingLeft = 45;
    const paddingBottom = 25;
    const chartInnerWidth = chartWidth - paddingLeft;
    const chartInnerHeight = chartHeight - paddingBottom;
    
    const revenues = stats.revenue_trend?.map(t => t.revenue) || [0];
    const maxRevenue = Math.max(...revenues, 1000);
    
    const getX = (index) => paddingLeft + (index / 6) * (chartInnerWidth - 10);
    const getY = (value) => chartInnerHeight - (value / maxRevenue) * (chartInnerHeight - 20);

    // Build the SVG path string
    let pathD = '';
    let areaD = '';
    if (stats.revenue_trend?.length > 0) {
      pathD = `M ${getX(0)} ${getY(revenues[0])}`;
      areaD = `M ${getX(0)} ${chartInnerHeight} L ${getX(0)} ${getY(revenues[0])}`;
      for (let i = 1; i < stats.revenue_trend.length; i++) {
        pathD += ` L ${getX(i)} ${getY(revenues[i])}`;
        areaD += ` L ${getX(i)} ${getY(revenues[i])}`;
      }
      areaD += ` L ${getX(stats.revenue_trend.length - 1)} ${chartInnerHeight} Z`;
    }

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
        {/* Alerts Banner */}
        {alerts.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {alerts.map((alert) => (
              <div key={alert.id} style={{
                backgroundColor: alert.type === 'maintenance' ? '#FFFBEB' : '#EFF6FF',
                borderLeft: `5px solid ${alert.type === 'maintenance' ? '#D97706' : '#2563EB'}`,
                padding: '15px 20px',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  {alert.type === 'maintenance' ? (
                    <AlertTriangle size={20} color="#D97706" />
                  ) : (
                    <AlertCircle size={20} color="#2563EB" />
                  )}
                  <span style={{ fontSize: '14px', fontWeight: 500, color: '#1F2937' }}>{alert.message}</span>
                </div>
                <button onClick={() => handleResolveAlert(alert.id)} style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#4B5563',
                  cursor: 'pointer',
                  fontSize: '13px',
                  fontWeight: 600
                }}>Dismiss</button>
              </div>
            ))}
          </div>
        )}

        {/* KPI Cards Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '20px'
        }}>
          {/* Card 1 */}
          <div className="kpi-card" style={kpiCardStyle}>
            <div style={kpiHeaderStyle}>
              <span style={{ fontSize: '13px', color: '#718096', fontWeight: 600 }}>TODAY'S CHECK-INS</span>
              <div style={{ ...iconContainerStyle, backgroundColor: '#E0F2FE' }}>
                <UserCheck size={18} color="#0284C7" />
              </div>
            </div>
            <div style={{ fontSize: '28px', fontWeight: '700', color: '#1A202C', margin: '10px 0' }}>{stats.checkins_today}</div>
            <div style={{ fontSize: '12px', color: '#48BB78', fontWeight: 600 }}>+3 from yesterday</div>
          </div>
          {/* Card 2 */}
          <div className="kpi-card" style={kpiCardStyle}>
            <div style={kpiHeaderStyle}>
              <span style={{ fontSize: '13px', color: '#718096', fontWeight: 600 }}>TODAY'S CHECK-OUTS</span>
              <div style={{ ...iconContainerStyle, backgroundColor: '#FEE2E2' }}>
                <UserMinus size={18} color="#DC2626" />
              </div>
            </div>
            <div style={{ fontSize: '28px', fontWeight: '700', color: '#1A202C', margin: '10px 0' }}>{stats.checkouts_today}</div>
            <div style={{ fontSize: '12px', color: '#DC2626', fontWeight: 600 }}>-1 from yesterday</div>
          </div>
          {/* Card 3 */}
          <div className="kpi-card" style={kpiCardStyle}>
            <div style={kpiHeaderStyle}>
              <span style={{ fontSize: '13px', color: '#718096', fontWeight: 600 }}>OCCUPANCY RATE</span>
              <div style={{ ...iconContainerStyle, backgroundColor: '#ECFDF5' }}>
                <Bed size={18} color="#059669" />
              </div>
            </div>
            <div style={{ fontSize: '28px', fontWeight: '700', color: '#1A202C', margin: '10px 0' }}>{stats.occupancy_rate}%</div>
            <div style={{ fontSize: '12px', color: '#48BB78', fontWeight: 600 }}>{stats.occupied_rooms} of {stats.total_rooms} rooms</div>
          </div>
          {/* Card 4 */}
          <div className="kpi-card" style={kpiCardStyle}>
            <div style={kpiHeaderStyle}>
              <span style={{ fontSize: '13px', color: '#718096', fontWeight: 600 }}>TODAY'S REVENUE</span>
              <div style={{ ...iconContainerStyle, backgroundColor: '#FEF3C7' }}>
                <DollarSign size={18} color="#D97706" />
              </div>
            </div>
            <div style={{ fontSize: '28px', fontWeight: '700', color: '#1A202C', margin: '10px 0' }}>${stats.revenue_today.toLocaleString()}</div>
            <div style={{ fontSize: '12px', color: '#48BB78', fontWeight: 600 }}>+12% vs last Tue</div>
          </div>
        </div>

        {/* Charts & Status Breakdown Section */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1.5fr 1fr',
          gap: '30px',
          alignItems: 'start'
        }}>
          {/* Revenue Chart */}
          <div style={widgetPanelStyle}>
            <h3 style={widgetTitleStyle}>Revenue Trend</h3>
            <p style={{ fontSize: '12px', color: '#718096', marginBottom: '15px' }}>Check-in booking revenue over past 7 days</p>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <svg width={chartWidth} height={chartHeight}>
                {/* Horizontal gridlines */}
                {[0, 0.25, 0.5, 0.75, 1].map((ratio, index) => {
                  const yVal = chartInnerHeight - ratio * (chartInnerHeight - 20);
                  const displayVal = Math.round(ratio * maxRevenue);
                  return (
                    <g key={index}>
                      <line x1={paddingLeft} y1={yVal} x2={chartWidth - 10} y2={yVal} stroke="#EDF2F7" strokeDasharray="3,3" />
                      <text x={paddingLeft - 8} y={yVal + 4} textAnchor="end" fontSize="10" fill="#718096">${displayVal}</text>
                    </g>
                  );
                })}
                
                {/* Graph Areas */}
                {pathD && (
                  <>
                    <path d={areaD} fill="url(#revGrad)" />
                    <path d={pathD} fill="none" stroke="#3B82F6" strokeWidth="3.5" strokeLinecap="round" />
                    
                    {/* Graph Dots */}
                    {stats.revenue_trend.map((t, i) => (
                      <circle key={i} cx={getX(i)} cy={getY(t.revenue)} r="5" fill="#3B82F6" stroke="#FFFFFF" strokeWidth="2" />
                    ))}
                  </>
                )}

                {/* X axis labels */}
                {stats.revenue_trend?.map((t, i) => (
                  <text key={i} x={getX(i)} y={chartHeight - 6} textAnchor="middle" fontSize="10" fill="#718096">{t.date}</text>
                ))}

                {/* Gradient Definition */}
                <defs>
                  <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.3"/>
                    <stop offset="100%" stopColor="#3B82F6" stopOpacity="0.0"/>
                  </linearGradient>
                </defs>
              </svg>
            </div>
          </div>

          {/* Room Status breakdown progress bars */}
          <div style={widgetPanelStyle}>
            <h3 style={widgetTitleStyle}>Room Status Overview</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '15px' }}>
              {/* Occupied */}
              {renderStatusProgressBar('Occupied', stats.occupied_rooms, stats.total_rooms, '#2563EB')}
              {/* Available */}
              {renderStatusProgressBar('Available', stats.available_rooms, stats.total_rooms, '#059669')}
              {/* Reserved */}
              {renderStatusProgressBar('Reserved', stats.reserved_rooms, stats.total_rooms, '#8B5CF6')}
              {/* Maintenance */}
              {renderStatusProgressBar('Maintenance', stats.maintenance_rooms, stats.total_rooms, '#D97706')}
              {/* Out of Service */}
              {renderStatusProgressBar('Out of Service', stats.out_of_service_rooms, stats.total_rooms, '#DC2626')}
            </div>
          </div>
        </div>

        {/* Upcoming Reservations table */}
        <div style={widgetPanelStyle}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
            <h3 style={widgetTitleStyle}>Upcoming Reservations</h3>
            <button onClick={() => setCurrentTab('reservations')} style={{
              background: '#0F2040',
              color: '#fff',
              border: 'none',
              padding: '6px 12px',
              borderRadius: '4px',
              fontSize: '12px',
              fontWeight: 600,
              cursor: 'pointer'
            }}>View All</button>
          </div>
          
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #EDF2F7', textAlign: 'left' }}>
                  <th style={thStyle}>Guest</th>
                  <th style={thStyle}>Room Type</th>
                  <th style={thStyle}>Arrival</th>
                  <th style={thStyle}>Departure</th>
                  <th style={thStyle}>Status</th>
                </tr>
              </thead>
              <tbody>
                {stats.upcoming_reservations?.map((res) => (
                  <tr key={res.id} style={{ borderBottom: '1px solid #EDF2F7' }}>
                    <td style={tdStyle}>{res.guest_name}</td>
                    <td style={tdStyle}>{res.room_name}</td>
                    <td style={tdStyle}>{res.check_in}</td>
                    <td style={tdStyle}>{res.check_out}</td>
                    <td style={tdStyle}>
                      <span style={{
                        ...badgeStyle,
                        backgroundColor: res.status === 'Paid' || res.status === 'Confirmed' ? '#ECFDF5' : '#FEF3C7',
                        color: res.status === 'Paid' || res.status === 'Confirmed' ? '#059669' : '#D97706'
                      }}>{res.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  const renderStatusProgressBar = (label, value, total, color) => {
    const percentage = total > 0 ? Math.round((value / total) * 100) : 0;
    return (
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '4px' }}>
          <span style={{ fontWeight: 600, color: '#4A5568' }}>{label}</span>
          <span style={{ color: '#718096' }}>{value} ({percentage}%)</span>
        </div>
        <div style={{ width: '100%', height: '8px', backgroundColor: '#EDF2F7', borderRadius: '4px', overflow: 'hidden' }}>
          <div style={{ width: `${percentage}%`, height: '100%', backgroundColor: color, borderRadius: '4px' }} />
        </div>
      </div>
    );
  };

  // ----------------- ROOMS MODULE -----------------
  const renderRoomManagement = () => {
    const filteredRooms = rooms.filter(r => {
      const typeMatch = !filters.roomType || r.room_type_id === parseInt(filters.roomType);
      const statusMatch = !filters.roomStatus || r.status === filters.roomStatus;
      return typeMatch && statusMatch;
    });

    return (
      <div style={widgetPanelStyle}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: '24px', color: '#0F2040' }}>Room Management</h2>
          <button onClick={() => openModal('add-room')} style={btnGoldStyle}>
            <Plus size={16} /> Add Room
          </button>
        </div>

        {/* Filters bar */}
        <div style={{ display: 'flex', gap: '15px', marginBottom: '20px', flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: '150px' }}>
            <label style={filterLabelStyle}>Room Type</label>
            <select 
              value={filters.roomType} 
              onChange={(e) => setFilters({...filters, roomType: e.target.value})}
              style={formSelectStyle}
            >
              <option value="">All Types</option>
              {roomTypes.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
            </select>
          </div>
          <div style={{ flex: 1, minWidth: '150px' }}>
            <label style={filterLabelStyle}>Status</label>
            <select 
              value={filters.roomStatus} 
              onChange={(e) => setFilters({...filters, roomStatus: e.target.value})}
              style={formSelectStyle}
            >
              <option value="">All Statuses</option>
              <option value="Available">Available</option>
              <option value="Occupied">Occupied</option>
              <option value="Reserved">Reserved</option>
              <option value="Maintenance">Maintenance</option>
              <option value="Out of Service">Out of Service</option>
            </select>
          </div>
        </div>

        {/* Rooms Table */}
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #EDF2F7', textAlign: 'left' }}>
                <th style={thStyle}>Room Number</th>
                <th style={thStyle}>Room Type</th>
                <th style={thStyle}>Status</th>
                <th style={thStyle}>Maintenance Notes</th>
                <th style={thStyle}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredRooms.map(room => (
                <tr key={room.id} style={{ borderBottom: '1px solid #EDF2F7' }}>
                  <td style={{ ...tdStyle, fontWeight: 'bold', color: '#0F2040' }}>Room {room.room_number}</td>
                  <td style={tdStyle}>{room.room_type_name}</td>
                  <td style={tdStyle}>
                    <span style={{
                      ...badgeStyle,
                      ...getRoomStatusBadgeStyle(room.status)
                    }}>{room.status}</span>
                  </td>
                  <td style={{ ...tdStyle, fontSize: '13px', fontStyle: 'italic' }}>{room.maintenance_notes || '—'}</td>
                  <td style={tdStyle}>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button onClick={() => openModal('edit-room', room)} style={actionIconBtnStyle} title="Edit Room">
                        <Edit size={14} color="#4A5568" />
                      </button>
                      <button onClick={() => handleDeleteRoom(room.id)} style={{ ...actionIconBtnStyle, backgroundColor: '#FEE2E2' }} title="Delete Room">
                        <Trash2 size={14} color="#E53E3E" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  const getRoomStatusBadgeStyle = (status) => {
    switch(status) {
      case 'Available': return { backgroundColor: '#ECFDF5', color: '#059669' };
      case 'Occupied': return { backgroundColor: '#EFF6FF', color: '#2563EB' };
      case 'Reserved': return { backgroundColor: '#F5F3FF', color: '#7C3AED' };
      case 'Maintenance': return { backgroundColor: '#FFFBEB', color: '#D97706' };
      case 'Out of Service': return { backgroundColor: '#FEF2F2', color: '#DC2626' };
      default: return { backgroundColor: '#F3F4F6', color: '#374151' };
    }
  };

  // ----------------- ROOM TYPES MODULE -----------------
  const renderRoomTypes = () => {
    return (
      <div style={widgetPanelStyle}>
        <div style={{ display: 'flex', justifycontent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: '24px', color: '#0F2040' }}>Room Types Setup</h2>
          <button onClick={() => openModal('add-type')} style={btnGoldStyle}>
            <Plus size={16} /> Add Type
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
          {roomTypes.map(t => (
            <div key={t.id} style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '12px',
              border: '1px solid #E2E8F0',
              overflow: 'hidden',
              boxShadow: '0 4px 6px rgba(0,0,0,0.02)',
              display: 'flex',
              flexDirection: 'column'
            }}>
              <div style={{ height: '160px', backgroundImage: `url(${t.image_url})`, backgroundSize: 'cover', backgroundPosition: 'center', position: 'relative' }}>
                <div style={{ position: 'absolute', bottom: '15px', right: '15px', backgroundColor: 'rgba(15, 32, 64, 0.95)', color: '#D4AF37', padding: '6px 12px', borderRadius: '4px', fontFamily: 'Playfair Display', fontSize: '18px', fontWeight: 'bold' }}>
                  ${t.price_per_night}<span>/night</span>
                </div>
              </div>
              
              <div style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                <h3 style={{ fontSize: '20px', marginBottom: '10px', color: '#0F2040' }}>{t.name}</h3>
                <p style={{ fontSize: '13px', color: '#718096', marginBottom: '15px', height: '60px', overflow: 'hidden' }}>{t.description}</p>
                
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '20px' }}>
                  {t.features?.map((f, i) => (
                    <span key={i} style={{ backgroundColor: '#F7FAFC', color: '#4A5568', fontSize: '11px', padding: '4px 8px', borderRadius: '4px', border: '1px solid #EDF2F7' }}>{f}</span>
                  ))}
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto', borderTop: '1px solid #EDF2F7', paddingTop: '15px' }}>
                  <span style={{ fontSize: '12px', color: '#718096' }}>Total Allocated Capacity: <strong>{t.total_quantity} Rooms</strong></span>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button onClick={() => openModal('edit-type', t)} style={actionIconBtnStyle}>
                      <Edit size={14} color="#4A5568" />
                    </button>
                    <button onClick={() => handleDeleteRoomType(t.id)} style={{ ...actionIconBtnStyle, backgroundColor: '#FEE2E2' }}>
                      <Trash2 size={14} color="#E53E3E" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // ----------------- AMENITIES MODULE -----------------
  const renderAmenities = () => {
    const getAmenityIcon = (iconName) => {
      switch (iconName) {
        case 'Wifi': return <Wifi size={24} color="#D4AF37" />;
        case 'Waves': return <Waves size={24} color="#D4AF37" />;
        case 'Flower': return <Flower size={24} color="#D4AF37" />;
        case 'Dumbbell': return <Dumbbell size={24} color="#D4AF37" />;
        case 'Utensils': return <Utensils size={24} color="#D4AF37" />;
        case 'Car': return <Car size={24} color="#D4AF37" />;
        case 'Briefcase': return <Briefcase size={24} color="#D4AF37" />;
        default: return <Settings size={24} color="#D4AF37" />;
      }
    };

    return (
      <div style={widgetPanelStyle}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: '24px', color: '#0F2040' }}>Amenities Directory</h2>
          <button onClick={() => openModal('add-amenity')} style={btnGoldStyle}>
            <Plus size={16} /> Add Amenity
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
          {amenities.map(a => (
            <div key={a.id} style={{
              backgroundColor: '#0F2040',
              color: '#fff',
              borderRadius: '12px',
              padding: '25px',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: '0 6px 15px rgba(15, 32, 64, 0.1)',
              position: 'relative'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '15px' }}>
                <div style={{ backgroundColor: 'rgba(255,255,255,0.08)', padding: '12px', borderRadius: '8px' }}>
                  {getAmenityIcon(a.icon_name)}
                </div>
                <span style={{
                  fontSize: '11px',
                  fontWeight: '700',
                  padding: '3px 8px',
                  borderRadius: '20px',
                  backgroundColor: a.status === 'Active' ? 'rgba(52, 211, 153, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                  color: a.status === 'Active' ? '#34D399' : '#F87171'
                }}>{a.status}</span>
              </div>
              
              <h3 style={{ fontSize: '18px', color: '#fff', marginBottom: '5px', fontFamily: 'Inter, sans-serif', fontWeight: 600 }}>{a.name}</h3>
              <span style={{ fontSize: '11px', color: '#D4AF37', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '12px', fontWeight: 600 }}>{a.category}</span>
              <p style={{ fontSize: '12px', color: '#A0AEC0', lineHeight: 1.5, marginBottom: '20px', flex: 1 }}>{a.description}</p>
              
              <div style={{ display: 'flex', gap: '8px', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '15px', justifyContent: 'flex-end' }}>
                <button onClick={() => openModal('edit-amenity', a)} style={{ ...actionIconBtnStyle, backgroundColor: 'rgba(255,255,255,0.08)' }}>
                  <Edit size={14} color="#FFF" />
                </button>
                <button onClick={() => handleDeleteAmenity(a.id)} style={{ ...actionIconBtnStyle, backgroundColor: 'rgba(239, 68, 68, 0.15)' }}>
                  <Trash2 size={14} color="#EF4444" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // ----------------- RESERVATIONS MODULE -----------------
  const renderReservations = () => {
    const filteredBookings = bookings.filter(b => {
      const statusMatch = !filters.bookingStatus || b.status === filters.bookingStatus;
      const searchMatch = !filters.bookingSearch || 
        b.guest_name.toLowerCase().includes(filters.bookingSearch.toLowerCase()) ||
        b.room_name.toLowerCase().includes(filters.bookingSearch.toLowerCase()) ||
        (b.room_number && b.room_number.includes(filters.bookingSearch));
      return statusMatch && searchMatch;
    });

    return (
      <div style={widgetPanelStyle}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: '24px', color: '#0F2040' }}>Reservations Records</h2>
          <button onClick={() => openModal('add-booking')} style={btnGoldStyle}>
            <Plus size={16} /> New Booking
          </button>
        </div>

        {/* Filter Toolbar */}
        <div style={{ display: 'flex', gap: '15px', marginBottom: '25px', flexWrap: 'wrap' }}>
          <div style={{ flex: 2, minWidth: '200px' }}>
            <label style={filterLabelStyle}>Search Reservations</label>
            <input 
              type="text" 
              placeholder="Search guest name, room type, or number..." 
              value={filters.bookingSearch}
              onChange={(e) => setFilters({...filters, bookingSearch: e.target.value})}
              style={formInputStyle}
            />
          </div>
          <div style={{ flex: 1, minWidth: '150px' }}>
            <label style={filterLabelStyle}>Status Filter</label>
            <select 
              value={filters.bookingStatus} 
              onChange={(e) => setFilters({...filters, bookingStatus: e.target.value})}
              style={formSelectStyle}
            >
              <option value="">All Statuses</option>
              <option value="Paid">Paid</option>
              <option value="Confirmed">Confirmed</option>
              <option value="Pending">Pending</option>
              <option value="Checked In">Checked In</option>
              <option value="Checked Out">Checked Out</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        {/* Reservations Table */}
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #EDF2F7', textAlign: 'left' }}>
                <th style={thStyle}>Guest Details</th>
                <th style={thStyle}>Room Assignment</th>
                <th style={thStyle}>Dates</th>
                <th style={thStyle}>Type</th>
                <th style={thStyle}>Price</th>
                <th style={thStyle}>Status</th>
                <th style={thStyle}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredBookings.map(b => (
                <tr key={b.id} style={{ borderBottom: '1px solid #EDF2F7' }}>
                  <td style={tdStyle}>
                    <div style={{ fontWeight: 600, color: '#0F2040' }}>{b.guest_name}</div>
                    <div style={{ fontSize: '11px', color: '#718096' }}>{b.guest_email} | {b.guest_phone || 'No phone'}</div>
                  </td>
                  <td style={tdStyle}>
                    <div style={{ fontWeight: 500 }}>{b.room_name}</div>
                    <span style={{ fontSize: '12px', color: '#4A5568' }}>Physical Room: {b.room_number || 'Unassigned'}</span>
                  </td>
                  <td style={tdStyle}>
                    <div style={{ fontSize: '13px' }}><strong>In:</strong> {b.check_in}</div>
                    <div style={{ fontSize: '13px' }}><strong>Out:</strong> {b.check_out}</div>
                  </td>
                  <td style={tdStyle}>
                    {b.is_group ? (
                      <span style={{ ...badgeStyle, backgroundColor: '#E0F2FE', color: '#0369A1' }}>Group ({b.group_size})</span>
                    ) : (
                      <span style={{ ...badgeStyle, backgroundColor: '#F3F4F6', color: '#374151' }}>Individual</span>
                    )}
                  </td>
                  <td style={{ ...tdStyle, fontWeight: 'bold', color: '#0F2040' }}>${b.total_price.toLocaleString()}</td>
                  <td style={tdStyle}>
                    <span style={{
                      ...badgeStyle,
                      ...getBookingStatusBadgeStyle(b.status)
                    }}>{b.status}</span>
                  </td>
                  <td style={tdStyle}>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button onClick={() => openModal('edit-booking', b)} style={actionIconBtnStyle}>
                        <Edit size={14} color="#4A5568" />
                      </button>
                      {b.status !== 'Cancelled' && (
                        <button onClick={() => handleCancelBooking(b.id)} style={{ ...actionIconBtnStyle, backgroundColor: '#FEF2F2' }} title="Cancel Booking">
                          <X size={14} color="#DC2626" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  const getBookingStatusBadgeStyle = (status) => {
    switch (status) {
      case 'Paid': return { backgroundColor: '#ECFDF5', color: '#059669' };
      case 'Confirmed': return { backgroundColor: '#EFF6FF', color: '#2563EB' };
      case 'Pending': return { backgroundColor: '#FFFBEB', color: '#D97706' };
      case 'Checked In': return { backgroundColor: '#F5F3FF', color: '#7C3AED' };
      case 'Checked Out': return { backgroundColor: '#F3F4F6', color: '#4B5563' };
      case 'Cancelled': return { backgroundColor: '#FEF2F2', color: '#DC2626' };
      default: return { backgroundColor: '#F3F4F6', color: '#374151' };
    }
  };

  // ----------------- BOOKING CALENDAR -----------------
  const renderBookingCalendar = () => {
    // Generate dates grid: e.g. 7 days starting from today
    const dates = [];
    const baseDate = new Date(2026, 5, 23); // 23 June 2026
    for (let i = 0; i < 7; i++) {
      const d = new Date(baseDate);
      d.setDate(baseDate.getDate() + i);
      dates.push(d);
    }

    return (
      <div style={widgetPanelStyle}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: '24px', color: '#0F2040' }}>Room Allocation Matrix</h2>
          <div style={{ fontSize: '13px', color: '#718096', display: 'flex', gap: '15px' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><div style={{ width: '12px', height: '12px', backgroundColor: '#EFF6FF', border: '1px solid #3B82F6', borderRadius: '2px' }}></div> Booked</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><div style={{ width: '12px', height: '12px', backgroundColor: '#FDF2F8', border: '1px solid #DB2777', borderRadius: '2px' }}></div> Checked In</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><div style={{ width: '12px', height: '12px', backgroundColor: '#FFFBEB', border: '1px solid #D97706', borderRadius: '2px' }}></div> Maintenance</span>
          </div>
        </div>

        {/* Matrix Grid */}
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '800px' }}>
            <thead>
              <tr style={{ backgroundColor: '#F8F9FA' }}>
                <th style={{ ...thStyle, border: '1px solid #E2E8F0', width: '150px' }}>Room</th>
                {dates.map((d, index) => (
                  <th key={index} style={{ ...thStyle, border: '1px solid #E2E8F0', textAlign: 'center', padding: '12px' }}>
                    <div style={{ fontSize: '11px', textTransform: 'uppercase', color: '#718096' }}>{d.toLocaleDateString('en-US', { weekday: 'short' })}</div>
                    <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#0F2040' }}>{d.getDate()} {d.toLocaleDateString('en-US', { month: 'short' })}</div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rooms.map(room => (
                <tr key={room.id}>
                  <td style={{ ...tdStyle, border: '1px solid #E2E8F0', fontWeight: 'bold', color: '#0F2040' }}>
                    Room {room.room_number}
                    <div style={{ fontSize: '10px', color: '#718096', fontWeight: 'normal' }}>{room.room_type_name.split(' ')[0]}</div>
                  </td>
                  {dates.map((date, dateIdx) => {
                    const dateStr = date.toISOString().split('T')[0];
                    
                    // Look for booking for this physical room overlapping this day
                    const activeBooking = bookings.find(b => 
                      b.physical_room_id === room.id && 
                      b.check_in <= dateStr && 
                      b.check_out > dateStr &&
                      b.status !== 'Cancelled'
                    );

                    // Check if room itself is in maintenance
                    const inMaintenance = room.status === 'Maintenance' || room.status === 'Out of Service';

                    return (
                      <td key={dateIdx} style={{
                        border: '1px solid #E2E8F0',
                        padding: '8px',
                        height: '60px',
                        textAlign: 'center',
                        position: 'relative',
                        backgroundColor: inMaintenance ? '#FEF3C7' : activeBooking ? (activeBooking.status === 'Checked In' ? '#FDF2F8' : '#EFF6FF') : '#FFFFFF'
                      }}>
                        {inMaintenance ? (
                          <div style={{ fontSize: '11px', color: '#B45309', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '3px' }}>
                            <AlertTriangle size={12} /> Blocked
                          </div>
                        ) : activeBooking ? (
                          <div style={{
                            fontSize: '11px',
                            fontWeight: 600,
                            color: activeBooking.status === 'Checked In' ? '#BE185D' : '#1D4ED8',
                            lineHeight: 1.2
                          }}>
                            {activeBooking.guest_name}
                            <div style={{ fontSize: '9px', fontWeight: 'normal', color: '#4B5563' }}>
                              Status: {activeBooking.status}
                            </div>
                          </div>
                        ) : (
                          <button 
                            onClick={() => openModal('add-booking', { physical_room_id: room.id, check_in: dateStr })}
                            style={{
                              background: 'transparent',
                              border: 'none',
                              color: '#CBD5E0',
                              cursor: 'pointer',
                              width: '100%',
                              height: '100%',
                              fontSize: '11px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontWeight: 500
                            }}
                            onMouseOver={(e) => e.target.style.color = '#D4AF37'}
                            onMouseOut={(e) => e.target.style.color = '#CBD5E0'}
                          >
                            + Allocate
                          </button>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  // ----------------- GROUP BOOKINGS MODULE -----------------
  const renderGroupBookings = () => {
    const groupBookingsList = bookings.filter(b => b.is_group);
    return (
      <div style={widgetPanelStyle}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: '24px', color: '#0F2040' }}>Group Bookings Directory</h2>
          <button onClick={() => openModal('add-booking')} style={btnGoldStyle}>
            <Plus size={16} /> Create Group Booking
          </button>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #EDF2F7', textAlign: 'left' }}>
                <th style={thStyle}>Group Name</th>
                <th style={thStyle}>Group Leader</th>
                <th style={thStyle}>Group Size</th>
                <th style={thStyle}>Room Type / Assigned Number</th>
                <th style={thStyle}>Stay Duration</th>
                <th style={thStyle}>Billing Total</th>
                <th style={thStyle}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {groupBookingsList.map(b => (
                <tr key={b.id} style={{ borderBottom: '1px solid #EDF2F7' }}>
                  <td style={{ ...tdStyle, fontWeight: 'bold', color: '#1E3A8A' }}>{b.group_name}</td>
                  <td style={tdStyle}>{b.guest_name}</td>
                  <td style={tdStyle}>
                    <span style={{ ...badgeStyle, backgroundColor: '#DBEAFE', color: '#1E40AF', fontWeight: 'bold' }}>{b.group_size} Guests</span>
                  </td>
                  <td style={tdStyle}>
                    <div>{b.room_name}</div>
                    <span style={{ fontSize: '12px', color: '#718096' }}>Room {b.room_number || 'Unassigned'}</span>
                  </td>
                  <td style={tdStyle}>{b.check_in} to {b.check_out}</td>
                  <td style={{ ...tdStyle, fontWeight: 'bold' }}>${b.total_price.toLocaleString()}</td>
                  <td style={tdStyle}>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button onClick={() => openModal('edit-booking', b)} style={actionIconBtnStyle}>
                        <Edit size={14} color="#4A5568" />
                      </button>
                      <button onClick={() => handleCancelBooking(b.id)} style={{ ...actionIconBtnStyle, backgroundColor: '#FEE2E2' }}>
                        <X size={14} color="#DC2626" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  // ----------------- WAITLIST MODULE -----------------
  const renderWaitlist = () => {
    return (
      <div style={widgetPanelStyle}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: '24px', color: '#0F2040' }}>Waitlist Queue</h2>
          <div style={{ fontSize: '13px', color: '#718096' }}>Queue represents guests waiting for room cancellations</div>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #EDF2F7', textAlign: 'left' }}>
                <th style={thStyle}>Guest Details</th>
                <th style={thStyle}>Requested Room Type</th>
                <th style={thStyle}>Proposed Dates</th>
                <th style={thStyle}>Queue Registered At</th>
                <th style={thStyle}>Status</th>
                <th style={thStyle}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {waitlist.map(w => (
                <tr key={w.id} style={{ borderBottom: '1px solid #EDF2F7' }}>
                  <td style={tdStyle}>
                    <div style={{ fontWeight: 600, color: '#0F2040' }}>{w.guest_name}</div>
                    <div style={{ fontSize: '11px', color: '#718096' }}>{w.email} | {w.phone || 'No phone'}</div>
                  </td>
                  <td style={tdStyle}>{w.room_type_name}</td>
                  <td style={tdStyle}>
                    <div><strong>Check In:</strong> {w.check_in}</div>
                    <div><strong>Check Out:</strong> {w.check_out}</div>
                  </td>
                  <td style={tdStyle}>{new Date(w.created_at).toLocaleDateString()}</td>
                  <td style={tdStyle}>
                    <span style={{
                      ...badgeStyle,
                      backgroundColor: w.status === 'Confirmed' ? '#ECFDF5' : '#FEF3C7',
                      color: w.status === 'Confirmed' ? '#059669' : '#D97706'
                    }}>{w.status}</span>
                  </td>
                  <td style={tdStyle}>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      {w.status === 'Waitlisted' && (
                        <button onClick={() => handlePromoteWaitlist(w.id)} style={{
                          ...btnGoldStyle,
                          padding: '6px 12px',
                          fontSize: '12px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px'
                        }} title="Promote to Booking">
                          <CheckCircle size={13} /> Promote
                        </button>
                      )}
                      <button onClick={() => handleDeleteWaitlist(w.id)} style={{ ...actionIconBtnStyle, backgroundColor: '#FEE2E2' }} title="Remove Entry">
                        <Trash2 size={14} color="#E53E3E" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  // ----------------- GUEST PROFILES MODULE -----------------
  const renderGuestProfiles = () => {
    const filteredGuests = guests.filter(g => 
      g.username.toLowerCase().includes(filters.guestSearch.toLowerCase()) ||
      g.email.toLowerCase().includes(filters.guestSearch.toLowerCase())
    );

    return (
      <div style={widgetPanelStyle}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: '24px', color: '#0F2040' }}>Guest Directory</h2>
          <div style={{ width: '300px' }}>
            <input 
              type="text" 
              placeholder="Search by name or email..." 
              value={filters.guestSearch}
              onChange={(e) => setFilters({...filters, guestSearch: e.target.value})}
              style={formInputStyle}
            />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
          {filteredGuests.map(g => (
            <div key={g.id} style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '12px',
              border: '1px solid #E2E8F0',
              padding: '20px',
              boxShadow: '0 4px 6px rgba(0,0,0,0.02)',
              display: 'flex',
              flexDirection: 'column',
              gap: '15px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                <div>
                  <h3 style={{ fontSize: '18px', color: '#0F2040', marginBottom: '3px' }}>{g.username}</h3>
                  <span style={{ fontSize: '12px', color: '#718096' }}>{g.email} | {g.phone || 'No Phone'}</span>
                </div>
                <span style={{
                  ...badgeStyle,
                  backgroundColor: g.membership_tier === 'Platinum' ? '#F5F3FF' : g.membership_tier === 'Gold' ? '#FEF3C7' : '#F3F4F6',
                  color: g.membership_tier === 'Platinum' ? '#7C3AED' : g.membership_tier === 'Gold' ? '#D97706' : '#4B5563',
                  fontWeight: 'bold',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}>
                  <Award size={12} /> {g.membership_tier}
                </span>
              </div>

              <div style={{ borderTop: '1px solid #EDF2F7', borderBottom: '1px solid #EDF2F7', padding: '10px 0', display: 'flex', justifyContent: 'space-around' }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '11px', color: '#718096', textTransform: 'uppercase' }}>Loyalty Points</div>
                  <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#0F2040' }}>{g.loyalty_points}</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '11px', color: '#718096', textTransform: 'uppercase' }}>Bookings</div>
                  <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#0F2040' }}>{g.bookings_count}</div>
                </div>
              </div>

              <div>
                <h4 style={{ fontSize: '12px', fontWeight: '700', color: '#4A5568', textTransform: 'uppercase', marginBottom: '8px' }}>Booking History</h4>
                {g.booking_history?.length > 0 ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', maxHeight: '100px', overflowY: 'auto' }}>
                    {g.booking_history.map(b => (
                      <div key={b.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#4A5568' }}>
                        <span>{b.room_name} ({b.check_in})</span>
                        <strong style={{ color: b.status === 'Cancelled' ? '#EF4444' : '#10B981' }}>{b.status}</strong>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div style={{ fontSize: '12px', color: '#A0AEC0', fontStyle: 'italic' }}>No reservations logged.</div>
                )}
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 'auto' }}>
                <button onClick={() => openModal('edit-guest', g)} style={{ ...btnOutlineStyle, color: '#0F2040', borderColor: '#0F2040', fontSize: '12px', padding: '6px 12px' }}>
                  Edit Profile / Points
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // ----------------- LOYALTY PROGRAM MODULE -----------------
  const renderLoyaltyProgram = () => {
    // Math to compute loyalty distribution breakdown (SVG segment bar or pie chart)
    const silverCount = guests.filter(g => g.membership_tier === 'Silver').length;
    const goldCount = guests.filter(g => g.membership_tier === 'Gold').length;
    const platCount = guests.filter(g => g.membership_tier === 'Platinum').length;
    const totalGuests = guests.length || 1;

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
        {/* Tier Info Widgets */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
          {/* Silver Card */}
          <div style={{ ...kpiCardStyle, borderTop: '4px solid #94A3B8' }}>
            <h3 style={{ fontSize: '16px', color: '#475569', display: 'flex', alignItems: 'center', gap: '8px' }}><Award size={18} color="#94A3B8" /> Silver Membership</h3>
            <div style={{ fontSize: '26px', fontWeight: 'bold', margin: '10px 0', color: '#0F2040' }}>{silverCount} Guests</div>
            <p style={{ fontSize: '12px', color: '#718096' }}>Base tier. Awarded 10% points value on booking checkout. Standard room assignments.</p>
          </div>
          {/* Gold Card */}
          <div style={{ ...kpiCardStyle, borderTop: '4px solid #D4AF37' }}>
            <h3 style={{ fontSize: '16px', color: '#B45309', display: 'flex', alignItems: 'center', gap: '8px' }}><Award size={18} color="#D4AF37" /> Gold Membership</h3>
            <div style={{ fontSize: '26px', fontWeight: 'bold', margin: '10px 0', color: '#0F2040' }}>{goldCount} Guests</div>
            <p style={{ fontSize: '12px', color: '#718096' }}>Unlocks at 500 points. Complimentary spa vouchers, late check-out, and upgrade priority.</p>
          </div>
          {/* Platinum Card */}
          <div style={{ ...kpiCardStyle, borderTop: '4px solid #8B5CF6' }}>
            <h3 style={{ fontSize: '16px', color: '#6D28D9', display: 'flex', alignItems: 'center', gap: '8px' }}><Award size={18} color="#8B5CF6" /> Platinum Membership</h3>
            <div style={{ fontSize: '26px', fontWeight: 'bold', margin: '10px 0', color: '#0F2040' }}>{platCount} Guests</div>
            <p style={{ fontSize: '12px', color: '#718096' }}>Unlocks at 1000 points. butler access, lounge access, free room upgrades, and express check-in.</p>
          </div>
        </div>

        {/* Member distribution SVG Pie Chart */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1.2fr 2fr',
          gap: '30px'
        }}>
          <div style={widgetPanelStyle}>
            <h3 style={widgetTitleStyle}>Tier Distribution</h3>
            <div style={{ display: 'flex', justifyContent: 'center', margin: '20px 0' }}>
              {/* SVG Segment Bar Graph representation */}
              <svg width="200" height="200" viewBox="0 0 42 42" className="donut">
                <circle className="donut-hole" cx="21" cy="21" r="15.91549430918954" fill="#fff"></circle>
                <circle className="donut-ring" cx="21" cy="21" r="15.91549430918954" fill="transparent" stroke="#E2E8F0" strokeWidth="3"></circle>
                
                {/* Silver */}
                <circle className="donut-segment" cx="21" cy="21" r="15.91549430918954" fill="transparent" 
                  stroke="#94A3B8" strokeWidth="5.5" 
                  strokeDasharray={`${(silverCount/totalGuests)*100} ${100 - (silverCount/totalGuests)*100}`} 
                  strokeDashoffset="25">
                </circle>
                {/* Gold */}
                <circle className="donut-segment" cx="21" cy="21" r="15.91549430918954" fill="transparent" 
                  stroke="#D4AF37" strokeWidth="5.5" 
                  strokeDasharray={`${(goldCount/totalGuests)*100} ${100 - (goldCount/totalGuests)*100}`} 
                  strokeDashoffset={25 - (silverCount/totalGuests)*100}>
                </circle>
                {/* Platinum */}
                <circle className="donut-segment" cx="21" cy="21" r="15.91549430918954" fill="transparent" 
                  stroke="#8B5CF6" strokeWidth="5.5" 
                  strokeDasharray={`${(platCount/totalGuests)*100} ${100 - (platCount/totalGuests)*100}`} 
                  strokeDashoffset={25 - ((silverCount + goldCount)/totalGuests)*100}>
                </circle>
              </svg>
            </div>
            
            {/* Chart Legend */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#94A3B8' }} /> Silver</span>
                <strong>{Math.round(silverCount/totalGuests*100)}%</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#D4AF37' }} /> Gold</span>
                <strong>{Math.round(goldCount/totalGuests*100)}%</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#8B5CF6' }} /> Platinum</span>
                <strong>{Math.round(platCount/totalGuests*100)}%</strong>
              </div>
            </div>
          </div>

          {/* Loyalty Registry Table */}
          <div style={widgetPanelStyle}>
            <h3 style={widgetTitleStyle}>Active Loyalty Standings</h3>
            <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '15px' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #EDF2F7', textAlign: 'left' }}>
                  <th style={thStyle}>Guest</th>
                  <th style={thStyle}>Current Tier</th>
                  <th style={thStyle}>Total Points Balance</th>
                  <th style={thStyle}>Registration Date</th>
                </tr>
              </thead>
              <tbody>
                {guests.map(g => (
                  <tr key={g.id} style={{ borderBottom: '1px solid #EDF2F7' }}>
                    <td style={{ ...tdStyle, fontWeight: 600 }}>{g.username}</td>
                    <td style={tdStyle}>
                      <span style={{
                        ...badgeStyle,
                        backgroundColor: g.membership_tier === 'Platinum' ? '#F5F3FF' : g.membership_tier === 'Gold' ? '#FEF3C7' : '#F3F4F6',
                        color: g.membership_tier === 'Platinum' ? '#7C3AED' : g.membership_tier === 'Gold' ? '#D97706' : '#4B5563',
                      }}>{g.membership_tier}</span>
                    </td>
                    <td style={{ ...tdStyle, fontWeight: 'bold' }}>{g.loyalty_points.toLocaleString()} pts</td>
                    <td style={tdStyle}>{new Date(g.created_at).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  // ----------------- FEEDBACK & REVIEWS MODULE -----------------
  const renderFeedback = () => {
    const approvedReviews = reviews.filter(r => r.status === 'Approved');
    const avgRating = approvedReviews.length > 0 
      ? round(approvedReviews.reduce((sum, r) => sum + r.rating, 0) / approvedReviews.length, 1)
      : 5.0;

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
        {/* Rating Widgets */}
        <div style={widgetPanelStyle}>
          <h3 style={widgetTitleStyle}>Customer Satisfaction</h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: '30px', margin: '20px 0' }}>
            <div style={{ textAlign: 'center', backgroundColor: '#F8F9FA', padding: '25px', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
              <div style={{ fontSize: '48px', fontWeight: 'bold', color: '#0F2040', fontFamily: 'Playfair Display' }}>{avgRating}</div>
              <div style={{ display: 'flex', gap: '3px', justifyContent: 'center', margin: '8px 0' }}>
                {[1, 2, 3, 4, 5].map(star => (
                  <Star key={star} size={16} fill={star <= Math.round(avgRating) ? '#D4AF37' : 'none'} color="#D4AF37" />
                ))}
              </div>
              <span style={{ fontSize: '11px', color: '#718096' }}>Based on {approvedReviews.length} approved reviews</span>
            </div>
            
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {[5, 4, 3, 2, 1].map(stars => {
                const count = approvedReviews.filter(r => r.rating === stars).length;
                const percentage = approvedReviews.length > 0 ? (count / approvedReviews.length) * 100 : 0;
                return (
                  <div key={stars} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px' }}>
                    <span style={{ width: '40px', fontWeight: 600 }}>{stars} Stars</span>
                    <div style={{ flex: 1, height: '6px', backgroundColor: '#EDF2F7', borderRadius: '3px', overflow: 'hidden' }}>
                      <div style={{ width: `${percentage}%`, height: '100%', backgroundColor: '#D4AF37', borderRadius: '3px' }} />
                    </div>
                    <span style={{ width: '30px', textAlign: 'right', color: '#718096' }}>{count}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Reviews Moderation Table */}
        <div style={widgetPanelStyle}>
          <h3 style={widgetTitleStyle}>Reviews Moderation Database</h3>
          <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '15px' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #EDF2F7', textAlign: 'left' }}>
                <th style={thStyle}>Author</th>
                <th style={thStyle}>Rating</th>
                <th style={thStyle}>Review Details</th>
                <th style={thStyle}>Status</th>
                <th style={thStyle}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {reviews.map(r => (
                <tr key={r.id} style={{ borderBottom: '1px solid #EDF2F7' }}>
                  <td style={{ ...tdStyle, fontWeight: 600 }}>
                    {r.name}
                    <div style={{ fontSize: '10px', color: '#718096', fontWeight: 'normal' }}>{r.date_string || 'June 2026'}</div>
                  </td>
                  <td style={tdStyle}>
                    <div style={{ display: 'flex', gap: '2px' }}>
                      {[1,2,3,4,5].map(star => (
                        <Star key={star} size={12} fill={star <= r.rating ? '#D4AF37' : 'none'} color="#D4AF37" />
                      ))}
                    </div>
                  </td>
                  <td style={{ ...tdStyle, maxWidth: '400px', fontSize: '13px', lineHeight: 1.5 }}>"{r.text}"</td>
                  <td style={tdStyle}>
                    <span style={{
                      ...badgeStyle,
                      backgroundColor: r.status === 'Approved' ? '#ECFDF5' : r.status === 'Rejected' ? '#FEF2F2' : '#FFFBEB',
                      color: r.status === 'Approved' ? '#059669' : r.status === 'Rejected' ? '#DC2626' : '#D97706',
                    }}>{r.status}</span>
                  </td>
                  <td style={tdStyle}>
                    <div style={{ display: 'flex', gap: '6px' }}>
                      {r.status !== 'Approved' && (
                        <button onClick={() => handleReviewModerate(r.id, 'Approved')} style={{ ...actionIconBtnStyle, backgroundColor: '#ECFDF5' }} title="Approve Review">
                          <Check size={14} color="#059669" />
                        </button>
                      )}
                      {r.status !== 'Rejected' && (
                        <button onClick={() => handleReviewModerate(r.id, 'Rejected')} style={{ ...actionIconBtnStyle, backgroundColor: '#FFFBEB' }} title="Reject Review">
                          <X size={14} color="#D97706" />
                        </button>
                      )}
                      <button onClick={() => handleDeleteReview(r.id)} style={{ ...actionIconBtnStyle, backgroundColor: '#FEF2F2' }} title="Delete Review">
                        <Trash2 size={14} color="#DC2626" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  // ----------------- CHECK-IN / FRONT DESK -----------------
  const renderCheckIn = () => {
    return (
      <div style={widgetPanelStyle}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: '24px', color: '#0F2040' }}>Front Desk: Today's Arrivals</h2>
          <div style={{ fontSize: '13px', color: '#718096' }}>Assign physical rooms and process guest keycards.</div>
        </div>

        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #EDF2F7', textAlign: 'left' }}>
              <th style={thStyle}>Guest Name</th>
              <th style={thStyle}>Room Requested</th>
              <th style={thStyle}>Stay Duration</th>
              <th style={thStyle}>Booking Status</th>
              <th style={thStyle}>Check-In Operations</th>
            </tr>
          </thead>
          <tbody>
            {todayCheckins.length > 0 ? (
              todayCheckins.map(b => (
                <tr key={b.id} style={{ borderBottom: '1px solid #EDF2F7' }}>
                  <td style={{ ...tdStyle, fontWeight: 600 }}>{b.guest_name}</td>
                  <td style={tdStyle}>{b.room_type_name}</td>
                  <td style={tdStyle}>{b.check_in} to {b.check_out}</td>
                  <td style={tdStyle}>
                    <span style={{ ...badgeStyle, backgroundColor: '#EFF6FF', color: '#2563EB' }}>{b.status}</span>
                  </td>
                  <td style={tdStyle}>
                    <button 
                      onClick={() => openModal('check-in', b)}
                      style={{
                        ...btnGoldStyle,
                        padding: '6px 16px',
                        fontSize: '12px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px'
                      }}
                    >
                      <UserCheck size={14} /> Process Check-In
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" style={{ ...tdStyle, textAlign: 'center', padding: '40px', color: '#718096', fontStyle: 'italic' }}>
                  No arrivals listed for today.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    );
  };

  // ----------------- CHECK-OUT / FRONT DESK -----------------
  const renderCheckOut = () => {
    return (
      <div style={widgetPanelStyle}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: '24px', color: '#0F2040' }}>Front Desk: Today's Departures</h2>
          <div style={{ fontSize: '13px', color: '#718096' }}>Verify billing, process payments, and free rooms.</div>
        </div>

        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #EDF2F7', textAlign: 'left' }}>
              <th style={thStyle}>Guest Name</th>
              <th style={thStyle}>Room Number</th>
              <th style={thStyle}>Stay Duration</th>
              <th style={thStyle}>Billing Total</th>
              <th style={thStyle}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {todayCheckouts.length > 0 ? (
              todayCheckouts.map(b => (
                <tr key={b.id} style={{ borderBottom: '1px solid #EDF2F7' }}>
                  <td style={{ ...tdStyle, fontWeight: 600 }}>{b.guest_name}</td>
                  <td style={{ ...tdStyle, fontWeight: 'bold', color: '#0F2040' }}>Room {b.room_number}</td>
                  <td style={tdStyle}>{b.check_in} to {b.check_out}</td>
                  <td style={{ ...tdStyle, fontWeight: 'bold' }}>${b.total_price.toLocaleString()}</td>
                  <td style={tdStyle}>
                    <button 
                      onClick={() => openModal('check-out', b)}
                      style={{
                        ...btnGoldStyle,
                        backgroundColor: '#DC2626',
                        color: '#fff',
                        padding: '6px 16px',
                        fontSize: '12px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px'
                      }}
                    >
                      <LogOut size={14} /> Process Check-Out
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" style={{ ...tdStyle, textAlign: 'center', padding: '40px', color: '#718096', fontStyle: 'italic' }}>
                  No active checked-in rooms listed for departure.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    );
  };

  // Math helper
  const round = (value, precision) => {
    var multiplier = Math.pow(10, precision || 0);
    return Math.round(value * multiplier) / multiplier;
  };

  // ----------------- MODAL POPUPS RENDERER -----------------
  const renderModals = () => {
    if (!activeModal) return null;

    return (
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(15, 32, 64, 0.65)',
        backdropFilter: 'blur(4px)',
        zIndex: 2000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px'
      }}>
        <div style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '16px',
          boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)',
          width: '100%',
          maxWidth: activeModal === 'check-out' ? '600px' : '500px',
          padding: '35px',
          position: 'relative',
          maxHeight: '90vh',
          overflowY: 'auto'
        }}>
          {/* Close button */}
          <button onClick={() => setActiveModal(null)} style={{ position: 'absolute', top: '20px', right: '20px', background: 'transparent', border: 'none', cursor: 'pointer' }}>
            <X size={20} color="#718096" />
          </button>

          {/* Modal Content Switch */}
          {activeModal === 'add-room' && renderRoomForm('Add Physical Room', handleCreateRoom)}
          {activeModal === 'edit-room' && renderRoomForm('Edit Physical Room', handleUpdateRoom)}
          
          {activeModal === 'add-type' && renderRoomTypeForm('Add Room Type', handleCreateRoomType)}
          {activeModal === 'edit-type' && renderRoomTypeForm('Edit Room Type', handleUpdateRoomType)}

          {activeModal === 'add-amenity' && renderAmenityForm('Add Hotel Amenity', handleCreateAmenity)}
          {activeModal === 'edit-amenity' && renderAmenityForm('Edit Hotel Amenity', handleUpdateAmenity)}

          {activeModal === 'add-booking' && renderBookingForm('New Booking Reservation', handleCreateBooking)}
          {activeModal === 'edit-booking' && renderBookingForm('Edit Reservation Details', handleUpdateBooking)}

          {activeModal === 'edit-guest' && renderGuestForm()}

          {activeModal === 'check-in' && renderCheckInModal()}
          {activeModal === 'check-out' && renderCheckOutModal()}
        </div>
      </div>
    );
  };

  const renderRoomForm = (title, onSubmit) => (
    <form onSubmit={onSubmit}>
      <h3 style={{ fontFamily: 'Playfair Display', fontSize: '22px', marginBottom: '20px', color: '#0F2040' }}>{title}</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <div>
          <label style={modalLabelStyle}>Room Number</label>
          <input 
            type="text" 
            required 
            placeholder="e.g. 204" 
            value={modalForm.room_number} 
            onChange={(e) => setModalForm({...modalForm, room_number: e.target.value})}
            style={formInputStyle} 
          />
        </div>
        <div>
          <label style={modalLabelStyle}>Room Type</label>
          <select 
            value={modalForm.room_type_id} 
            onChange={(e) => setModalForm({...modalForm, room_type_id: parseInt(e.target.value)})}
            style={formSelectStyle}
          >
            {roomTypes.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
          </select>
        </div>
        <div>
          <label style={modalLabelStyle}>Operational Status</label>
          <select 
            value={modalForm.status} 
            onChange={(e) => setModalForm({...modalForm, status: e.target.value})}
            style={formSelectStyle}
          >
            <option value="Available">Available</option>
            <option value="Occupied">Occupied</option>
            <option value="Reserved">Reserved</option>
            <option value="Maintenance">Maintenance</option>
            <option value="Out of Service">Out of Service</option>
          </select>
        </div>
        <div>
          <label style={modalLabelStyle}>Maintenance Notes</label>
          <textarea 
            placeholder="e.g. HVAC inspection details..." 
            value={modalForm.maintenance_notes} 
            onChange={(e) => setModalForm({...modalForm, maintenance_notes: e.target.value})}
            style={{ ...formInputStyle, height: '80px', resize: 'none' }}
          />
        </div>
      </div>
      <button type="submit" style={{ ...btnGoldStyle, width: '100%', marginTop: '25px', padding: '12px' }}>Save Room</button>
    </form>
  );

  const renderRoomTypeForm = (title, onSubmit) => (
    <form onSubmit={onSubmit}>
      <h3 style={{ fontFamily: 'Playfair Display', fontSize: '22px', marginBottom: '20px', color: '#0F2040' }}>{title}</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <div>
          <label style={modalLabelStyle}>Name</label>
          <input type="text" required value={modalForm.name} onChange={(e) => setModalForm({...modalForm, name: e.target.value})} style={formInputStyle} />
        </div>
        <div>
          <label style={modalLabelStyle}>Price Per Night ($)</label>
          <input type="number" required value={modalForm.price_per_night} onChange={(e) => setModalForm({...modalForm, price_per_night: e.target.value})} style={formInputStyle} />
        </div>
        <div>
          <label style={modalLabelStyle}>Total Physical Quantity</label>
          <input type="number" required value={modalForm.total_quantity} onChange={(e) => setModalForm({...modalForm, total_quantity: e.target.value})} style={formInputStyle} />
        </div>
        <div>
          <label style={modalLabelStyle}>Features (Comma-separated)</label>
          <input type="text" placeholder="Free WiFi, King Bed, Bathtub" value={modalForm.features_string} onChange={(e) => setModalForm({...modalForm, features_string: e.target.value})} style={formInputStyle} />
        </div>
        <div>
          <label style={modalLabelStyle}>Image URL</label>
          <input type="text" value={modalForm.image_url} onChange={(e) => setModalForm({...modalForm, image_url: e.target.value})} style={formInputStyle} />
        </div>
        <div>
          <label style={modalLabelStyle}>Description</label>
          <textarea required value={modalForm.description} onChange={(e) => setModalForm({...modalForm, description: e.target.value})} style={{ ...formInputStyle, height: '80px', resize: 'none' }} />
        </div>
      </div>
      <button type="submit" style={{ ...btnGoldStyle, width: '100%', marginTop: '25px', padding: '12px' }}>Save Room Type</button>
    </form>
  );

  const renderAmenityForm = (title, onSubmit) => (
    <form onSubmit={onSubmit}>
      <h3 style={{ fontFamily: 'Playfair Display', fontSize: '22px', marginBottom: '20px', color: '#0F2040' }}>{title}</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <div>
          <label style={modalLabelStyle}>Name</label>
          <input type="text" required value={modalForm.name} onChange={(e) => setModalForm({...modalForm, name: e.target.value})} style={formInputStyle} />
        </div>
        <div>
          <label style={modalLabelStyle}>Category</label>
          <select value={modalForm.category} onChange={(e) => setModalForm({...modalForm, category: e.target.value})} style={formSelectStyle}>
            <option value="Wellness">Wellness</option>
            <option value="Dining">Dining</option>
            <option value="Room Service">Room Service</option>
            <option value="Facilities">Facilities</option>
            <option value="Business">Business</option>
          </select>
        </div>
        <div>
          <label style={modalLabelStyle}>Icon Asset</label>
          <select value={modalForm.icon_name} onChange={(e) => setModalForm({...modalForm, icon_name: e.target.value})} style={formSelectStyle}>
            <option value="Wifi">Wifi Signal</option>
            <option value="Waves">Infinity Pool Waves</option>
            <option value="Flower">Luxury Spa Flower</option>
            <option value="Dumbbell">Gym Dumbbell</option>
            <option value="Utensils">Fine Dining Fork/Knife</option>
            <option value="Car">Valet Parking Car</option>
            <option value="Briefcase">Business Lounge Briefcase</option>
          </select>
        </div>
        <div>
          <label style={modalLabelStyle}>Status</label>
          <select value={modalForm.status} onChange={(e) => setModalForm({...modalForm, status: e.target.value})} style={formSelectStyle}>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>
        <div>
          <label style={modalLabelStyle}>Description</label>
          <textarea value={modalForm.description} onChange={(e) => setModalForm({...modalForm, description: e.target.value})} style={{ ...formInputStyle, height: '80px', resize: 'none' }} />
        </div>
      </div>
      <button type="submit" style={{ ...btnGoldStyle, width: '100%', marginTop: '25px', padding: '12px' }}>Save Amenity</button>
    </form>
  );

  const renderBookingForm = (title, onSubmit) => (
    <form onSubmit={onSubmit}>
      <h3 style={{ fontFamily: 'Playfair Display', fontSize: '22px', marginBottom: '20px', color: '#0F2040' }}>{title}</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        {activeModal === 'add-booking' && (
          <>
            <div>
              <label style={modalLabelStyle}>Guest Full Name</label>
              <input type="text" required placeholder="Priya Nair" value={modalForm.guest_name} onChange={(e) => setModalForm({...modalForm, guest_name: e.target.value})} style={formInputStyle} />
            </div>
            <div>
              <label style={modalLabelStyle}>Guest Email</label>
              <input type="email" required placeholder="priya@example.com" value={modalForm.guest_email} onChange={(e) => setModalForm({...modalForm, guest_email: e.target.value})} style={formInputStyle} />
            </div>
            <div>
              <label style={modalLabelStyle}>Guest Phone</label>
              <input type="text" placeholder="+91 98765 43210" value={modalForm.guest_phone} onChange={(e) => setModalForm({...modalForm, guest_phone: e.target.value})} style={formInputStyle} />
            </div>
          </>
        )}
        
        <div style={{ display: 'flex', gap: '15px' }}>
          <div style={{ flex: 1 }}>
            <label style={modalLabelStyle}>Check-In Date</label>
            <input type="date" required min={new Date().toISOString().split('T')[0]} value={modalForm.check_in} onChange={(e) => setModalForm({...modalForm, check_in: e.target.value})} style={formInputStyle} />
          </div>
          <div style={{ flex: 1 }}>
            <label style={modalLabelStyle}>Check-Out Date</label>
            <input type="date" required min={modalForm.check_in || new Date().toISOString().split('T')[0]} value={modalForm.check_out} onChange={(e) => setModalForm({...modalForm, check_out: e.target.value})} style={formInputStyle} />
          </div>
        </div>

        <div style={{ display: 'flex', gap: '15px' }}>
          <div style={{ flex: 1 }}>
            <label style={modalLabelStyle}>Adults</label>
            <input type="number" min="1" value={modalForm.adults} onChange={(e) => setModalForm({...modalForm, adults: e.target.value})} style={formInputStyle} />
          </div>
          <div style={{ flex: 1 }}>
            <label style={modalLabelStyle}>Children</label>
            <input type="number" min="0" value={modalForm.children} onChange={(e) => setModalForm({...modalForm, children: e.target.value})} style={formInputStyle} />
          </div>
        </div>

        <div>
          <label style={modalLabelStyle}>Room Type</label>
          <select value={modalForm.room_id} onChange={(e) => setModalForm({...modalForm, room_id: parseInt(e.target.value)})} style={formSelectStyle}>
            {roomTypes.map(t => <option key={t.id} value={t.id}>{t.name} (${t.price_per_night}/night)</option>)}
          </select>
        </div>

        <div>
          <label style={modalLabelStyle}>Total Billing Price ($)</label>
          <input type="number" value={modalForm.total_price} onChange={(e) => setModalForm({...modalForm, total_price: e.target.value})} style={formInputStyle} />
        </div>

        <div style={{ borderTop: '1px solid #EDF2F7', paddingTop: '15px', marginTop: '10px' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '14px', fontWeight: 600 }}>
            <input type="checkbox" checked={modalForm.is_group} onChange={(e) => setModalForm({...modalForm, is_group: e.target.checked})} />
            Is this a Group Booking?
          </label>
        </div>

        {modalForm.is_group && (
          <div style={{ display: 'flex', gap: '15px' }}>
            <div style={{ flex: 2 }}>
              <label style={modalLabelStyle}>Group Retreat Name</label>
              <input type="text" placeholder="e.g. MenThee Corporate" value={modalForm.group_name} onChange={(e) => setModalForm({...modalForm, group_name: e.target.value})} style={formInputStyle} />
            </div>
            <div style={{ flex: 1 }}>
              <label style={modalLabelStyle}>Group Size</label>
              <input type="number" min="1" value={modalForm.group_size} onChange={(e) => setModalForm({...modalForm, group_size: e.target.value})} style={formInputStyle} />
            </div>
          </div>
        )}
      </div>
      <button type="submit" style={{ ...btnGoldStyle, width: '100%', marginTop: '25px', padding: '12px' }}>Confirm Reservation</button>
    </form>
  );

  const renderGuestForm = () => (
    <form onSubmit={handleUpdateGuest}>
      <h3 style={{ fontFamily: 'Playfair Display', fontSize: '22px', marginBottom: '20px', color: '#0F2040' }}>Modify Guest Standing</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <div>
          <label style={modalLabelStyle}>Username</label>
          <input type="text" required value={modalForm.username} onChange={(e) => setModalForm({...modalForm, username: e.target.value})} style={formInputStyle} />
        </div>
        <div>
          <label style={modalLabelStyle}>Email</label>
          <input type="email" required value={modalForm.email} onChange={(e) => setModalForm({...modalForm, email: e.target.value})} style={formInputStyle} />
        </div>
        <div>
          <label style={modalLabelStyle}>Phone</label>
          <input type="text" value={modalForm.phone} onChange={(e) => setModalForm({...modalForm, phone: e.target.value})} style={formInputStyle} />
        </div>
        
        <div style={{ display: 'flex', gap: '15px' }}>
          <div style={{ flex: 1 }}>
            <label style={modalLabelStyle}>Loyalty Points Balance</label>
            <input type="number" required value={modalForm.loyalty_points} onChange={(e) => setModalForm({...modalForm, loyalty_points: parseInt(e.target.value)})} style={formInputStyle} />
          </div>
          <div style={{ flex: 1 }}>
            <label style={modalLabelStyle}>Membership Tier</label>
            <select value={modalForm.membership_tier} onChange={(e) => setModalForm({...modalForm, membership_tier: e.target.value})} style={formSelectStyle}>
              <option value="Silver">Silver Tier</option>
              <option value="Gold">Gold Tier</option>
              <option value="Platinum">Platinum Tier</option>
            </select>
          </div>
        </div>
      </div>
      <button type="submit" style={{ ...btnGoldStyle, width: '100%', marginTop: '25px', padding: '12px' }}>Apply Profile Changes</button>
    </form>
  );

  const renderCheckInModal = () => (
    <form onSubmit={handleCheckInSubmit}>
      <h3 style={{ fontFamily: 'Playfair Display', fontSize: '22px', marginBottom: '15px', color: '#0F2040' }}>Process Guest Check-In</h3>
      <div style={{ backgroundColor: '#F7FAFC', border: '1px solid #E2E8F0', padding: '15px', borderRadius: '8px', marginBottom: '20px' }}>
        <div style={{ fontSize: '14px', color: '#718096' }}>GUEST NAME</div>
        <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#0F2040', marginBottom: '10px' }}>{selectedItem.guest_name}</div>
        
        <div style={{ display: 'flex', gap: '20px', fontSize: '13px' }}>
          <div><strong>Requested:</strong> {selectedItem.room_type_name}</div>
          <div><strong>Nights:</strong> {selectedItem.check_in} to {selectedItem.check_out}</div>
        </div>
      </div>

      <div>
        <label style={modalLabelStyle}>Assign Physical Room Number</label>
        {selectedItem.available_physical_rooms?.length > 0 ? (
          <select 
            value={modalForm.physical_room_id} 
            onChange={(e) => setModalForm({ physical_room_id: e.target.value })}
            style={formSelectStyle}
          >
            {selectedItem.available_physical_rooms.map(room => (
              <option key={room.id} value={room.id}>Room {room.room_number} (Ready / Available)</option>
            ))}
          </select>
        ) : (
          <div style={{ color: '#E53E3E', fontSize: '14px', fontWeight: 600, padding: '10px', backgroundColor: '#FFF5F5', borderRadius: '4px', border: '1px solid #FED7D7' }}>
            No physical rooms of type "{selectedItem.room_type_name}" are currently vacant and available. Please check room statuses first!
          </div>
        )}
      </div>

      <button 
        type="submit" 
        disabled={!selectedItem.available_physical_rooms?.length}
        style={{ 
          ...btnGoldStyle, 
          width: '100%', 
          marginTop: '25px', 
          padding: '12px',
          opacity: selectedItem.available_physical_rooms?.length ? 1 : 0.6,
          cursor: selectedItem.available_physical_rooms?.length ? 'pointer' : 'not-allowed'
        }}
      >
        Complete Check-In & Issue Keycard
      </button>
    </form>
  );

  const renderCheckOutModal = () => {
    const nights = Math.max(1, (new Date(selectedItem.check_out) - new Date(selectedItem.check_in)) / (1000 * 60 * 60 * 24)) || 1;
    const roomCharge = selectedItem.total_price;
    const taxes = Math.round(roomCharge * 0.12); // 12% luxury tax
    const amenityFee = 35.00; // Flat resort charge
    const totalDue = roomCharge + taxes + amenityFee;

    return (
      <form onSubmit={handleCheckOutSubmit}>
        <h3 style={{ fontFamily: 'Playfair Display', fontSize: '22px', marginBottom: '15px', color: '#0F2040' }}>Process Guest Check-Out</h3>
        
        {/* Billing Invoice summary */}
        <div style={{ backgroundColor: '#F8F9FA', borderRadius: '12px', padding: '20px', border: '1px solid #E2E8F0', marginBottom: '20px' }}>
          <h4 style={{ fontSize: '11px', textTransform: 'uppercase', color: '#718096', letterSpacing: '1px', marginBottom: '12px', borderBottom: '1px solid #E2E8F0', paddingBottom: '6px' }}>BILLING SUMMARY & INVOICE</h4>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Guest Name:</span>
              <strong>{selectedItem.guest_name}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Assigned Room:</span>
              <strong>Room {selectedItem.room_number} ({selectedItem.room_type_name})</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Duration of Stay:</span>
              <strong>{nights} Nights ({selectedItem.check_in} to {selectedItem.check_out})</strong>
            </div>
            
            <div style={{ borderTop: '1px solid #EDF2F7', margin: '8px 0' }} />
            
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Room Charge:</span>
              <span>${roomCharge.toFixed(2)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Addon Amenities Resort Fee:</span>
              <span>${amenityFee.toFixed(2)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>State Luxury Tax (12%):</span>
              <span>${taxes.toFixed(2)}</span>
            </div>
            
            <div style={{ borderTop: '2px solid #0F2040', margin: '10px 0', paddingOpacity: '5px' }} />
            
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '16px', fontWeight: 'bold', color: '#0F2040' }}>
              <span>Grand Total Due:</span>
              <span>${totalDue.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Post-checkout room flag */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '14px', fontWeight: 600 }}>
            <input 
              type="checkbox" 
              checked={modalForm.flag_maintenance} 
              onChange={(e) => setModalForm({...modalForm, flag_maintenance: e.target.checked})} 
            />
            Flag room for Maintenance post checkout?
          </label>

          {modalForm.flag_maintenance && (
            <div>
              <label style={modalLabelStyle}>Maintenance Description</label>
              <textarea 
                placeholder="e.g. Deep cleaning, HVAC filter change..." 
                value={modalForm.maintenance_notes} 
                onChange={(e) => setModalForm({...modalForm, maintenance_notes: e.target.value})}
                style={{ ...formInputStyle, height: '70px', resize: 'none' }}
              />
            </div>
          )}
        </div>

        <button type="submit" style={{ ...btnGoldStyle, width: '100%', marginTop: '25px', padding: '12px', backgroundColor: '#059669', color: '#fff' }}>
          Confirm Payment & Checkout Guest
        </button>
      </form>
    );
  };

  // ----------------- SIDEBAR NAV RENDERER -----------------
  const renderSidebarItem = (tabName, icon, label) => {
    const isActive = currentTab === tabName;
    return (
      <button 
        onClick={() => {
          setCurrentTab(tabName);
          setError('');
        }}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          width: '100%',
          padding: '12px 18px',
          border: 'none',
          backgroundColor: isActive ? '#1A2B4D' : 'transparent',
          color: isActive ? '#D4AF37' : '#A0AEC0',
          cursor: 'pointer',
          textAlign: 'left',
          fontSize: '13px',
          fontWeight: isActive ? 600 : 500,
          borderRadius: '6px',
          transition: 'all 0.2s',
          marginBottom: '4px'
        }}
        onMouseOver={(e) => { if(!isActive) { e.target.style.color = '#fff'; e.target.style.backgroundColor = 'rgba(255,255,255,0.03)'; } }}
        onMouseOut={(e) => { if(!isActive) { e.target.style.color = '#A0AEC0'; e.target.style.backgroundColor = 'transparent'; } }}
      >
        {icon}
        <span>{label}</span>
        {isActive && <ChevronRight size={14} style={{ marginLeft: 'auto' }} />}
      </button>
    );
  };

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: '260px 1fr',
      minHeight: '100vh',
      backgroundColor: '#F8F9FA',
      fontFamily: 'Inter, sans-serif'
    }}>
      {/* Sidebar (Dark) */}
      <aside style={{
        backgroundColor: '#0F2040',
        padding: '25px 15px',
        display: 'flex',
        flexDirection: 'column',
        borderRight: '1px solid rgba(255,255,255,0.05)',
        boxShadow: '4px 0 10px rgba(0,0,0,0.05)'
      }}>
        {/* Brand */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '35px', padding: '0 10px' }}>
          <div style={{
            backgroundColor: '#D4AF37',
            color: '#0F2040',
            width: '32px',
            height: '32px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            fontFamily: 'Playfair Display, serif',
            fontSize: '20px',
            fontWeight: 'bold',
            borderRadius: '4px'
          }}>A</div>
          <div>
            <div style={{ fontFamily: 'Playfair Display, serif', fontSize: '18px', letterSpacing: '1px', fontWeight: 'bold', color: '#fff', lineHeight: 1 }}>ATLAS</div>
            <div style={{ fontSize: '8px', letterSpacing: '1px', color: '#A0AEC0', marginTop: '2px', fontWeight: 600 }}>ADMIN PANEL</div>
          </div>
        </div>

        {/* Navigations Groups */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', flex: 1, overflowY: 'auto' }}>
          <div>
            <div style={sidebarGroupTitleStyle}>MAIN</div>
            {renderSidebarItem('dashboard', <BarChart2 size={16} />, 'Dashboard')}
          </div>

          <div>
            <div style={sidebarGroupTitleStyle}>PROPERTY</div>
            {renderSidebarItem('rooms', <Bed size={16} />, 'Room Management')}
            {renderSidebarItem('room-types', <Settings size={16} />, 'Room Types')}
            {renderSidebarItem('amenities', <Flower size={16} />, 'Amenities Setup')}
          </div>

          <div>
            <div style={sidebarGroupTitleStyle}>RESERVATIONS</div>
            {renderSidebarItem('reservations', <FileText size={16} />, 'Reservations')}
            {renderSidebarItem('calendar', <Calendar size={16} />, 'Booking Calendar')}
            {renderSidebarItem('group-bookings', <Users size={16} />, 'Group Bookings')}
            {renderSidebarItem('waitlist', <CheckSquare size={16} />, 'Waitlist')}
          </div>

          <div>
            <div style={sidebarGroupTitleStyle}>GUESTS</div>
            {renderSidebarItem('guests', <User size={16} />, 'Guest Profiles')}
            {renderSidebarItem('loyalty', <Award size={16} />, 'Loyalty Program')}
            {renderSidebarItem('feedback', <Star size={16} />, 'Feedback & Reviews')}
          </div>

          <div>
            <div style={sidebarGroupTitleStyle}>FRONT DESK</div>
            {renderSidebarItem('check-in', <UserCheck size={16} />, 'Check-In')}
            {renderSidebarItem('check-out', <LogOut size={16} />, 'Check-Out')}
          </div>
        </div>
      </aside>

      {/* Main Body */}
      <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', overflowY: 'auto' }}>
        {/* Top Navbar */}
        <header style={{
          backgroundColor: '#FFFFFF',
          padding: '15px 30px',
          borderBottom: '1px solid #EDF2F7',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
        }}>
          {/* Current Date Display */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#718096', fontSize: '13px', fontWeight: 600 }}>
            <Calendar size={15} />
            <span>{new Date().toLocaleDateString('en-US', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })}</span>
          </div>

          {/* Profile & Logout */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{
                backgroundColor: '#3B82F6',
                color: '#fff',
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 'bold',
                fontSize: '14px'
              }}>{adminUser ? adminUser.slice(0, 2).toUpperCase() : 'AD'}</div>
              
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#2D3748', lineHeight: 1.1 }}>{adminUser || 'Administrator'}</div>
                <div style={{ fontSize: '11px', color: '#718096', marginTop: '2px' }}>{adminRole}</div>
              </div>
            </div>

            <button onClick={handleLogout} style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              backgroundColor: 'transparent',
              border: '1px solid #E2E8F0',
              padding: '8px 12px',
              borderRadius: '6px',
              color: '#4A5568',
              fontSize: '13px',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
            onMouseOver={(e) => { e.target.style.backgroundColor = '#FFF5F5'; e.target.style.borderColor = '#FEB2B2'; e.target.style.color = '#C53030'; }}
            onMouseOut={(e) => { e.target.style.backgroundColor = 'transparent'; e.target.style.borderColor = '#E2E8F0'; e.target.style.color = '#4A5568'; }}
            >
              <LogOut size={14} />
              Logout
            </button>
          </div>
        </header>

        {/* Content Pane */}
        <main style={{ padding: '30px', flex: 1, position: 'relative' }}>
          {error && (
            <div style={{
              backgroundColor: '#FFF5F5',
              border: '1px solid #FED7D7',
              color: '#C53030',
              padding: '15px',
              borderRadius: '8px',
              marginBottom: '20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <span>{error}</span>
              <button onClick={() => setError('')} style={{ background: 'transparent', border: 'none', color: '#C53030', cursor: 'pointer', fontWeight: 'bold' }}>X</button>
            </div>
          )}

          {loading && currentTab === 'dashboard' ? (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
              <div style={{ textAlign: 'center' }}>
                <RefreshCw className="spin" size={32} color="#0F2040" style={{ animation: 'spin 1.5s linear infinite' }} />
                <p style={{ marginTop: '10px', color: '#718096', fontSize: '14px' }}>Loading Dashboard Standings...</p>
              </div>
            </div>
          ) : (
            <>
              {currentTab === 'dashboard' && renderDashboard()}
              {currentTab === 'rooms' && renderRoomManagement()}
              {currentTab === 'room-types' && renderRoomTypes()}
              {currentTab === 'amenities' && renderAmenities()}
              {currentTab === 'reservations' && renderReservations()}
              {currentTab === 'calendar' && renderBookingCalendar()}
              {currentTab === 'group-bookings' && renderGroupBookings()}
              {currentTab === 'waitlist' && renderWaitlist()}
              {currentTab === 'guests' && renderGuestProfiles()}
              {currentTab === 'loyalty' && renderLoyaltyProgram()}
              {currentTab === 'feedback' && renderFeedback()}
              {currentTab === 'check-in' && renderCheckIn()}
              {currentTab === 'check-out' && renderCheckOut()}
            </>
          )}
        </main>
      </div>

      {/* CRUD Modals */}
      {renderModals()}
    </div>
  );
};

// ----------------- STYLING CONSTANTS -----------------
const sidebarGroupTitleStyle = {
  fontSize: '11px',
  fontWeight: '700',
  color: 'rgba(255, 255, 255, 0.4)',
  letterSpacing: '1.5px',
  padding: '10px 18px 6px',
  textTransform: 'uppercase'
};

const widgetPanelStyle = {
  backgroundColor: '#FFFFFF',
  borderRadius: '12px',
  padding: '25px',
  border: '1px solid #E2E8F0',
  boxShadow: '0 4px 6px -1px rgba(0,0,0,0.01), 0 2px 4px -1px rgba(0,0,0,0.01)'
};

const widgetTitleStyle = {
  fontFamily: 'Playfair Display, serif',
  fontSize: '20px',
  color: '#0F2040',
  marginBottom: '5px'
};

const kpiCardStyle = {
  backgroundColor: '#FFFFFF',
  borderRadius: '12px',
  padding: '20px',
  border: '1px solid #E2E8F0',
  boxShadow: '0 4px 6px -1px rgba(0,0,0,0.01)',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between'
};

const kpiHeaderStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center'
};

const iconContainerStyle = {
  width: '36px',
  height: '36px',
  borderRadius: '8px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center'
};

const thStyle = {
  padding: '12px 16px',
  fontSize: '11px',
  fontWeight: '700',
  color: '#718096',
  textTransform: 'uppercase',
  letterSpacing: '0.5px'
};

const tdStyle = {
  padding: '16px',
  fontSize: '14px',
  color: '#4A5568',
  verticalAlign: 'middle'
};

const badgeStyle = {
  display: 'inline-block',
  padding: '4px 8px',
  borderRadius: '4px',
  fontSize: '11px',
  fontWeight: 600
};

const btnGoldStyle = {
  backgroundColor: '#D4AF37',
  color: '#0F2040',
  fontWeight: 700,
  fontSize: '14px',
  border: 'none',
  padding: '10px 18px',
  borderRadius: '6px',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  gap: '6px',
  transition: 'background-color 0.2s'
};

const btnOutlineStyle = {
  backgroundColor: 'transparent',
  border: '1px solid #CBD5E0',
  padding: '10px 18px',
  borderRadius: '6px',
  color: '#4A5568',
  fontWeight: 600,
  cursor: 'pointer',
  transition: 'all 0.2s'
};

const actionIconBtnStyle = {
  backgroundColor: '#EDF2F7',
  border: 'none',
  width: '28px',
  height: '28px',
  borderRadius: '6px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  transition: 'background-color 0.2s'
};

const filterLabelStyle = {
  display: 'block',
  fontSize: '11px',
  fontWeight: 700,
  color: '#718096',
  textTransform: 'uppercase',
  letterSpacing: '0.5px',
  marginBottom: '6px'
};

const formInputStyle = {
  width: '100%',
  padding: '10px 14px',
  border: '1px solid #E2E8F0',
  borderRadius: '6px',
  fontSize: '14px',
  outline: 'none',
  fontFamily: 'inherit'
};

const formSelectStyle = {
  width: '100%',
  padding: '10px 14px',
  border: '1px solid #E2E8F0',
  borderRadius: '6px',
  fontSize: '14px',
  outline: 'none',
  backgroundColor: '#FFFFFF',
  fontFamily: 'inherit'
};

const modalLabelStyle = {
  display: 'block',
  fontSize: '12px',
  fontWeight: 700,
  color: '#4A5568',
  marginBottom: '6px'
};

export default AdminDashboard;
