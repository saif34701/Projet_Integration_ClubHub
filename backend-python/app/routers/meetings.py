from fastapi import APIRouter, Depends
from app.core.database import get_db
from app.schemas.activities import MeetingCreate, MeetingUpdate, MeetingResponse
from app.schemas.common import success_response
from app.services.meeting_service import MeetingService
from app.api.deps import get_current_user, require_manager

router = APIRouter()

@router.get("/")
async def get_all_meetings(db = Depends(get_db)):
    meetings = await MeetingService.get_all_meetings(db)
    return success_response(data=[MeetingResponse.model_validate(m).model_dump() for m in meetings], message="Meetings retrieved")

@router.get("/club/{club_id}")
async def get_club_meetings(club_id: str, db = Depends(get_db)):
    meetings = await MeetingService.get_by_club(db, club_id)
    return success_response(data=[MeetingResponse.model_validate(m).model_dump() for m in meetings], message="Meetings retrieved")

@router.post("/", dependencies=[Depends(require_manager)])
async def create_meeting(data: MeetingCreate, db = Depends(get_db), current_user = Depends(get_current_user)):
    meeting = await MeetingService.create(db, data, current_user.id)
    return success_response(data=MeetingResponse.model_validate(meeting).model_dump(), message="Meeting created")

@router.patch("/{id}", dependencies=[Depends(require_manager)])
async def update_meeting(id: str, data: MeetingUpdate, db = Depends(get_db)):
    meeting = await MeetingService.update(db, id, data)
    return success_response(data=MeetingResponse.model_validate(meeting).model_dump(), message="Meeting updated")

@router.delete("/{id}", dependencies=[Depends(require_manager)])
async def delete_meeting(id: str, db = Depends(get_db)):
    await MeetingService.delete(db, id)
    return success_response(data=None, message="Meeting deleted")
