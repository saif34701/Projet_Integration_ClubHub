from pydantic import BaseModel, EmailStr, ConfigDict
from typing import Optional
from datetime import datetime
from app.models.enums import GlobalRole

class UserBase(BaseModel):
    fullName: str
    email: EmailStr
    avatar: Optional[str] = None
    globalRole: GlobalRole = GlobalRole.STUDENT

class UserCreate(UserBase):
    password: str

class UserUpdate(BaseModel):
    fullName: Optional[str] = None
    avatar: Optional[str] = None
    globalRole: Optional[GlobalRole] = None
    isActive: Optional[bool] = None

class UserInDBBase(UserBase):
    id: str
    isActive: bool
    createdAt: datetime
    updatedAt: datetime
    model_config = ConfigDict(from_attributes=True)

class UserResponse(UserInDBBase):
    pass
