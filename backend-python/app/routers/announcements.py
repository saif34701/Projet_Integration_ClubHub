from fastapi import APIRouter, Depends
from app.core.database import get_db
from app.schemas.activities import AnnouncementCreate, AnnouncementUpdate, AnnouncementResponse
from app.schemas.common import success_response
from app.services.announcement_service import AnnouncementService
from app.api.deps import get_current_user, require_manager

router = APIRouter()

@router.get("/")
async def get_all_announcements(db = Depends(get_db)):
    announcements = await AnnouncementService.get_all_announcements(db)
    return success_response(data=[AnnouncementResponse.model_validate(a).model_dump() for a in announcements], message="Announcements retrieved")

@router.get("/club/{club_id}")
async def get_club_announcements(club_id: str, db = Depends(get_db)):
    announcements = await AnnouncementService.get_by_club(db, club_id)
    return success_response(data=[AnnouncementResponse.model_validate(a).model_dump() for a in announcements], message="Announcements retrieved")

@router.post("/", dependencies=[Depends(require_manager)])
async def create_announcement(data: AnnouncementCreate, db = Depends(get_db), current_user = Depends(get_current_user)):
    announcement = await AnnouncementService.create(db, data, current_user.id)
    return success_response(data=AnnouncementResponse.model_validate(announcement).model_dump(), message="Announcement created")

@router.patch("/{id}", dependencies=[Depends(require_manager)])
async def update_announcement(id: str, data: AnnouncementUpdate, db = Depends(get_db)):
    announcement = await AnnouncementService.update(db, id, data)
    return success_response(data=AnnouncementResponse.model_validate(announcement).model_dump(), message="Announcement updated")

@router.delete("/{id}", dependencies=[Depends(require_manager)])
async def delete_announcement(id: str, db = Depends(get_db)):
    await AnnouncementService.delete(db, id)
    return success_response(data=None, message="Announcement deleted")
