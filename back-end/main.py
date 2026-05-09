import os
import base64
import httpx
from typing import Literal
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException, File, UploadFile, Form
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from groq import Groq

# Load environment variables
load_dotenv()

# Initialize FastAPI app
app = FastAPI(
    title="Agrivita Smart Agriculture API",
    description="AI-powered image analysis for crop diseases and insects",
    version="1.0.0"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize Groq client
groq_client = Groq(api_key=os.getenv("GROQ_API_KEY"))

# API Keys
INSECT_API_KEY = os.getenv("INSECT_ID")
CROP_HEALTH_API_KEY = os.getenv("CROP_HEALTH")

# API Base URLs
INSECT_API_URL = "https://insect.kindwise.com/api/v1"
CROP_HEALTH_API_URL = "https://crop.kindwise.com/api/v1"


# ==================== Pydantic Models ====================

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

async def call_insect_api(image: str) -> dict:
    """Call Kindwise Insect.id API for insect identification"""
    headers = {"Api-Key": INSECT_API_KEY}
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
    headers = {"Api-Key": CROP_HEALTH_API_KEY}
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
    headers = {"Api-Key": api_key}
    
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
    
    # Extract top suggestion
    if analysis_type == "insect":
        suggestions = identification_data.get("result", {}).get("classification", {}).get("suggestions", [])
        if not suggestions:
            raise HTTPException(status_code=400, detail="No insect identified in the image")
        
        top_suggestion = suggestions[0]
        insect_name = top_suggestion.get("name", "Unknown")
        
        prompt = f"""Analyze this insect identification and provide a detailed JSON response.

Insect Name: {insect_name}
Identification Data: {identification_data}

Provide a JSON response with this exact structure (no markdown, just JSON):
{{
    "insect": "Common name of the insect",
    "description": "Provide a detailed and elaborated description of this insect including its physical characteristics, behavior, habitat, life cycle, and ecological role. Explain what it looks like, how it behaves, where it lives, and its importance in the ecosystem or agriculture.",
    "solution": "Provide practical recommendations for farmers or gardeners regarding this insect. If it's a pest, explain control methods and management strategies. If it's beneficial, explain how to protect or encourage it."
}}

IMPORTANT: Return ONLY strings for each field - no arrays, no objects, no lists. Each value must be a single string."""
        
    else:  # disease
        suggestions = identification_data.get("result", {}).get("disease", {}).get("suggestions", [])
        if not suggestions:
            raise HTTPException(status_code=400, detail="No disease identified in the image")
        
        top_suggestion = suggestions[0]
        disease_name = top_suggestion.get("name", "Unknown")
        
        prompt = f"""Analyze this crop disease identification and provide a detailed JSON response.

Disease/Issue Name: {disease_name}
Identification Data: {identification_data}

Provide a JSON response with this exact structure (no markdown, just JSON):
{{
    "disease": "Name of the disease, pest, or condition",
    "description": "Provide a detailed and elaborated description of this crop disease or pest including its symptoms, causes, affected plants, environmental conditions that favor it, and its impact on crop health and yield. Explain what it looks like on plants, how it spreads, and why it's problematic for farmers.",
    "solution": "Provide comprehensive step-by-step treatment and management strategies for this disease or pest. Include preventive measures, treatment options, cultural practices, and when to seek professional help."
}}

IMPORTANT: Return ONLY strings for each field - no arrays, no objects, no lists. Each value must be a single string."""
    
    try:
        message = groq_client.chat.completions.create(
            model="llama-3.1-8b-instant",
            max_tokens=1024,
            messages=[
                {"role": "user", "content": prompt}
            ]
        )
        
        response_text = message.choices[0].message.content.strip()
        
        # Remove markdown code blocks if present
        import json
        if response_text.startswith("```json"):
            response_text = response_text[7:]
        if response_text.startswith("```"):
            response_text = response_text[3:]
        if response_text.endswith("```"):
            response_text = response_text[:-3]
        response_text = response_text.strip()
        
        # Parse JSON response
        result = json.loads(response_text)
        return result
        
    except json.JSONDecodeError as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to parse Groq response as JSON: {str(e)}"
        )
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Groq analysis error: {str(e)}"
        )


# ==================== API Endpoint ====================

@app.post("/analyze", response_model=AnalysisResponse)
async def analyze_image(
    type: Literal["insect", "disease"] = Form(...),
    file: UploadFile | None = File(None),
    image: str | None = Form(None),
):
    """
    Analyze an image for insects or diseases.

    Accepts either an uploaded file or a Base64 string / image URL.
    """

    if file is None and image is None:
        raise HTTPException(status_code=400, detail="Provide an image file or image string")

    if file is not None:
        contents = await file.read()
        image_input = base64.b64encode(contents).decode("utf-8")
    else:
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
