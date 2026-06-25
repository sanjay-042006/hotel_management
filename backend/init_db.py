from app import app
from models import db, Room, User, Review, PhysicalRoom, Booking, Waitlist, Amenity, Alert
from werkzeug.security import generate_password_hash
from datetime import datetime, timedelta

def init_database():
    with app.app_context():
        # Drop all tables to reset schema
        print("Dropping all existing database tables...")
        db.drop_all()
        print("Creating all tables from current models...")
        db.create_all()

        # 1. Seed Room Types (Room table)
        print("Seeding Room Types...")
        rooms = [
            Room(
                name="Deluxe City View",
                description="Spacious room with panoramic city views, king-size bed, and premium furnishings designed for ultimate rest.",
                price_per_night=189.0,
                image_url="/images/room1.webp",
                features=["King Bed", "Free WiFi", "City View", "Bathtub"],
                total_quantity=10
            ),
            Room(
                name="Executive Suite",
                description="A separate living area, work desk, and lounge — perfect for business travellers who demand both comfort and function.",
                price_per_night=320.0,
                image_url="/images/room2.webp",
                features=["King Bed", "Kitchenette", "Lounge Area", "Smart TV"],
                total_quantity=10
            ),
            Room(
                name="Presidential Suite",
                description="The pinnacle of ATLAS luxury — a full-floor suite with private terrace, butler service, and unmatched skyline views.",
                price_per_night=890.0,
                image_url="/images/room3.webp",
                features=["2 Bedrooms", "Butler", "Skyline View", "Jacuzzi"],
                total_quantity=5
            )
        ]
        db.session.bulk_save_objects(rooms)
        db.session.commit()

        # Fetch rooms to get their IDs
        room_types = {r.name: r for r in Room.query.all()}
        deluxe_id = room_types["Deluxe City View"].id
        executive_id = room_types["Executive Suite"].id
        presidential_id = room_types["Presidential Suite"].id

        # 2. Seed Physical Rooms
        print("Seeding Physical Rooms...")
        p_rooms = [
            # Deluxe City View (100s)
            PhysicalRoom(room_number="101", room_type_id=deluxe_id, status="Available"),
            PhysicalRoom(room_number="102", room_type_id=deluxe_id, status="Available"),
            PhysicalRoom(room_number="103", room_type_id=deluxe_id, status="Available"),
            PhysicalRoom(room_number="104", room_type_id=deluxe_id, status="Available"),
            PhysicalRoom(room_number="105", room_type_id=deluxe_id, status="Occupied"),
            PhysicalRoom(room_number="106", room_type_id=deluxe_id, status="Occupied"),
            PhysicalRoom(room_number="107", room_type_id=deluxe_id, status="Reserved"),
            # Executive Suite (200s)
            PhysicalRoom(room_number="201", room_type_id=executive_id, status="Available"),
            PhysicalRoom(room_number="202", room_type_id=executive_id, status="Occupied"),
            PhysicalRoom(room_number="203", room_type_id=executive_id, status="Reserved"),
            PhysicalRoom(room_number="204", room_type_id=executive_id, status="Maintenance", maintenance_notes="HVAC inspector flagged compressor replacement today."),
            PhysicalRoom(room_number="205", room_type_id=executive_id, status="Available"),
            # Presidential Suite (300s)
            PhysicalRoom(room_number="301", room_type_id=presidential_id, status="Available"),
            PhysicalRoom(room_number="302", room_type_id=presidential_id, status="Occupied"),
            PhysicalRoom(room_number="303", room_type_id=presidential_id, status="Out of Service", maintenance_notes="Ceiling wallpaper repair project active.")
        ]
        db.session.bulk_save_objects(p_rooms)
        db.session.commit()

        # Fetch physical rooms
        physical_rooms_dict = {pr.room_number: pr for pr in PhysicalRoom.query.all()}

        # 3. Seed Users (Guest and Admin)
        print("Seeding Admin and Guest users...")
        hashed_admin_pwd = generate_password_hash("123", method='pbkdf2:sha256')
        hashed_guest_pwd = generate_password_hash("password123", method='pbkdf2:sha256')

        users = [
            # Admins
            User(username="admin", email="admin@atlas.com", password_hash=hashed_admin_pwd, role="admin", phone="+1 (555) 019-2834"),
            # Guests
            User(username="testuser", email="test@example.com", password_hash=hashed_guest_pwd, role="guest", phone="+1 (555) 123-4567", loyalty_points=120, membership_tier="Silver"),
            User(username="Priya Nair", email="priya@example.com", password_hash=hashed_guest_pwd, role="guest", phone="+91 98765 43210", loyalty_points=1250, membership_tier="Platinum"),
            User(username="James O'Brien", email="james@example.com", password_hash=hashed_guest_pwd, role="guest", phone="+353 1 496 0123", loyalty_points=650, membership_tier="Gold"),
            User(username="Liu Wei", email="liu@example.com", password_hash=hashed_guest_pwd, role="guest", phone="+86 10 6519 7114", loyalty_points=340, membership_tier="Silver"),
            User(username="Sara Malik", email="sara@example.com", password_hash=hashed_guest_pwd, role="guest", phone="+971 4 321 4321", loyalty_points=1800, membership_tier="Platinum"),
            User(username="Ravi Kumar", email="ravi@example.com", password_hash=hashed_guest_pwd, role="guest", phone="+91 98888 77777", loyalty_points=950, membership_tier="Gold"),
            User(username="David Miller", email="david@example.com", password_hash=hashed_guest_pwd, role="guest", phone="+1 (555) 765-4321", loyalty_points=0, membership_tier="Silver")
        ]
        db.session.bulk_save_objects(users)
        db.session.commit()

        # Fetch guests
        guests_dict = {u.username: u for u in User.query.filter_by(role='guest').all()}

        # 4. Seed Bookings
        # Today's date in local system is 2026-06-23
        print("Seeding Booking history and active records...")
        today = datetime(2026, 6, 23)
        today_str = today.strftime("%Y-%m-%d")
        tomorrow_str = (today + timedelta(days=1)).strftime("%Y-%m-%d")
        yesterday_str = (today - timedelta(days=1)).strftime("%Y-%m-%d")
        three_days_ago_str = (today - timedelta(days=3)).strftime("%Y-%m-%d")
        four_days_later_str = (today + timedelta(days=4)).strftime("%Y-%m-%d")

        bookings = [
            # Check-ins today
            Booking(
                user_id=guests_dict["Priya Nair"].id,
                room_id=deluxe_id,
                room_name="Deluxe City View",
                physical_room_id=physical_rooms_dict["107"].id,
                check_in=today_str,
                check_out=tomorrow_str,
                adults=2,
                children=0,
                total_price=189.0,
                status="Confirmed"
            ),
            Booking(
                user_id=guests_dict["James O'Brien"].id,
                room_id=deluxe_id,
                room_name="Deluxe City View",
                physical_room_id=None,
                check_in=today_str,
                check_out=four_days_later_str,
                adults=1,
                children=0,
                total_price=756.0,
                status="Confirmed"
            ),
            # Check-outs today (already Checked In, leaving today)
            Booking(
                user_id=guests_dict["Ravi Kumar"].id,
                room_id=executive_id,
                room_name="Executive Suite",
                physical_room_id=physical_rooms_dict["202"].id,
                check_in=three_days_ago_str,
                check_out=today_str,
                adults=2,
                children=1,
                total_price=960.0,
                status="Checked In"
            ),
            # Already Checked In (staying longer)
            Booking(
                user_id=guests_dict["Sara Malik"].id,
                room_id=deluxe_id,
                room_name="Deluxe City View",
                physical_room_id=physical_rooms_dict["105"].id,
                check_in=yesterday_str,
                check_out=tomorrow_str,
                adults=2,
                children=0,
                total_price=378.0,
                status="Checked In"
            ),
            Booking(
                user_id=guests_dict["Liu Wei"].id,
                room_id=presidential_id,
                room_name="Presidential Suite",
                physical_room_id=physical_rooms_dict["302"].id,
                check_in=yesterday_str,
                check_out=four_days_later_str,
                adults=2,
                children=2,
                total_price=4450.0,
                status="Checked In"
            ),
            # Group Booking
            Booking(
                user_id=guests_dict["testuser"].id,
                room_id=executive_id,
                room_name="Executive Suite",
                physical_room_id=physical_rooms_dict["203"].id,
                check_in=tomorrow_str,
                check_out=four_days_later_str,
                adults=6,
                children=0,
                total_price=2880.0,
                status="Confirmed",
                is_group=True,
                group_name="MenThee Tech Retreat",
                group_size=6
            )
        ]
        db.session.bulk_save_objects(bookings)
        db.session.commit()

        # Update physical room statuses based on bookings
        physical_rooms_dict["105"].status = "Occupied"
        physical_rooms_dict["302"].status = "Occupied"
        physical_rooms_dict["202"].status = "Occupied"
        physical_rooms_dict["107"].status = "Reserved"
        physical_rooms_dict["203"].status = "Reserved"
        db.session.commit()

        # 5. Seed Waitlist
        print("Seeding Waitlist records...")
        waitlists = [
            Waitlist(
                guest_name="David Miller",
                email="david@example.com",
                phone="+1 (555) 765-4321",
                room_type_id=deluxe_id,
                check_in=today_str,
                check_out=tomorrow_str,
                status="Waitlisted"
            ),
            Waitlist(
                guest_name="Sophia Loren",
                email="sophia@example.com",
                phone="+39 06 123456",
                room_type_id=presidential_id,
                check_in=tomorrow_str,
                check_out=four_days_later_str,
                status="Waitlisted"
            )
        ]
        db.session.bulk_save_objects(waitlists)

        # 6. Seed Amenities
        print("Seeding Amenities Setup...")
        amenities = [
            Amenity(name="Ultra High-Speed Wi-Fi", category="Facilities", icon_name="Wifi", description="Complimentary gigabit wireless internet available hotel-wide.", status="Active"),
            Amenity(name="Infinity Rooftop Pool", category="Wellness", icon_name="Waves", description="Heated outdoor pool with full panorama deck and loungers.", status="Active"),
            Amenity(name="ATLAS Sanctuary Spa", category="Wellness", icon_name="Flower", description="Premium wellness spa offering therapeutic massages and facials.", status="Active"),
            Amenity(name="24/7 Fitness Center", category="Wellness", icon_name="Dumbbell", description="Equipped with state-of-the-art cardio machines, free weights, and stretching zones.", status="Active"),
            Amenity(name="Fine Dining Restaurant", category="Dining", icon_name="Utensils", description="Michelin-starred fine dining featuring contemporary gourmet menus.", status="Active"),
            Amenity(name="Private Valet Parking", category="Facilities", icon_name="Car", description="Secure, indoor underground parking with full valet services.", status="Active"),
            Amenity(name="Business Lounge", category="Business", icon_name="Briefcase", description="Equipped with conference desks, printing stations, and coffee bars.", status="Active")
        ]
        db.session.bulk_save_objects(amenities)

        # 7. Seed Reviews
        print("Seeding Reviews and Moderation states...")
        reviews = [
            Review(
                name="Sarah Jenkins",
                rating=5,
                date_string="October 2025",
                text="Absolutely stunning experience from start to finish. The Presidential Suite exceeded all expectations and the staff was incredibly attentive to our every need. Will definitely return!",
                status="Approved"
            ),
            Review(
                name="Michael Chen",
                rating=5,
                date_string="August 2025",
                text="The fine dining restaurant is out of this world. We stayed in the Executive Suite for a business trip and found it perfectly equipped. The rooftop pool offers breathtaking views.",
                status="Approved"
            ),
            Review(
                name="Emma Thompson",
                rating=4,
                date_string="July 2025",
                text="Beautiful property with exceptional amenities. The spa services were top-notch. Only giving 4 stars because the valet took a little longer than expected during peak hours, but overall a wonderful stay.",
                status="Approved"
            ),
            Review(
                name="John Doe",
                rating=2,
                date_string="June 2026",
                text="AC was not working properly in Room 204. Had to request maintenance multiple times. Rest of the hotel was okay, but disappointed with the response time.",
                status="Pending" # Pending moderation review
            )
        ]
        db.session.bulk_save_objects(reviews)

        # 8. Seed Alerts
        print("Seeding Admin Notifications & Alerts...")
        alerts = [
            Alert(
                type="maintenance",
                message="Maintenance Alert: Room 204 is flagged for HVAC inspection today. Coordinate with Engineering.",
                status="active"
            ),
            Alert(
                type="booking",
                message="3 pending online bookings awaiting approval. Review now ->",
                status="active"
            )
        ]
        db.session.bulk_save_objects(alerts)

        db.session.commit()
        print("Database creation and seeding finished successfully.")

if __name__ == '__main__':
    init_database()
