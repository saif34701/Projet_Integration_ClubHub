from fastapi import APIRouter, Depends
from app.core.database import get_db
from app.schemas.membership import JoinRequestCreate, JoinRequestResponse, MembershipResponse
from app.schemas.common import success_response
from app.services.membership_service import MembershipService
from app.api.deps import get_current_user, require_manager

router = APIRouter()

@router.post("/request")
async def request_join(request_in: JoinRequestCreate, db = Depends(get_db), current_user = Depends(get_current_user)):
    request = await MembershipService.request_join(db, request_in, current_user.id)
    return success_response(data=JoinRequestResponse.model_validate(request).model_dump(), message="Join request submitted successfully")

@router.get("/my-requests")
async def get_my_requests(db = Depends(get_db), current_user = Depends(get_current_user)):
    requests = await MembershipService.get_my_requests(db, current_user.id)
    return success_response(data=[JoinRequestResponse.model_validate(r).model_dump() for r in requests], message="Requests retrieved")

@router.get("/pending/{club_id}", dependencies=[Depends(require_manager)])
async def get_pending_requests(club_id: str, db = Depends(get_db)):
    requests = await MembershipService.get_pending_requests(db, club_id)
    return success_response(data=[JoinRequestResponse.model_validate(r).model_dump() for r in requests], message="Pending requests retrieved")

@router.patch("/{request_id}/accept", dependencies=[Depends(require_manager)])
async def accept_request(request_id: str, db = Depends(get_db), current_user = Depends(get_current_user)):
    request = await MembershipService.process_request(db, request_id, "accept", current_user.id)
    return success_response(data=JoinRequestResponse.model_validate(request).model_dump(), message="Request accepted successfully")

@router.patch("/{request_id}/reject", dependencies=[Depends(require_manager)])
async def reject_request(request_id: str, db = Depends(get_db), current_user = Depends(get_current_user)):
    request = await MembershipService.process_request(db, request_id, "reject", current_user.id)
    return success_response(data=JoinRequestResponse.model_validate(request).model_dump(), message="Request rejected successfully")

@router.get("/club/{club_id}/members", dependencies=[Depends(require_manager)])
async def get_club_members(club_id: str, db = Depends(get_db)):
    members = await MembershipService.get_club_members(db, club_id)
    return success_response(data=[MembershipResponse.model_validate(m).model_dump() for m in members], message="Members retrieved")

@router.delete("/members/{membership_id}", dependencies=[Depends(require_manager)])
async def remove_member(membership_id: str, db = Depends(get_db)):
    await MembershipService.remove_member(db, membership_id)
    return success_response(data=None, message="Member removed successfully")
