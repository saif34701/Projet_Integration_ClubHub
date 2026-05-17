from pydantic import BaseModel, ConfigDict
from typing import Optional
from datetime import datetime

class ClubBase(BaseModel):
    name: str
    slug: str
    description: Optional[str] = None
    logo: Optional[str] = None
    coverImage: Optional[str] = None
    category: Optional[str] = None

class ClubCreate(ClubBase):
    pass

class ClubUpdate(BaseModel):
    name: Optional[str] = None
    slug: Optional[str] = None
    description: Optional[str] = None
    logo: Optional[str] = None
    coverImage: Optional[str] = None
    category: Optional[str] = None
    isActive: Optional[bool] = None

class ClubResponse(ClubBase):
    id: str
    isActive: bool
    createdById: str
    createdAt: datetime
    updatedAt: datetime
    model_config = ConfigDict(from_attributes=True)
