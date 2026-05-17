from fastapi import APIRouter, Depends, Query
from app.core.database import get_db
from app.schemas.club import ClubCreate, ClubUpdate, ClubResponse
from app.schemas.common import success_response
from app.services.club_service import ClubService
from app.api.deps import get_current_user, require_admin, require_manager

router = APIRouter()

@router.get("/")
async def get_all_clubs(
    page: int = Query(1, ge=1),
    limit: int = Query(10, ge=1, le=100),
    search: str = None,
    category: str = None,
    isActive: bool = True,
    db = Depends(get_db)
):
    result = await ClubService.get_all_clubs(db, page, limit, search, category, isActive)
    return success_response(data=result["clubs"], message="Clubs retrieved", meta=result["meta"])

@router.get("/{id}")
async def get_club_by_id(id: str, db = Depends(get_db)):
    club = await ClubService.get_club_by_id(db, id)
    return success_response(data=ClubResponse.model_validate(club).model_dump(), message="Club retrieved")

@router.get("/slug/{slug}")
async def get_club_by_slug(slug: str, db = Depends(get_db)):
    club = await ClubService.get_club_by_slug(db, slug)
    return success_response(data=ClubResponse.model_validate(club).model_dump(), message="Club retrieved")

@router.post("/", dependencies=[Depends(require_admin)])
async def create_club(club_in: ClubCreate, db = Depends(get_db), current_user = Depends(get_current_user)):
    club = await ClubService.create_club(db, club_in, current_user.id)
    return success_response(data=ClubResponse.model_validate(club).model_dump(), message="Club created successfully")

@router.patch("/{id}", dependencies=[Depends(require_manager)])
async def update_club(id: str, club_in: ClubUpdate, db = Depends(get_db)):
    club = await ClubService.update_club(db, id, club_in)
    return success_response(data=ClubResponse.model_validate(club).model_dump(), message="Club updated successfully")

@router.delete("/{id}", dependencies=[Depends(require_admin)])
async def deactivate_club(id: str, db = Depends(get_db)):
    await ClubService.deactivate_club(db, id)
    return success_response(data=None, message="Club deactivated successfully")
