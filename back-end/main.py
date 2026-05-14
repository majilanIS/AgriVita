import os
import base64
import json as jsonlib
import importlib
import httpx
from typing import Literal
from io import BytesIO
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException, File, UploadFile, Form, Depends, Header
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
from sqlalchemy.orm import Session
from groq import Groq

try:
    Image = importlib.import_module("PIL.Image")
    ImageOps = importlib.import_module("PIL.ImageOps")
    PIL_AVAILABLE = True
except ModuleNotFoundError:
    Image = None
    ImageOps = None
    PIL_AVAILABLE = False

from db import get_db, engine
from models import User, Base
from auth import hash_password, verify_password, create_access_token, create_refresh_token, verify_token

# Create tables
Base.metadata.create_all(bind=engine)

# Load environment variables
load_dotenv()

# Initialize FastAPI app
app = FastAPI(
    title="Agrivita Smart Agriculture API",
    description="AI-powered image analysis for crop diseases and insects",
    version="1.0.0"
)

# Create uploads directory if it doesn't exist
UPLOAD_DIR = "uploads"
if not os.path.exists(UPLOAD_DIR):
    os.makedirs(UPLOAD_DIR)

app.mount("/uploads", StaticFiles(directory=UPLOAD_DIR), name="uploads")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def root():
    return {
        "message": "Agrivita Smart Agriculture API is running",
        "docs": "/docs",
        "health": "/health",
    }


@app.get("/health")
def health_check():
    return {"status": "ok"}

# Initialize Groq client lazily-safe (avoid startup crash if key is missing)
GROQ_API_KEY = os.getenv("GROQ_API_KEY", "")
groq_client = Groq(api_key=GROQ_API_KEY) if GROQ_API_KEY else None

# API Keys
INSECT_API_KEY: str = os.getenv("INSECT_ID", "")
CROP_HEALTH_API_KEY: str = os.getenv("CROP_HEALTH", "")

# API Base URLs
INSECT_API_URL: str = os.getenv("INSECT_API_URL", "https://insect.kindwise.com/api/v1")
CROP_HEALTH_API_URL: str = os.getenv("CROP_HEALTH_API_URL", "https://crop.kindwise.com/api/v1")


# ==================== Pydantic Models ====================

class RegisterRequest(BaseModel):
    phone_number: str
    password: str

class LoginRequest(BaseModel):
    phone_number: str
    password: str

class ProfileUpdate(BaseModel):
    full_name: str | None = None
    phone_number: str | None = None
    national_id: str | None = None
    country: str | None = None
    preferred_language: str | None = "English"
    farm_location: str | None = None
    field_size: float | None = None
    planting_date: str | None = None
    main_crops: list[str] | None = []

class AuthResponse(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"

class AnalysisRequest(BaseModel):

    """Request model for image analysis"""
    image: str  # Base64 encoded image or URL
    type: Literal["insect", "disease"]


class DiseaseResponse(BaseModel):
    """Response model for disease analysis"""
    disease: str
    description: str
    solution: str


class InsectResponse(BaseModel):
    """Response model for insect analysis"""
    insect: str
    description: str
    solution: str


class AnalysisResponse(BaseModel):
    """Combined response model"""
    type: Literal["insect", "disease"]
    data: dict


# ==================== Helper Functions ====================

def get_token_from_header(authorization: str | None = Header(None)) -> str:
    """Extract and validate token from Authorization header"""
    if not authorization:
        raise HTTPException(status_code=401, detail="Missing authorization header")
    
    parts = authorization.split()
    if len(parts) != 2 or parts[0].lower() != "bearer":
        raise HTTPException(status_code=401, detail="Invalid authorization header format")
    
    return parts[1]


def prepare_image_base64(contents: bytes, max_dimension: int = 2048) -> str:
    """Convert uploaded bytes to base64 and downscale very large images automatically."""
    if not PIL_AVAILABLE or Image is None or ImageOps is None:
        # Pillow not installed: keep server running and forward original image bytes.
        return base64.b64encode(contents).decode("utf-8")

    pil_image = Image
    pil_ops = ImageOps

    try:
        with pil_image.open(BytesIO(contents)) as img:
            img = pil_ops.exif_transpose(img)
            if img.mode not in ("RGB", "L"):
                img = img.convert("RGB")

            width, height = img.size
            largest_side = max(width, height)
            if largest_side > max_dimension:
                scale = max_dimension / float(largest_side)
                new_size = (max(1, int(width * scale)), max(1, int(height * scale)))
                resampling = getattr(pil_image, "Resampling", None)
                lanczos = resampling.LANCZOS if resampling else pil_image.LANCZOS
                img = img.resize(new_size, lanczos)

            buffer = BytesIO()
            if img.mode == "RGB":
                img.save(buffer, format="JPEG", optimize=True, quality=88)
            else:
                img.save(buffer, format="PNG", optimize=True)
            return base64.b64encode(buffer.getvalue()).decode("utf-8")
    except Exception:
        # Fallback to raw bytes when Pillow cannot parse an uncommon file format.
        return base64.b64encode(contents).decode("utf-8")

def authenticate_user(token: str = Depends(get_token_from_header), db: Session = Depends(get_db)) -> str:
    """Authenticate user from token"""
    phone_number = verify_token(token)
    if not phone_number:
        raise HTTPException(status_code=401, detail="Invalid or expired token")
    
    user = db.query(User).filter(User.phone_number == phone_number).first()
    if not user:
        raise HTTPException(status_code=401, detail="User not found")
    
    return phone_number

async def call_insect_api(image: str) -> dict:
    """Call Kindwise Insect.id API for insect identification"""
    headers: dict[str, str] = {"Api-Key": INSECT_API_KEY}
    payload = {"images": [image]}
    
    async with httpx.AsyncClient() as client:
        response = await client.post(
            f"{INSECT_API_URL}/identification",
            json=payload,
            headers=headers,
            timeout=30.0
        )
        
        if response.status_code != 201:
            raise HTTPException(
                status_code=response.status_code,
                detail=f"Insect API error: {response.text}"
            )
        
        return response.json()


async def call_crop_health_api(image: str) -> dict:
    """Call Kindwise Crop.health API for disease identification"""
    headers: dict[str, str] = {"Api-Key": CROP_HEALTH_API_KEY}
    payload = {"images": [image]}
    
    async with httpx.AsyncClient() as client:
        response = await client.post(
            f"{CROP_HEALTH_API_URL}/identification",
            json=payload,
            headers=headers,
            timeout=30.0
        )
        
        if response.status_code != 201:
            raise HTTPException(
                status_code=response.status_code,
                detail=f"Crop Health API error: {response.text}"
            )
        
        return response.json()


async def get_identification_details(access_token: str, api_type: str) -> dict:
    """Retrieve detailed identification results"""
    base_url = INSECT_API_URL if api_type == "insect" else CROP_HEALTH_API_URL
    api_key = INSECT_API_KEY if api_type == "insect" else CROP_HEALTH_API_KEY
    headers: dict[str, str] = {"Api-Key": api_key}
    
    # Build query parameters for details
    detail_params = "?details=common_names,description,danger,treatment,symptoms"
    
    async with httpx.AsyncClient() as client:
        response = await client.get(
            f"{base_url}/identification/{access_token}{detail_params}",
            headers=headers,
            timeout=30.0
        )
        
        if response.status_code != 200:
            raise HTTPException(
                status_code=response.status_code,
                detail=f"Failed to retrieve details: {response.text}"
            )
        
        return response.json()


def analyze_with_groq(identification_data: dict, analysis_type: str) -> dict:
    """Use Groq to analyze identification data and provide structured response"""
    detected_name = "Unknown"
    confidence = 0.0
    
    # Extract top suggestion
    if analysis_type == "insect":
        suggestions = identification_data.get("result", {}).get("classification", {}).get("suggestions", [])
        if not suggestions:
            raise HTTPException(status_code=400, detail="No insect identified in the image")
        
        top_suggestion = suggestions[0]
        insect_name = top_suggestion.get("name", "Unknown")
        confidence = top_suggestion.get("probability", 0.0)
        detected_name = insect_name
        
        prompt = f"""You are an expert agricultural extension advisor. Produce farmer-friendly guidance from this insect identification.

Insect Name: {insect_name}
Confidence: {confidence:.0%}

Provide a JSON response with this exact structure (no markdown, just JSON):
{{
    "insect": "Common name of the insect",
    "description": "Two short, readable paragraphs describing what this insect is, visible field signs, likely crop impact, and urgency.",
    "solution": "Two practical paragraphs with clear treatment steps and prevention guidance suitable for smallholder farmers. Avoid section labels and bullet points. Mention confidence naturally once."
}}

IMPORTANT: Return ONLY strings for each field - no arrays, no objects, no lists. Each value must be a single string."""
        
    else:  # disease
        disease_result = identification_data.get("result", {}).get("disease", {})
        suggestions = disease_result.get("suggestions", []) if isinstance(disease_result, dict) else []
        if not suggestions:
            # Some scans may not find a confident disease match (for example healthy leaves or low-quality images).
            # Return a useful response instead of failing with 400 so the frontend can guide the user.
            return {
                "disease": "No clear disease detected",
                "description": "The model did not find a high-confidence disease match. This can happen when the crop is healthy, symptoms are early, or the image angle/lighting hides lesions.",
                "solution": "Retake two or three close photos in daylight, including both sides of affected leaves, and avoid blur so symptoms are clearer. Continue monitoring the crop for the next few days and remove severely affected leaves early to reduce spread.",
            }
        
        top_suggestion = suggestions[0]
        disease_name = top_suggestion.get("name", "Unknown")
        confidence = top_suggestion.get("probability", 0.0)
        detected_name = disease_name
        
        prompt = f"""You are an expert agricultural extension advisor. Produce farmer-friendly guidance from this crop disease identification.

Disease/Issue Name: {disease_name}
Confidence: {confidence:.0%}

Provide a JSON response with this exact structure (no markdown, just JSON):
{{
    "disease": "Name of the disease, pest, or condition",
    "description": "Two short, readable paragraphs explaining hallmark symptoms, likely cause, spread conditions, and likely yield impact.",
    "solution": "Two practical paragraphs with treatment and prevention steps suitable for smallholder farmers. Avoid section labels and bullet points. Mention confidence naturally once."
}}

IMPORTANT: Return ONLY strings for each field - no arrays, no objects, no lists. Each value must be a single string."""
    
    try:
        if groq_client is None:
            key = "insect" if analysis_type == "insect" else "disease"
            return {
                key: detected_name,
                "description": f"Detected: {detected_name}. The identification confidence is about {confidence:.0%}. A detailed narrative could not be generated because the AI text service is not configured.",
                "solution": "Configure GROQ_API_KEY in the backend environment to receive rich paragraph-style recommendations. For now, retake a clear close-up image and monitor affected plants daily while using basic field hygiene and early removal of heavily affected parts.",
            }

        message = groq_client.chat.completions.create(
            model="llama-3.1-8b-instant",
            max_tokens=1024,
            messages=[
                {"role": "user", "content": prompt}
            ]
        )
        
        response_text = (message.choices[0].message.content or "").strip()
        
        # Remove markdown code blocks if present
        if response_text.startswith("```json"):
            response_text = response_text[7:]
        if response_text.startswith("```"):
            response_text = response_text[3:]
        if response_text.endswith("```"):
            response_text = response_text[:-3]
        response_text = response_text.strip()
        
        # Parse JSON response
        result = jsonlib.loads(response_text)
        return result
        
    except jsonlib.JSONDecodeError as e:
        key = "insect" if analysis_type == "insect" else "disease"
        return {
            key: detected_name,
            "description": f"Detected: {detected_name}. The AI response formatter failed, but the core identification confidence was {confidence:.0%}.",
            "solution": "Retake a closer, well-lit image for a stronger recommendation narrative. Continue daily monitoring and early removal of severely affected tissue, and maintain consistent farm hygiene to reduce spread risk.",
        }
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Groq analysis error: {str(e)}"
        )


# ==================== Auth Endpoints ====================

@app.post("/register", response_model=AuthResponse)
def register(request: RegisterRequest, db: Session = Depends(get_db)):
    """Register a new user and return access and refresh tokens"""
    
    # Check if user already exists
    existing_user = db.query(User).filter(User.phone_number == request.phone_number).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Phone number already registered")
    
    # Create new user
    fallback_email = f"{request.phone_number}@agrivita.local"
    user = User(
        phone_number=request.phone_number,
        password=hash_password(request.password),
        email=fallback_email,
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    
    # Generate tokens
    access_token = create_access_token(user.phone_number)
    refresh_token = create_refresh_token(user.phone_number)
    
    return AuthResponse(access_token=access_token, refresh_token=refresh_token)

@app.post("/login", response_model=AuthResponse)
def login(request: LoginRequest, db: Session = Depends(get_db)):
    """Login user and return access and refresh tokens"""
    
    user = db.query(User).filter(User.phone_number == request.phone_number).first()
    if not user or not verify_password(request.password, user.password):
        raise HTTPException(status_code=401, detail="Invalid phone number or password")
    
    # Generate tokens
    access_token = create_access_token(user.phone_number)
    refresh_token = create_refresh_token(user.phone_number)
    
    return AuthResponse(access_token=access_token, refresh_token=refresh_token)

# ==================== Profile Endpoints ====================

@app.get("/profile")
def get_profile(phone_number: str = Depends(authenticate_user), db: Session = Depends(get_db)):
    """Get current user's profile"""
    user = db.query(User).filter(User.phone_number == phone_number).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Calculate completion percentage
    fields = [
        user.full_name, user.phone_number, user.national_id,
        user.country, user.farm_location, user.field_size,
        user.planting_date, len(user.main_crops) if user.main_crops else 0,
        user.avatar_url, user.farm_image_url
    ]
    filled = len([f for f in fields if f])
    completion = int((filled / len(fields)) * 100) if fields else 0
    
    return {
        "full_name": user.full_name,
        "phone_number": user.phone_number,
        "email": user.email,
        "national_id": user.national_id,
        "country": user.country,
        "preferred_language": user.preferred_language,
        "farm_location": user.farm_location,
        "field_size": user.field_size,
        "planting_date": user.planting_date,
        "main_crops": user.main_crops,
        "avatar_url": user.avatar_url,
        "farm_image_url": user.farm_image_url,
        "id_document_url": user.id_document_url,
        "profile_complete": completion
    }

@app.put("/profile")
def update_profile(
    profile_data: ProfileUpdate,
    phone_number: str = Depends(authenticate_user),
    db: Session = Depends(get_db)
):
    """Update user's profile information"""
    user = db.query(User).filter(User.phone_number == phone_number).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Update fields
    for field, value in profile_data.model_dump(exclude_unset=True).items():
        setattr(user, field, value)
    
    db.commit()
    db.refresh(user)
    return get_profile(phone_number, db)

@app.post("/profile/avatar")
async def upload_avatar(
    file: UploadFile = File(...),
    phone_number: str = Depends(authenticate_user),
    db: Session = Depends(get_db)
):
    """Upload and set profile picture"""
    user = db.query(User).filter(User.phone_number == phone_number).first()
    
    # Save file
    if not file.filename:
        raise HTTPException(status_code=400, detail="File must have a name")
    file_ext = os.path.splitext(file.filename)[1]
    file_name = f"avatar_{user.id}{file_ext}"
    file_path = os.path.join(UPLOAD_DIR, file_name)
    
    with open(file_path, "wb") as buffer:
        buffer.write(await file.read())
    
    # Update user
    url = f"/uploads/{file_name}"
    user.avatar_url = url
    db.commit()
    
    return {"url": url}

@app.post("/profile/document")
async def upload_document(
    doc_type: str = Form(...),
    file: UploadFile = File(...),
    phone_number: str = Depends(authenticate_user),
    db: Session = Depends(get_db)
):
    """Upload farm or identity documents"""
    user = db.query(User).filter(User.phone_number == phone_number).first()
    
    # Save file
    if not file.filename:
        raise HTTPException(status_code=400, detail="File must have a name")
    file_ext = os.path.splitext(file.filename)[1]
    file_name = f"{doc_type}_{user.id}{file_ext}"
    file_path = os.path.join(UPLOAD_DIR, file_name)
    
    with open(file_path, "wb") as buffer:
        buffer.write(await file.read())
    
    # Update user based on doc_type
    url = f"/uploads/{file_name}"
    if doc_type == "farm_image":
        user.farm_image_url = url
    elif doc_type == "id_document":
        user.id_document_url = url
    
    db.commit()
    return {"url": url}

# ==================== API Endpoints ====================

@app.post("/analyze", response_model=AnalysisResponse)
async def analyze_image(
    type: Literal["insect", "disease"] = Form(...),
    file: UploadFile | None = File(None),
    image: str | None = Form(None),
    phone_number: str = Depends(authenticate_user),
):
    """
    Analyze an image for insects or diseases.

    Accepts either an uploaded file or a Base64 string / image URL.
    """

    if file is None and image is None:
        raise HTTPException(status_code=400, detail="Provide an image file or image string")

    image_input: str
    if file is not None:
        contents = await file.read()
        image_input = prepare_image_base64(contents)
    else:
        if image is None:
            raise HTTPException(status_code=400, detail="Provide an image file or image string")
        image_input = image

    try:
        # Call appropriate Kindwise API
        if type == "insect":
            api_response = await call_insect_api(image_input)
        else:  # disease
            api_response = await call_crop_health_api(image_input)

        # Get access token for detailed results
        access_token = api_response.get("access_token")
        if not access_token:
            raise HTTPException(status_code=400, detail="No access token received from API")

        # Retrieve detailed identification results
        detailed_data = await get_identification_details(access_token, type)

        # Analyze with Groq
        analysis_result = analyze_with_groq(detailed_data, type)

        return AnalysisResponse(
            type=type,
            data=analysis_result
        )

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Analysis failed: {str(e)}"
        )


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
