# 🏨 Hotel Management System

A full-stack Hotel Management web application with a customer-facing booking site and a dedicated admin panel for hotel staff.

**🌐 Live Site:** [https://hotel-management-liard-five.vercel.app/](https://hotel-management-liard-five.vercel.app/)  
**📁 GitHub Repo:** [https://github.com/sanjay-042006/hotel_management](https://github.com/sanjay-042006/hotel_management)

---

## 📌 Project Overview

This system serves two audiences:

- **Guests** — Browse rooms, make bookings, and submit reviews (authentication required for reviews)
- **Admins** — Manage rooms, view bookings, and oversee hotel operations via a dedicated admin panel

---

## 🚀 Features

### Customer Site
- Browse available rooms with details (type, price, amenities)
- Room booking with date selection
- User registration and login (JWT-based authentication)
- Submit and view reviews — **only authenticated users can post reviews**
- Responsive design for mobile and desktop

### Admin Panel
- Secure admin login
- Manage rooms (add, edit, delete)
- View and manage all bookings
- Oversee customer reviews
- Dashboard with key hotel metrics

---

## 🛠️ Tech Stack

### Frontend
| Layer | Technology |
|---|---|
| Framework | React.js |
| Routing | React Router DOM |
| HTTP Client | Axios |
| Styling | CSS |
| Deployment | **Vercel** |

### Backend
| Layer | Technology |
|---|---|
| Framework | **Flask** (Python) |
| Authentication | JWT (`Flask-JWT-Extended`) |
| Database | **PostgreSQL** |
| ORM | SQLAlchemy (`Flask-SQLAlchemy`) |
| Migrations | Flask-Migrate (Alembic) |
| CORS | Flask-CORS |
| Deployment | **Render** |

---

## 📁 Project Structure

```
hotel_management/
│
├── frontend/                  # React app → deployed on Vercel
│   ├── public/
│   ├── src/
│   │   ├── components/        # Reusable UI components
│   │   ├── pages/             # Route-level pages (Home, Rooms, Booking, etc.)
│   │   ├── context/           # Auth context / global state
│   │   ├── api/               # Axios API call handlers
│   │   └── App.jsx
│   ├── .env
│   └── package.json
│
├── backend/                   # Flask app → deployed on Render
│   ├── app/
│   │   ├── __init__.py        # App factory
│   │   ├── models.py          # Room, Booking, Review, User models (SQLAlchemy)
│   │   ├── routes/
│   │   │   ├── auth.py        # Register, login, token refresh
│   │   │   ├── rooms.py       # Room CRUD
│   │   │   ├── bookings.py    # Booking endpoints
│   │   │   └── reviews.py     # Review endpoints (auth-gated POST)
│   │   └── config.py
│   ├── migrations/            # Alembic migration files
│   ├── run.py
│   ├── .env
│   └── requirements.txt
│
└── .gitignore
```

---

## ⚙️ Getting Started

### Prerequisites
- Node.js >= 18
- Python >= 3.10
- PostgreSQL

---

### 1. Clone the Repository

```bash
git clone https://github.com/sanjay-042006/hotel_management.git
cd hotel_management
```

---

### 2. Backend Setup (Flask)

```bash
cd backend
python -m venv venv
source venv/bin/activate       # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

Create a `.env` file inside `/backend`:

```env
SECRET_KEY=your_secret_key
JWT_SECRET_KEY=your_jwt_secret_key
DATABASE_URL=postgresql://user:password@localhost:5432/hotel_db
FLASK_ENV=development
```

Run migrations and start the server:

```bash
flask db upgrade
flask run
```

Backend runs at: `http://localhost:5000`

---

### 3. Frontend Setup (React)

```bash
cd frontend
npm install
npm run dev
```

Create a `.env` file inside `/frontend`:

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

Frontend runs at: `http://localhost:5173`

---

## 🔐 Authentication

- JWT tokens are issued on login via `Flask-JWT-Extended`
- Access token is stored on the frontend (localStorage)
- Refresh token handles session persistence
- Review submission is auth-gated — unauthenticated POST requests to `/api/reviews/` return `401 Unauthorized`

### Key permission logic (Flask):

```python
from flask_jwt_extended import jwt_required, get_jwt_identity

@reviews_bp.route('/api/reviews/', methods=['POST'])
@jwt_required()
def create_review():
    current_user_id = get_jwt_identity()
    data = request.get_json()
    review = Review(
        user_id=current_user_id,
        content=data['content'],
        rating=data['rating']
    )
    db.session.add(review)
    db.session.commit()
    return jsonify(review.to_dict()), 201
```

---

## 🌐 API Endpoints

| Method | Endpoint | Auth Required | Description |
|---|---|---|---|
| GET | `/api/rooms/` | No | List all rooms |
| GET | `/api/rooms/<id>` | No | Room detail |
| POST | `/api/bookings/` | Yes | Create a booking |
| GET | `/api/bookings/` | Yes | List user bookings |
| GET | `/api/reviews/` | No | List all reviews |
| POST | `/api/reviews/` | **Yes** | Submit a review |
| POST | `/api/auth/register` | No | Register new user |
| POST | `/api/auth/login` | No | Login and get JWT |
| POST | `/api/auth/refresh` | No | Refresh JWT token |

---

## 🖥️ Deployment

### Frontend → Vercel
- Connected to the `frontend/` folder in this GitHub repository
- Auto-deploys on every push to `main`
- Set environment variable in Vercel dashboard:
  ```
  VITE_API_BASE_URL=https://your-render-backend-url.onrender.com/api
  ```

### Backend → Render
- Connected to the `backend/` folder in this GitHub repository
- Auto-deploys on every push to `main`
- Set environment variables in Render dashboard:
  ```
  DATABASE_URL=your_postgresql_connection_string
  SECRET_KEY=your_secret_key
  JWT_SECRET_KEY=your_jwt_secret_key
  ```
- **Start command:** `gunicorn run:app`
- PostgreSQL database provisioned via **Render's managed PostgreSQL** or an external provider (e.g. Supabase, Neon)

---

## 📦 Backend Dependencies (`requirements.txt`)

```
Flask
Flask-JWT-Extended
Flask-SQLAlchemy
Flask-Migrate
Flask-CORS
psycopg2-binary
python-decouple
gunicorn
```

---

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch:
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. Commit your changes:
   ```bash
   git commit -m "Add: your feature description"
   ```
4. Push to the branch:
   ```bash
   git push origin feature/your-feature-name
   ```
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License.

---

## 👤 Author

Built by **Sanjay** — CS & IT undergraduate passionate about full-stack web development.

- GitHub: [@sanjay-042006](https://github.com/sanjay-042006)
