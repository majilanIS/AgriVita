from sqlalchemy import Column, Integer, String, DateTime, Float, JSON
from sqlalchemy.sql import func
from db import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    phone_number = Column(String, unique=True, index=True, nullable=False)
    password = Column(String, nullable=False)
    
    # Profile fields
    full_name = Column(String, nullable=True)
    email = Column(String, nullable=True)
    national_id = Column(String, nullable=True)
    country = Column(String, nullable=True)
    preferred_language = Column(String, default="English")
    farm_location = Column(String, nullable=True)
    field_size = Column(Float, nullable=True)
    planting_date = Column(String, nullable=True)
    main_crops = Column(JSON, default=[])
    
    # URLs for documents/photos
    avatar_url = Column(String, nullable=True)
    farm_image_url = Column(String, nullable=True)
    id_document_url = Column(String, nullable=True)

    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

