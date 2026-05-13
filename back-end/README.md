# Agrivita Smart Agriculture Backend

FastAPI-based backend for AI-powered crop disease and pest identification. Built with **FastAPI**, **Groq AI**, **SQLAlchemy**, and integrates with **Kindwise APIs** for advanced image analysis.

## Features

- 🔐 **Phone-based Authentication** - Register/login using phone number
- 📸 **AI Image Analysis** - Identify crop diseases and insects with confidence scores
- 👤 **User Profiles** - Complete farmer profiles with farm details and preferences
- 🌤️ **Weather Integration Ready** - Support for weather API integration
- 📊 **JWT Token Management** - Secure access and refresh tokens
- 🗄️ **Database Migrations** - Alembic for schema management
- ⚡ **Fast & Async** - Built with async/await for optimal performance

## Tech Stack

- **Framework**: FastAPI 0.136+
- **Database**: PostgreSQL (with psycopg2)
- **ORM**: SQLAlchemy
- **Auth**: JWT (python-jose) + bcrypt
- **AI APIs**: Groq (llama-3.1), Kindwise (Crop.health & Insect.id)
- **Migration**: Alembic

## Quick Start

### Prerequisites
- Python 3.14+
- PostgreSQL
- pip (or poetry)

### Installation

1. **Clone and setup virtual environment:**
```bash
cd back-end
python -m venv .venv
.venv\Scripts\activate  # Windows
# or
source .venv/bin/activate  # Linux/Mac
```

2. **Install dependencies:**
```bash
pip install -r requirements.txt
# or with poetry
poetry install
```

3. **Create `.env` file:**
```env
DATABASE_URL=postgresql://user:password@localhost/agrivita
SECRET_KEY=your-secret-key-change-in-production
INSECT_ID=your-kindwise-insect-api-key
CROP_HEALTH=your-kindwise-crop-api-key
GROQ_API_KEY=your-groq-api-key
```

4. **Initialize database:**
```bash
alembic upgrade head
```

5. **Run the server:**
```bash
python main.py
# or
uvicorn main:app --reload
```

The API will be available at `http://localhost:8000`
API docs: `http://localhost:8000/docs`

## API Endpoints

### Authentication

#### `POST /register`
Register a new user with phone number and password.

**Request:**
```json
{
  "phone_number": "+251912345678",
  "password": "secure_password"
}
```

**Response:**
```json
{
  "access_token": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "refresh_token": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "token_type": "bearer"
}
```

#### `POST /login`
Login with phone number and password.

**Request:**
```json
{
  "phone_number": "+251912345678",
  "password": "secure_password"
}
```

**Response:** Same as `/register`

---

### Profile Management

#### `GET /profile`
Get current user's profile information.

**Headers:**
```
Authorization: Bearer {access_token}
```

**Response:**
```json
{
  "phone_number": "+251912345678",
  "full_name": "Abebe Kebede",
  "national_id": "ID123456",
  "country": "Ethiopia",
  "preferred_language": "English",
  "farm_location": "Addis Ababa",
  "field_size": 2.5,
  "planting_date": "2024-03-15",
  "main_crops": ["wheat", "maize"],
  "avatar_url": "/uploads/avatar_1.jpg",
  "farm_image_url": "/uploads/farm_1.jpg",
  "profile_complete": 75
}
```

#### `PUT /profile`
Update user profile information.

**Headers:**
```
Authorization: Bearer {access_token}
Content-Type: application/json
```

**Request:**
```json
{
  "full_name": "Abebe Kebede",
  "phone_number": "+251912345678",
  "farm_location": "Addis Ababa",
  "field_size": 2.5,
  "main_crops": ["wheat", "maize"]
}
```

**Response:** Updated profile (same as GET /profile)

#### `POST /profile/avatar`
Upload user avatar/profile picture.

**Headers:**
```
Authorization: Bearer {access_token}
Content-Type: multipart/form-data
```

**Form Fields:**
- `file`: Image file (jpg, png, etc.)

---

### Image Analysis

#### `POST /analyze`
Analyze crop disease or identify insects in uploaded images.

**Headers:**
```
Authorization: Bearer {access_token}
Content-Type: multipart/form-data
```

**Form Fields:**
- `type`: `"disease"` or `"insect"` (required)
- `file`: Image file (preferred) OR
- `image`: Base64 encoded image or public URL

Use either `file` OR `image`, not both.

**Response:**
```json
{
  "type": "disease",
  "data": {
    "disease": "Early Blight",
    "description": "Early Blight is a fungal disease caused by Alternaria solani...",
    "solution": "Remove infected leaves, improve air circulation, apply fungicide..."
  }
}
```

---

## Database Schema

### Users Table
```
- id: Integer (PK)
- phone_number: String (UNIQUE, REQUIRED)
- password: String (REQUIRED, hashed with bcrypt)
- full_name: String
- email: String (optional)
- national_id: String
- country: String
- preferred_language: String (default: "English")
- farm_location: String
- field_size: Float
- planting_date: String
- main_crops: JSON Array
- avatar_url: String
- farm_image_url: String
- id_document_url: String
- created_at: DateTime (auto)
- updated_at: DateTime (auto)
```

---

## Authentication Flow

1. **Register**: User provides phone number and password → Password is hashed with bcrypt → User created in DB → JWT tokens generated
2. **Login**: User provides phone number and password → Password verified → JWT tokens generated
3. **Protected Endpoints**: Client includes `Authorization: Bearer {access_token}` → Server validates token → Returns user data

### Token Details
- **Access Token**: Expires in 2 days
- **Refresh Token**: Expires in 5 days
- **Algorithm**: HS256

---

## Environment Variables

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | PostgreSQL connection string |
| `SECRET_KEY` | Secret key for JWT encoding (change in production!) |
| `INSECT_ID` | Kindwise Insect.id API key |
| `CROP_HEALTH` | Kindwise Crop.health API key |
| `GROQ_API_KEY` | Groq API key for AI analysis |

---

## Database Migrations

Create a new migration:
```bash
alembic revision --autogenerate -m "Description of changes"
```

Apply migrations:
```bash
alembic upgrade head
```

Rollback migrations:
```bash
alembic downgrade -1
```

---

## Development

### Running in debug mode:
```bash
uvicorn main:app --reload --log-level debug
```

### Database reset (development only):
```bash
alembic downgrade base
alembic upgrade head
```

### Testing an endpoint with curl:
```bash
# Register
curl -X POST http://localhost:8000/register \
  -H "Content-Type: application/json" \
  -d '{"phone_number": "+251912345678", "password": "test123"}'

# Login
curl -X POST http://localhost:8000/login \
  -H "Content-Type: application/json" \
  -d '{"phone_number": "+251912345678", "password": "test123"}'

# Get Profile
curl -X GET http://localhost:8000/profile \
  -H "Authorization: Bearer {access_token}"
```

---

## API Response Codes

| Code | Meaning |
|------|---------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request |
| 401 | Unauthorized (invalid/expired token) |
| 404 | Not Found |
| 500 | Server Error |

---

## Production Deployment

1. Set `SECRET_KEY` to a strong random value
2. Use PostgreSQL (not SQLite)
3. Enable HTTPS only
4. Set `CORS` origins to frontend domain only
5. Use environment-based configuration
6. Run with production ASGI server (Gunicorn + Uvicorn)

```bash
gunicorn -w 4 -k uvicorn.workers.UvicornWorker main:app
```

---

## Troubleshooting

### "Database connection failed"
- Verify PostgreSQL is running
- Check `DATABASE_URL` in `.env`
- Ensure credentials are correct

### "Invalid or expired token"
- Access token may have expired (2 days)
- Use refresh token to get new access token
- Clear browser cache and re-login

### "API key errors"
- Verify `INSECT_ID`, `CROP_HEALTH`, `GROQ_API_KEY` in `.env`
- Check API limits haven't been exceeded

---

## License

MIT License - See LICENSE file

## Support

For issues or questions, please open a GitHub issue.
