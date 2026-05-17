from fastapi import APIRouter, Depends
from app.core.database import get_db
from app.schemas.activities import EventCreate, EventUpdate, EventResponse
from app.schemas.common import success_response
from app.services.event_service import EventService
from app.api.deps import get_current_user, require_manager

router = APIRouter()

@router.get("/")
async def get_all_events(db = Depends(get_db)):
    events = await EventService.get_all_events(db)
    return success_response(data=[EventResponse.model_validate(e).model_dump() for e in events], message="Events retrieved")

@router.get("/club/{club_id}")
async def get_club_events(club_id: str, db = Depends(get_db)):
    events = await EventService.get_by_club(db, club_id)
    return success_response(data=[EventResponse.model_validate(e).model_dump() for e in events], message="Events retrieved")

@router.post("/", dependencies=[Depends(require_manager)])
async def create_event(data: EventCreate, db = Depends(get_db), current_user = Depends(get_current_user)):
    event = await EventService.create(db, data, current_user.id)
    return success_response(data=EventResponse.model_validate(event).model_dump(), message="Event created")

@router.patch("/{id}", dependencies=[Depends(require_manager)])
async def update_event(id: str, data: EventUpdate, db = Depends(get_db)):
    event = await EventService.update(db, id, data)
    return success_response(data=EventResponse.model_validate(event).model_dump(), message="Event updated")

@router.delete("/{id}", dependencies=[Depends(require_manager)])
async def delete_event(id: str, db = Depends(get_db)):
    await EventService.delete(db, id)
    return success_response(data=None, message="Event deleted")
