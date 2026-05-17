from pydantic import BaseModel, ConfigDict
from typing import Optional
from datetime import datetime
from app.models.enums import ClubRole, MembershipStatus, JoinRequestStatus

class MembershipBase(BaseModel):
    roleInClub: ClubRole = ClubRole.MEMBER
    status: MembershipStatus = MembershipStatus.PENDING

class MembershipCreate(BaseModel):
    userId: str
    clubId: str
    roleInClub: Optional[ClubRole] = ClubRole.MEMBER
    status: Optional[MembershipStatus] = MembershipStatus.PENDING

class MembershipResponse(MembershipBase):
    id: str
    userId: str
    clubId: str
    userName: Optional[str] = None
    userEmail: Optional[str] = None
    joinedAt: Optional[datetime] = None
    createdAt: datetime
    updatedAt: datetime
    model_config = ConfigDict(from_attributes=True)

class JoinRequestBase(BaseModel):
    message: Optional[str] = None

class JoinRequestCreate(JoinRequestBase):
    clubId: str

class JoinRequestResponse(JoinRequestBase):
    id: str
    userId: str
    clubId: str
    clubName: Optional[str] = None
    studentName: Optional[str] = None
    studentEmail: Optional[str] = None
    status: JoinRequestStatus
    reviewedById: Optional[str] = None
    reviewedAt: Optional[datetime] = None
    createdAt: datetime
    updatedAt: datetime
    model_config = ConfigDict(from_attributes=True)
