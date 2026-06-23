from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

db = SQLAlchemy()

class User(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(50), nullable=False, unique=True)
    email = db.Column(db.String(100), nullable=False, unique=True)
    password_hash = db.Column(db.String(255), nullable=False)
    role = db.Column(db.String(20), default='guest', nullable=False) # 'guest' or 'admin'
    phone = db.Column(db.String(50), nullable=True)
    loyalty_points = db.Column(db.Integer, default=0, nullable=False)
    membership_tier = db.Column(db.String(20), default='Silver', nullable=False) # 'Silver', 'Gold', 'Platinum'
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

class Room(db.Model):
    # This represents Room Types
    __tablename__ = 'rooms'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text, nullable=False)
    price_per_night = db.Column(db.Float, nullable=False)
    image_url = db.Column(db.String(255), nullable=True)
    features = db.Column(db.JSON, nullable=True)
    total_quantity = db.Column(db.Integer, default=10, nullable=False)

class PhysicalRoom(db.Model):
    __tablename__ = 'physical_rooms'
    id = db.Column(db.Integer, primary_key=True)
    room_number = db.Column(db.String(10), nullable=False, unique=True)
    room_type_id = db.Column(db.Integer, db.ForeignKey('rooms.id'), nullable=False)
    status = db.Column(db.String(50), default='Available', nullable=False) # 'Occupied', 'Available', 'Reserved', 'Maintenance', 'Out of Service'
    maintenance_notes = db.Column(db.Text, nullable=True)
    
    # Relationship to Room type
    room_type = db.relationship('Room', backref=db.backref('physical_rooms', lazy=True))

class Booking(db.Model):
    __tablename__ = 'bookings'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    room_id = db.Column(db.Integer, db.ForeignKey('rooms.id'), nullable=True)
    room_name = db.Column(db.String(100), nullable=True)
    physical_room_id = db.Column(db.Integer, db.ForeignKey('physical_rooms.id'), nullable=True)
    check_in = db.Column(db.String(50), nullable=False)
    check_out = db.Column(db.String(50), nullable=False)
    adults = db.Column(db.Integer, nullable=False)
    children = db.Column(db.Integer, nullable=False)
    total_price = db.Column(db.Float, nullable=False, default=0.0)
    status = db.Column(db.String(50), nullable=False, default='Paid') # 'Paid', 'Confirmed', 'Pending', 'Cancelled', 'Checked In', 'Checked Out'
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Group bookings fields
    is_group = db.Column(db.Boolean, default=False, nullable=False)
    group_name = db.Column(db.String(100), nullable=True)
    group_size = db.Column(db.Integer, default=1, nullable=True)

    # Relationships
    user = db.relationship('User', backref=db.backref('bookings', lazy=True))
    physical_room = db.relationship('PhysicalRoom', backref=db.backref('bookings', lazy=True))

class Waitlist(db.Model):
    __tablename__ = 'waitlist'
    id = db.Column(db.Integer, primary_key=True)
    guest_name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(100), nullable=False)
    phone = db.Column(db.String(50), nullable=True)
    room_type_id = db.Column(db.Integer, db.ForeignKey('rooms.id'), nullable=False)
    check_in = db.Column(db.String(50), nullable=False)
    check_out = db.Column(db.String(50), nullable=False)
    status = db.Column(db.String(50), default='Waitlisted', nullable=False) # 'Waitlisted', 'Confirmed', 'Cancelled'
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    room_type = db.relationship('Room', backref=db.backref('waitlist_bookings', lazy=True))

class Amenity(db.Model):
    __tablename__ = 'amenities'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    category = db.Column(db.String(50), nullable=False) # 'Wellness', 'Dining', 'Room Service', 'Facilities', 'Business'
    icon_name = db.Column(db.String(50), nullable=True) # Lucide icon name (e.g. WiFi, Coffee, etc.)
    description = db.Column(db.Text, nullable=True)
    status = db.Column(db.String(50), default='Active', nullable=False) # 'Active', 'Inactive'

class ContactMessage(db.Model):
    __tablename__ = 'contact_messages'
    id = db.Column(db.Integer, primary_key=True)
    first_name = db.Column(db.String(50), nullable=False)
    last_name = db.Column(db.String(50), nullable=False)
    email = db.Column(db.String(100), nullable=False)
    phone = db.Column(db.String(50), nullable=True)
    subject = db.Column(db.String(100), nullable=True)
    message = db.Column(db.Text, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

class Review(db.Model):
    __tablename__ = 'reviews'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    rating = db.Column(db.Integer, nullable=False)
    date_string = db.Column(db.String(50), nullable=True)
    text = db.Column(db.Text, nullable=False)
    status = db.Column(db.String(50), default='Approved', nullable=False) # 'Pending', 'Approved', 'Rejected'
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

class Alert(db.Model):
    __tablename__ = 'alerts'
    id = db.Column(db.Integer, primary_key=True)
    type = db.Column(db.String(50), nullable=False) # 'maintenance', 'booking', 'system'
    message = db.Column(db.String(255), nullable=False)
    status = db.Column(db.String(50), default='active', nullable=False) # 'active', 'resolved'
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
