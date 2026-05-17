from pydantic import BaseModel, ConfigDict
from typing import Optional
from datetime import datetime
from app.models.enums import AnnouncementVisibility

class AnnouncementBase(BaseModel):
    title: str
    content: str
    visibility: AnnouncementVisibility = AnnouncementVisibility.PUBLIC

class AnnouncementCreate(AnnouncementBase):
    clubId: str

class AnnouncementUpdate(BaseModel):
    title: Optional[str] = None
    content: Optional[str] = None
    visibility: Optional[AnnouncementVisibility] = None

class AnnouncementResponse(AnnouncementBase):
    id: str
    clubId: str
    authorId: str
    publishedAt: datetime
    createdAt: datetime
    updatedAt: datetime
    model_config = ConfigDict(from_attributes=True)

class EventBase(BaseModel):
    title: str
    description: Optional[str] = None
    location: Optional[str] = None
    startDate: datetime
    endDate: datetime
    isOnline: bool = False
    meetingLink: Optional[str] = None

class EventCreate(EventBase):
    clubId: str

class EventUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    location: Optional[str] = None
    startDate: Optional[datetime] = None
    endDate: Optional[datetime] = None
    isOnline: Optional[bool] = None
    meetingLink: Optional[str] = None

class EventResponse(EventBase):
    id: str
    clubId: str
    createdById: str
    createdAt: datetime
    updatedAt: datetime
    model_config = ConfigDict(from_attributes=True)

class MeetingBase(BaseModel):
    title: str
    description: Optional[str] = None
    provider: str = "jitsi"
    meetingUrl: str
    startTime: datetime
    endTime: datetime

class MeetingCreate(MeetingBase):
    clubId: str

class MeetingUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    provider: Optional[str] = None
    meetingUrl: Optional[str] = None
    startTime: Optional[datetime] = None
    endTime: Optional[datetime] = None

class MeetingResponse(MeetingBase):
    id: str
    clubId: str
    createdById: str
    createdAt: datetime
    updatedAt: datetime
    model_config = ConfigDict(from_attributes=True)
