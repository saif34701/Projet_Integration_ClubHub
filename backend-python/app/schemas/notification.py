from pydantic import BaseModel, ConfigDict
from typing import Optional, List
from datetime import datetime

class NotificationBase(BaseModel):
    title: str
    message: str
    type: str = "INFO"
    relatedEntityType: Optional[str] = None
    relatedEntityId: Optional[str] = None

class NotificationResponse(NotificationBase):
    id: str
    userId: str
    isRead: bool
    createdAt: datetime
    model_config = ConfigDict(from_attributes=True)
