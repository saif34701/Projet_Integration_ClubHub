import enum

class GlobalRole(str, enum.Enum):
    ADMIN = "ADMIN"
    STUDENT = "STUDENT"
    CLUB_MANAGER = "CLUB_MANAGER"

class ClubRole(str, enum.Enum):
    MANAGER = "MANAGER"
    MEMBER = "MEMBER"

class MembershipStatus(str, enum.Enum):
    PENDING = "PENDING"
    ACTIVE = "ACTIVE"
    REJECTED = "REJECTED"
    REMOVED = "REMOVED"

class JoinRequestStatus(str, enum.Enum):
    PENDING = "PENDING"
    APPROVED = "APPROVED"
    REJECTED = "REJECTED"

class AnnouncementVisibility(str, enum.Enum):
    PUBLIC = "PUBLIC"
    MEMBERS_ONLY = "MEMBERS_ONLY"
