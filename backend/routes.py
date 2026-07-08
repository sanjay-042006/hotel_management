import os
from flask import Blueprint, jsonify, request
from werkzeug.security import generate_password_hash, check_password_hash
import jwt
from datetime import datetime, timedelta
from functools import wraps
from models import db, Room, Booking, ContactMessage, User, Review, PhysicalRoom, Waitlist, Amenity, Alert

api_bp = Blueprint('api', __name__)
SECRET_KEY = os.environ.get('SECRET_KEY', 'super-secret-key-atlas')
# Custom Authentication Decorators
def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        auth_header = request.headers.get('Authorization')
        if not auth_header or not auth_header.startswith('Bearer '):
            return jsonify({'message': 'Valid token is missing'}), 401
        
        token = auth_header.split(" ")[1]
        try:
            data = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
            current_user = User.query.filter_by(id=data['user_id']).first()
            if not current_user:
                return jsonify({'message': 'User no longer exists'}), 401
        except jwt.ExpiredSignatureError:
            return jsonify({'message': 'Token has expired'}), 401
        except jwt.InvalidTokenError:
            return jsonify({'message': 'Token is invalid'}), 401
            
        return f(current_user, *args, **kwargs)
    return decorated

def admin_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        auth_header = request.headers.get('Authorization')
        if not auth_header or not auth_header.startswith('Bearer '):
            return jsonify({'message': 'Valid token is missing'}), 401
        
        token = auth_header.split(" ")[1]
        try:
            data = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
            current_user = User.query.filter_by(id=data['user_id']).first()
            if not current_user:
                return jsonify({'message': 'User no longer exists'}), 401
            if current_user.role != 'admin':
                return jsonify({'message': 'Admin privilege required'}), 403
        except jwt.ExpiredSignatureError:
            return jsonify({'message': 'Token has expired'}), 401
        except jwt.InvalidTokenError:
            return jsonify({'message': 'Token is invalid'}), 401
            
        return f(current_user, *args, **kwargs)
    return decorated

# ----------------- GUEST AUTH ROUTES -----------------

@api_bp.route('/auth/register', methods=['POST'])
def register():
    data = request.json
    hashed_password = generate_password_hash(data['password'], method='pbkdf2:sha256')
    
    if User.query.filter_by(email=data['email']).first():
        return jsonify({'message': 'Email already registered'}), 400
        
    new_user = User(
        username=data['username'],
        email=data['email'],
        password_hash=hashed_password,
        role='guest'
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
        'role': user.role,
        'exp': datetime.utcnow() + timedelta(days=7)
    }, SECRET_KEY, algorithm="HS256")
    
    return jsonify({'token': token, 'username': user.username, 'role': user.role}), 200

def sync_db_statuses():
    # Admin must process check-ins and check-outs manually.
    # Auto-transitions break the manual workflow and room assignment.
    pass

# ----------------- ADMIN AUTH & DASHBOARD -----------------

@api_bp.route('/auth/admin/login', methods=['POST'])
def admin_login():
    data = request.json
    username = data.get('username')
    password = data.get('password')
    
    user = User.query.filter((User.username == username) | (User.email == username)).first()
    
    if not user or user.role != 'admin' or not check_password_hash(user.password_hash, password):
        return jsonify({'message': 'Invalid admin credentials'}), 401
        
    token = jwt.encode({
        'user_id': user.id,
        'role': 'admin',
        'exp': datetime.utcnow() + timedelta(days=7)
    }, SECRET_KEY, algorithm="HS256")
    
    return jsonify({'token': token, 'username': user.username, 'role': user.role}), 200

@api_bp.route('/admin/dashboard-stats', methods=['GET'])
@admin_required
def get_dashboard_stats(current_admin):
    sync_db_statuses()
    today_str = datetime.utcnow().strftime("%Y-%m-%d")
    
    # 1. Total rooms and status breakdown
    total_rooms = PhysicalRoom.query.count()
    occupied_count = PhysicalRoom.query.filter_by(status='Occupied').count()
    available_count = PhysicalRoom.query.filter_by(status='Available').count()
    reserved_count = PhysicalRoom.query.filter_by(status='Reserved').count()
    maintenance_count = PhysicalRoom.query.filter_by(status='Maintenance').count()
    out_of_service_count = PhysicalRoom.query.filter_by(status='Out of Service').count()
    
    occupancy_rate = round((occupied_count / total_rooms * 100), 1) if total_rooms > 0 else 0
    
    # 2. Check-ins & check-outs today
    checkins_today = Booking.query.filter(Booking.check_in == today_str, Booking.status != 'Cancelled').count()
    checkouts_today = Booking.query.filter(Booking.check_out == today_str, Booking.status != 'Cancelled').count()
    
    # 3. Revenue calculations
    # Today's revenue: Sum of total_price of bookings checking in today or checked-in active bookings
    bookings_today = Booking.query.filter(Booking.check_in == today_str, Booking.status != 'Cancelled').all()
    revenue_today = sum(b.total_price for b in bookings_today)
    
    # 4. Revenue Trend (last 7 days)
    revenue_trend = []
    for i in range(6, -1, -1):
        day_date = datetime.utcnow() - timedelta(days=i)
        day_str = day_date.strftime("%Y-%m-%d")
        day_label = day_date.strftime("%d %b")
        day_bookings = Booking.query.filter(Booking.check_in == day_str, Booking.status != 'Cancelled').all()
        day_rev = sum(b.total_price for b in day_bookings)
        revenue_trend.append({
            'date': day_label,
            'revenue': day_rev
        })
        
    # 5. Upcoming bookings (next 7 days)
    upcoming_bookings = Booking.query.filter(
        Booking.check_in >= today_str, 
        Booking.status != 'Cancelled'
    ).order_by(Booking.check_in.asc()).limit(5).all()
    
    upcoming_list = []
    for b in upcoming_bookings:
        upcoming_list.append({
            'id': b.id,
            'guest_name': b.user.username if b.user else 'Walk-in',
            'room_name': b.room_name,
            'check_in': b.check_in,
            'check_out': b.check_out,
            'status': b.status
        })

    # 6. Alerts
    active_alerts = Alert.query.filter_by(status='active').order_by(Alert.created_at.desc()).all()
    alerts_list = [{'id': a.id, 'type': a.type, 'message': a.message, 'created_at': a.created_at.isoformat()} for a in active_alerts]
    
    return jsonify({
        'occupancy_rate': occupancy_rate,
        'total_rooms': total_rooms,
        'occupied_rooms': occupied_count,
        'available_rooms': available_count,
        'reserved_rooms': reserved_count,
        'maintenance_rooms': maintenance_count,
        'out_of_service_rooms': out_of_service_count,
        'checkins_today': checkins_today,
        'checkouts_today': checkouts_today,
        'revenue_today': revenue_today,
        'revenue_trend': revenue_trend,
        'upcoming_reservations': upcoming_list,
        'alerts': alerts_list
    }), 200

# ----------------- ROOMS CRUD -----------------

@api_bp.route('/rooms', methods=['GET'])
def get_rooms():
    sync_db_statuses()
    # Public route for guest portal (room types)
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

@api_bp.route('/admin/rooms', methods=['GET', 'POST'])
@admin_required
def admin_rooms(current_admin):
    sync_db_statuses()
    if request.method == 'GET':
        physical_rooms = PhysicalRoom.query.all()
        data = []
        for pr in physical_rooms:
            data.append({
                'id': pr.id,
                'room_number': pr.room_number,
                'room_type_id': pr.room_type_id,
                'room_type_name': pr.room_type.name if pr.room_type else 'Unknown',
                'status': pr.status,
                'maintenance_notes': pr.maintenance_notes
            })
        return jsonify(data), 200
        
    elif request.method == 'POST':
        body = request.json
        # Check if room number already exists
        if PhysicalRoom.query.filter_by(room_number=body.get('room_number')).first():
            return jsonify({'message': f"Room {body.get('room_number')} already exists"}), 400
            
        new_room = PhysicalRoom(
            room_number=body.get('room_number'),
            room_type_id=body.get('room_type_id'),
            status=body.get('status', 'Available'),
            maintenance_notes=body.get('maintenance_notes', '')
        )
        db.session.add(new_room)
        
        # Log alert if room is in maintenance
        if new_room.status in ['Maintenance', 'Out of Service']:
            alert_msg = f"Room {new_room.room_number} is flagged for {new_room.status.lower()} today."
            if new_room.maintenance_notes:
                alert_msg += f" Note: {new_room.maintenance_notes}"
            db.session.add(Alert(type='maintenance', message=alert_msg))
            
        db.session.commit()
        return jsonify({'message': 'Physical room added successfully'}), 201

@api_bp.route('/admin/rooms/<int:room_id>', methods=['PUT', 'DELETE'])
@admin_required
def admin_room_detail(current_admin, room_id):
    room = PhysicalRoom.query.get_or_404(room_id)
    
    if request.method == 'PUT':
        body = request.json
        old_status = room.status
        room.room_number = body.get('room_number', room.room_number)
        room.room_type_id = body.get('room_type_id', room.room_type_id)
        room.status = body.get('status', room.status)
        room.maintenance_notes = body.get('maintenance_notes', room.maintenance_notes)
        
        # Trigger alert on maintenance status change
        if room.status != old_status and room.status in ['Maintenance', 'Out of Service']:
            alert_msg = f"Room {room.room_number} has been updated to {room.status.lower()}."
            if room.maintenance_notes:
                alert_msg += f" Note: {room.maintenance_notes}"
            db.session.add(Alert(type='maintenance', message=alert_msg))
            
        db.session.commit()
        return jsonify({'message': 'Room updated successfully'}), 200
        
    elif request.method == 'DELETE':
        db.session.delete(room)
        db.session.commit()
        return jsonify({'message': 'Room deleted successfully'}), 200

# ----------------- ROOM TYPES CRUD -----------------

@api_bp.route('/admin/room-types', methods=['GET', 'POST'])
@admin_required
def admin_room_types(current_admin):
    if request.method == 'GET':
        room_types = Room.query.all()
        data = []
        for r in room_types:
            data.append({
                'id': r.id,
                'name': r.name,
                'description': r.description,
                'price_per_night': r.price_per_night,
                'image_url': r.image_url,
                'features': r.features,
                'total_quantity': r.total_quantity
            })
        return jsonify(data), 200
        
    elif request.method == 'POST':
        body = request.json
        new_type = Room(
            name=body.get('name'),
            description=body.get('description', ''),
            price_per_night=float(body.get('price_per_night', 0.0)),
            image_url=body.get('image_url', '/images/room1.webp'),
            features=body.get('features', []),
            total_quantity=int(body.get('total_quantity', 10))
        )
        db.session.add(new_type)
        db.session.commit()
        return jsonify({'message': 'Room Type created successfully'}), 201

@api_bp.route('/admin/room-types/<int:type_id>', methods=['PUT', 'DELETE'])
@admin_required
def admin_room_type_detail(current_admin, type_id):
    r_type = Room.query.get_or_404(type_id)
    
    if request.method == 'PUT':
        body = request.json
        r_type.name = body.get('name', r_type.name)
        r_type.description = body.get('description', r_type.description)
        r_type.price_per_night = float(body.get('price_per_night', r_type.price_per_night))
        r_type.image_url = body.get('image_url', r_type.image_url)
        r_type.features = body.get('features', r_type.features)
        r_type.total_quantity = int(body.get('total_quantity', r_type.total_quantity))
        db.session.commit()
        return jsonify({'message': 'Room Type updated successfully'}), 200
        
    elif request.method == 'DELETE':
        db.session.delete(r_type)
        db.session.commit()
        return jsonify({'message': 'Room Type deleted successfully'}), 200

# ----------------- AMENITIES CRUD -----------------

@api_bp.route('/admin/amenities', methods=['GET', 'POST'])
@admin_required
def admin_amenities(current_admin):
    if request.method == 'GET':
        amenities = Amenity.query.all()
        data = []
        for a in amenities:
            data.append({
                'id': a.id,
                'name': a.name,
                'category': a.category,
                'icon_name': a.icon_name,
                'description': a.description,
                'status': a.status
            })
        return jsonify(data), 200
        
    elif request.method == 'POST':
        body = request.json
        new_amenity = Amenity(
            name=body.get('name'),
            category=body.get('category'),
            icon_name=body.get('icon_name'),
            description=body.get('description', ''),
            status=body.get('status', 'Active')
        )
        db.session.add(new_amenity)
        db.session.commit()
        return jsonify({'message': 'Amenity added successfully'}), 201

@api_bp.route('/admin/amenities/<int:amenity_id>', methods=['PUT', 'DELETE'])
@admin_required
def admin_amenity_detail(current_admin, amenity_id):
    amenity = Amenity.query.get_or_404(amenity_id)
    
    if request.method == 'PUT':
        body = request.json
        amenity.name = body.get('name', amenity.name)
        amenity.category = body.get('category', amenity.category)
        amenity.icon_name = body.get('icon_name', amenity.icon_name)
        amenity.description = body.get('description', amenity.description)
        amenity.status = body.get('status', amenity.status)
        db.session.commit()
        return jsonify({'message': 'Amenity updated successfully'}), 200
        
    elif request.method == 'DELETE':
        db.session.delete(amenity)
        db.session.commit()
        return jsonify({'message': 'Amenity deleted successfully'}), 200

# ----------------- BOOKINGS CRUD -----------------

@api_bp.route('/bookings', methods=['POST'])
@token_required
def create_booking(current_user):
    data = request.json
    today_str = datetime.utcnow().strftime("%Y-%m-%d")
    if data.get('check_in') and data.get('check_in') < today_str:
        return jsonify({'error': 'Cannot book past dates'}), 400
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
        # Try to auto-link Room Type if matching room name exists
        r_type = Room.query.filter_by(name=new_booking.room_name).first()
        if r_type:
            new_booking.room_id = r_type.id
            
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

@api_bp.route('/admin/bookings', methods=['GET', 'POST'])
@admin_required
def admin_bookings(current_admin):
    if request.method == 'GET':
        bookings = Booking.query.order_by(Booking.created_at.desc()).all()
        data = []
        for b in bookings:
            data.append({
                'id': b.id,
                'user_id': b.user_id,
                'guest_name': b.user.username if b.user else 'Unknown Guest',
                'guest_email': b.user.email if b.user else '',
                'guest_phone': b.user.phone if b.user else '',
                'room_id': b.room_id,
                'room_name': b.room_name,
                'physical_room_id': b.physical_room_id,
                'room_number': b.physical_room.room_number if b.physical_room else 'Not Assigned',
                'check_in': b.check_in,
                'check_out': b.check_out,
                'adults': b.adults,
                'children': b.children,
                'total_price': b.total_price,
                'status': b.status,
                'is_group': b.is_group,
                'group_name': b.group_name,
                'group_size': b.group_size,
                'created_at': b.created_at.isoformat()
            })
        return jsonify(data), 200
        
    elif request.method == 'POST':
        body = request.json
        today_str = datetime.utcnow().strftime("%Y-%m-%d")
        if body.get('check_in') and body.get('check_in') < today_str:
            return jsonify({'message': 'Cannot book past dates'}), 400
        # Create booking, possibly for a guest email
        guest_email = body.get('guest_email')
        guest = User.query.filter_by(email=guest_email).first()
        if not guest:
            # Create a mock/guest user profile if not exists
            guest = User(
                username=body.get('guest_name', 'Guest'),
                email=guest_email,
                password_hash=generate_password_hash('default123'),
                phone=body.get('guest_phone', ''),
                role='guest'
            )
            db.session.add(guest)
            db.session.flush()
            
        r_type = Room.query.get(body.get('room_id'))
        
        new_booking = Booking(
            user_id=guest.id,
            room_id=body.get('room_id'),
            room_name=r_type.name if r_type else body.get('room_name'),
            check_in=body.get('check_in'),
            check_out=body.get('check_out'),
            adults=int(body.get('adults', 1)),
            children=int(body.get('children', 0)),
            total_price=float(body.get('total_price', 0.0)),
            status=body.get('status', 'Confirmed'),
            is_group=body.get('is_group', False),
            group_name=body.get('group_name'),
            group_size=int(body.get('group_size', 1))
        )
        
        if body.get('physical_room_id'):
            new_booking.physical_room_id = body.get('physical_room_id')
            
        db.session.add(new_booking)
        db.session.commit()
        return jsonify({'message': 'Booking created successfully'}), 201

@api_bp.route('/admin/bookings/<int:booking_id>', methods=['PUT', 'DELETE'])
@admin_required
def admin_booking_detail(current_admin, booking_id):
    booking = Booking.query.get_or_404(booking_id)
    
    if request.method == 'PUT':
        body = request.json
        booking.room_id = body.get('room_id', booking.room_id)
        if body.get('room_id'):
            r_type = Room.query.get(body.get('room_id'))
            if r_type:
                booking.room_name = r_type.name
        booking.physical_room_id = body.get('physical_room_id', booking.physical_room_id)
        booking.check_in = body.get('check_in', booking.check_in)
        booking.check_out = body.get('check_out', booking.check_out)
        booking.adults = int(body.get('adults', booking.adults))
        booking.children = int(body.get('children', booking.children))
        booking.total_price = float(body.get('total_price', booking.total_price))
        booking.status = body.get('status', booking.status)
        booking.is_group = body.get('is_group', booking.is_group)
        booking.group_name = body.get('group_name', booking.group_name)
        booking.group_size = int(body.get('group_size', booking.group_size or 1))
        db.session.commit()
        return jsonify({'message': 'Booking updated successfully'}), 200
        
    elif request.method == 'DELETE':
        # Soft delete or hard cancel booking
        booking.status = 'Cancelled'
        if booking.physical_room:
            booking.physical_room.status = 'Available'
        db.session.commit()
        return jsonify({'message': 'Booking cancelled successfully'}), 200

# ----------------- WAITLIST & PROMOTION -----------------

@api_bp.route('/admin/waitlist', methods=['GET', 'POST'])
@admin_required
def admin_waitlist(current_admin):
    if request.method == 'GET':
        waitlist = Waitlist.query.order_by(Waitlist.created_at.desc()).all()
        data = []
        for w in waitlist:
            data.append({
                'id': w.id,
                'guest_name': w.guest_name,
                'email': w.email,
                'phone': w.phone,
                'room_type_id': w.room_type_id,
                'room_type_name': w.room_type.name if w.room_type else 'Unknown',
                'check_in': w.check_in,
                'check_out': w.check_out,
                'status': w.status,
                'created_at': w.created_at.isoformat()
            })
        return jsonify(data), 200
        
    elif request.method == 'POST':
        body = request.json
        new_waitlist = Waitlist(
            guest_name=body.get('guest_name'),
            email=body.get('email'),
            phone=body.get('phone', ''),
            room_type_id=body.get('room_type_id'),
            check_in=body.get('check_in'),
            check_out=body.get('check_out'),
            status='Waitlisted'
        )
        db.session.add(new_waitlist)
        db.session.commit()
        return jsonify({'message': 'Guest added to waitlist successfully'}), 201

@api_bp.route('/admin/waitlist/<int:waitlist_id>', methods=['PUT', 'DELETE'])
@admin_required
def admin_waitlist_detail(current_admin, waitlist_id):
    w = Waitlist.query.get_or_404(waitlist_id)
    if request.method == 'PUT':
        body = request.json
        w.guest_name = body.get('guest_name', w.guest_name)
        w.email = body.get('email', w.email)
        w.phone = body.get('phone', w.phone)
        w.room_type_id = body.get('room_type_id', w.room_type_id)
        w.check_in = body.get('check_in', w.check_in)
        w.check_out = body.get('check_out', w.check_out)
        w.status = body.get('status', w.status)
        db.session.commit()
        return jsonify({'message': 'Waitlist entry updated successfully'}), 200
    elif request.method == 'DELETE':
        db.session.delete(w)
        db.session.commit()
        return jsonify({'message': 'Waitlist entry deleted successfully'}), 200

@api_bp.route('/admin/waitlist/<int:waitlist_id>/promote', methods=['POST'])
@admin_required
def promote_waitlist(current_admin, waitlist_id):
    w = Waitlist.query.get_or_404(waitlist_id)
    
    # 1. Verify if room type exists
    r_type = Room.query.get(w.room_type_id)
    if not r_type:
        return jsonify({'message': 'Invalid room type'}), 400
        
    # 2. Check physical room availability
    # Look for physical rooms of this type that are Available and not booked during these dates
    overlapping_bookings = Booking.query.filter(
        Booking.room_id == w.room_type_id,
        Booking.check_in < w.check_out,
        Booking.check_out > w.check_in,
        Booking.status != 'Cancelled'
    ).all()
    
    booked_room_ids = [b.physical_room_id for b in overlapping_bookings if b.physical_room_id is not None]
    
    # Find first physical room of this type that is not booked and is Available
    avail_room = PhysicalRoom.query.filter(
        PhysicalRoom.room_type_id == w.room_type_id,
        PhysicalRoom.status == 'Available',
        ~PhysicalRoom.id.in_(booked_room_ids) if booked_room_ids else True
    ).first()
    
    if not avail_room:
        return jsonify({'message': 'No rooms of this type are currently available for the selected dates.'}), 400
        
    # 3. Create guest user profile if not exists
    guest = User.query.filter_by(email=w.email).first()
    if not guest:
        guest = User(
            username=w.guest_name,
            email=w.email,
            password_hash=generate_password_hash('default123'),
            phone=w.phone,
            role='guest'
        )
        db.session.add(guest)
        db.session.flush()
        
    # 4. Create booking
    # Calculate price based on price_per_night and checkin/checkout duration
    try:
        in_d = datetime.strptime(w.check_in, "%Y-%m-%d")
        out_d = datetime.strptime(w.check_out, "%Y-%m-%d")
        nights = max(1, (out_d - in_d).days)
    except:
        nights = 1
    total_price = r_type.price_per_night * nights
    
    new_booking = Booking(
        user_id=guest.id,
        room_id=r_type.id,
        room_name=r_type.name,
        physical_room_id=avail_room.id,
        check_in=w.check_in,
        check_out=w.check_out,
        adults=1,
        children=0,
        total_price=total_price,
        status='Confirmed'
    )
    
    db.session.add(new_booking)
    w.status = 'Confirmed'
    db.session.commit()
    
    return jsonify({'message': f'Guest successfully promoted to booking in Room {avail_room.room_number}!'}), 200

# ----------------- GUEST PROFILES & LOYALTY -----------------

@api_bp.route('/admin/guests', methods=['GET'])
@admin_required
def admin_guests(current_admin):
    guests = User.query.filter_by(role='guest').all()
    data = []
    for g in guests:
        # Calculate booking history details
        bookings_count = Booking.query.filter_by(user_id=g.id).count()
        bookings_list = []
        user_bookings = Booking.query.filter_by(user_id=g.id).order_by(Booking.check_in.desc()).all()
        for b in user_bookings:
            bookings_list.append({
                'id': b.id,
                'room_name': b.room_name,
                'check_in': b.check_in,
                'check_out': b.check_out,
                'total_price': b.total_price,
                'status': b.status
            })
            
        data.append({
            'id': g.id,
            'username': g.username,
            'email': g.email,
            'phone': g.phone or '',
            'loyalty_points': g.loyalty_points,
            'membership_tier': g.membership_tier,
            'bookings_count': bookings_count,
            'booking_history': bookings_list,
            'created_at': g.created_at.isoformat()
        })
    return jsonify(data), 200

@api_bp.route('/admin/guests/<int:guest_id>', methods=['PUT'])
@admin_required
def admin_guest_update(current_admin, guest_id):
    g = User.query.get_or_404(guest_id)
    body = request.json
    
    g.username = body.get('username', g.username)
    g.email = body.get('email', g.email)
    g.phone = body.get('phone', g.phone)
    g.loyalty_points = int(body.get('loyalty_points', g.loyalty_points))
    g.membership_tier = body.get('membership_tier', g.membership_tier)
    
    db.session.commit()
    return jsonify({'message': 'Guest profile updated successfully'}), 200

# ----------------- REVIEWS MODERATION -----------------

@api_bp.route('/reviews', methods=['GET'])
def get_reviews():
    # Only return approved reviews to guests
    reviews = Review.query.filter_by(status='Approved').order_by(Review.created_at.desc()).all()
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
            text=data.get('text'),
            status='Pending' # New reviews default to Pending for moderation
        )
        db.session.add(new_review)
        db.session.commit()
        return jsonify({'message': 'Review submitted. It will appear once approved.'}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 400

@api_bp.route('/admin/reviews', methods=['GET'])
@admin_required
def admin_reviews(current_admin):
    reviews = Review.query.order_by(Review.created_at.desc()).all()
    data = []
    for r in reviews:
        data.append({
            'id': r.id,
            'name': r.name,
            'rating': r.rating,
            'date_string': r.date_string,
            'text': r.text,
            'status': r.status,
            'created_at': r.created_at.isoformat()
        })
    return jsonify(data), 200

@api_bp.route('/admin/reviews/<int:review_id>', methods=['PUT', 'DELETE'])
@admin_required
def admin_review_moderate(current_admin, review_id):
    review = Review.query.get_or_404(review_id)
    if request.method == 'PUT':
        body = request.json
        review.status = body.get('status', review.status) # 'Approved' / 'Rejected'
        db.session.commit()
        return jsonify({'message': f'Review status updated to {review.status}'}), 200
    elif request.method == 'DELETE':
        db.session.delete(review)
        db.session.commit()
        return jsonify({'message': 'Review deleted successfully'}), 200

# ----------------- CHECK-IN / CHECK-OUT FLOWS -----------------

@api_bp.route('/admin/check-in/today', methods=['GET'])
@admin_required
def get_today_checkins(current_admin):
    today_str = datetime.utcnow().strftime("%Y-%m-%d")
    # Fetch all bookings checking in today that are Confirmed/Paid (not checked-in yet, and not cancelled)
    bookings = Booking.query.filter(
        Booking.check_in == today_str,
        Booking.status.in_(['Paid', 'Confirmed', 'Pending'])
    ).all()
    
    data = []
    for b in bookings:
        # Find available physical rooms for this booking's room type
        avail_rooms = PhysicalRoom.query.filter_by(
            room_type_id=b.room_id, 
            status='Available'
        ).all()
        avail_room_list = [{'id': r.id, 'room_number': r.room_number} for r in avail_rooms]
        
        data.append({
            'id': b.id,
            'guest_name': b.user.username if b.user else 'Unknown',
            'room_type_name': b.room_name,
            'check_in': b.check_in,
            'check_out': b.check_out,
            'status': b.status,
            'available_physical_rooms': avail_room_list
        })
    return jsonify(data), 200

@api_bp.route('/admin/check-in/process', methods=['POST'])
@admin_required
def process_checkin(current_admin):
    body = request.json
    booking_id = body.get('booking_id')
    physical_room_id = body.get('physical_room_id')
    
    booking = Booking.query.get_or_404(booking_id)
    room = PhysicalRoom.query.get_or_404(physical_room_id)
    
    if room.status != 'Available':
        return jsonify({'message': f'Room {room.room_number} is currently {room.status}'}), 400
        
    booking.physical_room_id = room.id
    booking.status = 'Checked In'
    room.status = 'Occupied'
    
    db.session.commit()
    return jsonify({'message': f'Checked in guest to Room {room.room_number} successfully'}), 200

@api_bp.route('/admin/check-out/today', methods=['GET'])
@admin_required
def get_today_checkouts(current_admin):
    today_str = datetime.utcnow().strftime("%Y-%m-%d")
    # Fetch all bookings checking out today or checked in bookings
    bookings = Booking.query.filter(
        Booking.status == 'Checked In'
    ).all()
    
    data = []
    for b in bookings:
        # Calculate dynamic details
        data.append({
            'id': b.id,
            'guest_name': b.user.username if b.user else 'Unknown',
            'room_type_name': b.room_name,
            'room_number': b.physical_room.room_number if b.physical_room else 'Unassigned',
            'check_in': b.check_in,
            'check_out': b.check_out,
            'total_price': b.total_price,
            'status': b.status
        })
    return jsonify(data), 200

@api_bp.route('/admin/check-out/process', methods=['POST'])
@admin_required
def process_checkout(current_admin):
    body = request.json
    booking_id = body.get('booking_id')
    flag_maintenance = body.get('flag_maintenance', False)
    maintenance_notes = body.get('maintenance_notes', '')
    
    booking = Booking.query.get_or_404(booking_id)
    room = booking.physical_room
    
    # 1. Update Booking status to Checked Out
    booking.status = 'Checked Out'
    
    # 2. Update Physical Room status (either Available or Maintenance)
    if room:
        if flag_maintenance:
            room.status = 'Maintenance'
            room.maintenance_notes = maintenance_notes or 'Post-checkout inspection required'
            # Add alert
            db.session.add(Alert(
                type='maintenance',
                message=f"Room {room.room_number} flagged for maintenance post-checkout. Note: {room.maintenance_notes}"
            ))
        else:
            room.status = 'Available'
            room.maintenance_notes = ''
            
    # 3. Award loyalty points (1 point per dollar spent)
    if booking.user:
        booking.user.loyalty_points += int(booking.total_price * 0.1) # 10% points back
        # Update membership tier dynamically
        pts = booking.user.loyalty_points
        if pts >= 1000:
            booking.user.membership_tier = 'Platinum'
        elif pts >= 500:
            booking.user.membership_tier = 'Gold'
        else:
            booking.user.membership_tier = 'Silver'
            
    db.session.commit()
    return jsonify({'message': f'Checked out guest from Room {room.room_number if room else "Unassigned"} successfully'}), 200

# ----------------- CONTACT AND ALERTS CRUD -----------------

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

@api_bp.route('/admin/alerts', methods=['GET', 'POST'])
@admin_required
def admin_alerts(current_admin):
    if request.method == 'GET':
        alerts = Alert.query.order_by(Alert.created_at.desc()).all()
        data = [{'id': a.id, 'type': a.type, 'message': a.message, 'status': a.status, 'created_at': a.created_at.isoformat()} for a in alerts]
        return jsonify(data), 200
    elif request.method == 'POST':
        body = request.json
        new_alert = Alert(
            type=body.get('type', 'system'),
            message=body.get('message'),
            status='active'
        )
        db.session.add(new_alert)
        db.session.commit()
        return jsonify({'message': 'Alert created successfully'}), 201

@api_bp.route('/admin/alerts/<int:alert_id>', methods=['PUT', 'DELETE'])
@admin_required
def admin_alert_detail(current_admin, alert_id):
    alert = Alert.query.get_or_404(alert_id)
    if request.method == 'PUT':
        body = request.json
        alert.status = body.get('status', alert.status)
        db.session.commit()
        return jsonify({'message': 'Alert updated successfully'}), 200
    elif request.method == 'DELETE':
        db.session.delete(alert)
        db.session.commit()
        return jsonify({'message': 'Alert deleted successfully'}), 200
