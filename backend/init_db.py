from app import app
from models import db, Room, User, Review
from werkzeug.security import generate_password_hash

def init_database():
    with app.app_context():
        # Drop all tables to reset schema
        db.drop_all()
        db.create_all()

        # Seed rooms
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
                total_quantity=10
            )
        ]
        db.session.bulk_save_objects(rooms)
        
        # Seed reviews
        reviews = [
            Review(
                name="Sarah Jenkins",
                rating=5,
                date_string="October 2025",
                text="Absolutely stunning experience from start to finish. The Presidential Suite exceeded all expectations and the staff was incredibly attentive to our every need. Will definitely return!"
            ),
            Review(
                name="Michael Chen",
                rating=5,
                date_string="August 2025",
                text="The fine dining restaurant is out of this world. We stayed in the Executive Suite for a business trip and found it perfectly equipped. The rooftop pool offers breathtaking views."
            ),
            Review(
                name="Emma Thompson",
                rating=4,
                date_string="July 2025",
                text="Beautiful property with exceptional amenities. The spa services were top-notch. Only giving 4 stars because the valet took a little longer than expected during peak hours, but overall a wonderful stay."
            )
        ]
        db.session.bulk_save_objects(reviews)

        # Create a test user
        hashed_password = generate_password_hash("password123", method='pbkdf2:sha256')
        test_user = User(username="testuser", email="test@example.com", password_hash=hashed_password)
        db.session.add(test_user)
        
        db.session.commit()
        print("Database schema reset and seeded with rooms and test user (test@example.com / password123).")

if __name__ == '__main__':
    init_database()
