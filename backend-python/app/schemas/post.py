from pydantic import BaseModel, ConfigDict
from typing import Optional, List
from datetime import datetime

class PostBase(BaseModel):
    title: str
    description: Optional[str] = None
    imageUrl: Optional[str] = None
    hashtags: List[str] = []
    published: bool = False

class PostCreate(PostBase):
    clubId: str

class PostUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    imageUrl: Optional[str] = None
    hashtags: Optional[List[str]] = None
    published: Optional[bool] = None

class PostResponse(PostBase):
    id: str
    clubId: str
    authorId: str
    aiCaption: Optional[str] = None
    createdAt: datetime
    updatedAt: datetime
    model_config = ConfigDict(from_attributes=True)
