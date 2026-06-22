from flask import Blueprint, jsonify, request
from werkzeug.security import generate_password_hash, check_password_hash
import jwt
from datetime import datetime, timedelta
from functools import wraps
from models import db, Room, Booking, ContactMessage, User, Review

api_bp = Blueprint('api', __name__)
SECRET_KEY = 'super-secret-key-atlas'

def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = request.headers.get('Authorization')
        if not token:
            return jsonify({'message': 'Token is missing'}), 401
        try:
            token = token.split(" ")[1] # Bearer <token>
            data = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
            current_user = User.query.filter_by(id=data['user_id']).first()
        except Exception as e:
            return jsonify({'message': 'Token is invalid'}), 401
        return f(current_user, *args, **kwargs)
    return decorated

@api_bp.route('/auth/register', methods=['POST'])
def register():
    data = request.json
    hashed_password = generate_password_hash(data['password'], method='pbkdf2:sha256')
    
    if User.query.filter_by(email=data['email']).first():
        return jsonify({'message': 'Email already registered'}), 400
        
    new_user = User(
        username=data['username'],
        email=data['email'],
        password_hash=hashed_password
    )
    db.session.add(new_user)
    db.session.commit()
    return jsonify({'message': 'User created successfully'}), 201

@api_bp.route('/auth/login', methods=['POST'])
def login():
    data = request.json
    user = User.query.filter_by(email=data['email']).first()
    
    if not user or not check_password_hash(user.password_hash, data['password']):
        return jsonify({'message': 'Invalid credentials'}), 401
        
    token = jwt.encode({
        'user_id': user.id,
        'exp': datetime.utcnow() + timedelta(hours=24)
    }, SECRET_KEY, algorithm="HS256")
    
    return jsonify({'token': token, 'username': user.username}), 200

@api_bp.route('/rooms', methods=['GET'])
def get_rooms():
    rooms = Room.query.all()
    rooms_data = []
    for r in rooms:
        rooms_data.append({
            'id': r.id,
            'name': r.name,
            'description': r.description,
            'price_per_night': r.price_per_night,
            'image_url': r.image_url,
            'features': r.features,
            'total_quantity': r.total_quantity
        })
    return jsonify(rooms_data), 200

@api_bp.route('/availability', methods=['POST'])
def check_availability():
    data = request.json
    check_in = data.get('check_in')
    check_out = data.get('check_out')
    
    # Simple overlap calculation logic
    # Find all bookings that overlap with requested dates
    overlapping_bookings = Booking.query.filter(
        Booking.check_in < check_out,
        Booking.check_out > check_in
    ).all()
    
    rooms = Room.query.all()
    availability = []
    
    for room in rooms:
        # Count overlapping bookings for this specific room name
        booked_count = sum(1 for b in overlapping_bookings if b.room_name == room.name)
        available_qty = room.total_quantity - booked_count
        
        availability.append({
            'room_id': room.id,
            'room_name': room.name,
            'price_per_night': room.price_per_night,
            'total_quantity': room.total_quantity,
            'booked': booked_count,
            'available': max(0, available_qty)
        })
        
    return jsonify(availability), 200

@api_bp.route('/bookings', methods=['POST'])
@token_required
def create_booking(current_user):
    data = request.json
    try:
        new_booking = Booking(
            user_id=current_user.id,
            room_name=data.get('room_type', 'Any'),
            check_in=data.get('check_in'),
            check_out=data.get('check_out'),
            adults=data.get('adults', 1),
            children=data.get('children', 0),
            total_price=data.get('total_price', 0.0),
            status='Paid'
        )
        db.session.add(new_booking)
        db.session.commit()
        return jsonify({'message': 'Booking successful'}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 400

@api_bp.route('/bookings', methods=['GET'])
@token_required
def get_bookings(current_user):
    bookings = Booking.query.filter_by(user_id=current_user.id).order_by(Booking.created_at.desc()).all()
    bookings_data = []
    for b in bookings:
        bookings_data.append({
            'id': b.id,
            'room_name': b.room_name,
            'check_in': b.check_in,
            'check_out': b.check_out,
            'adults': b.adults,
            'children': b.children,
            'total_price': b.total_price,
            'status': b.status,
            'created_at': b.created_at.isoformat()
        })
    return jsonify(bookings_data), 200

@api_bp.route('/contact', methods=['POST'])
def create_contact_message():
    data = request.json
    try:
        new_message = ContactMessage(
            first_name=data.get('first_name'),
            last_name=data.get('last_name'),
            email=data.get('email'),
            phone=data.get('phone', ''),
            subject=data.get('subject', ''),
            message=data.get('message')
        )
        db.session.add(new_message)
        db.session.commit()
        return jsonify({'message': 'Message sent successfully'}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 400

@api_bp.route('/reviews', methods=['GET'])
def get_reviews():
    reviews = Review.query.order_by(Review.created_at.desc()).all()
    reviews_data = []
    for r in reviews:
        reviews_data.append({
            'id': r.id,
            'name': r.name,
            'rating': r.rating,
            'date_string': r.date_string,
            'text': r.text,
            'created_at': r.created_at.isoformat()
        })
    return jsonify(reviews_data), 200

@api_bp.route('/reviews', methods=['POST'])
@token_required
def create_review(current_user):
    data = request.json
    try:
        new_review = Review(
            name=current_user.username,
            rating=data.get('rating'),
            date_string=datetime.utcnow().strftime("%B %Y"),
            text=data.get('text')
        )
        db.session.add(new_review)
        db.session.commit()
        return jsonify({'message': 'Review submitted successfully'}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 400
