from fastapi import APIRouter, Depends, Query
from app.core.database import get_db
from app.schemas.user import UserResponse, UserUpdate
from app.schemas.common import success_response
from app.services.user_service import UserService
from app.api.deps import get_current_user, require_admin

router = APIRouter()

@router.get("/", dependencies=[Depends(require_admin)])
async def get_all_users(
    page: int = Query(1, ge=1),
    limit: int = Query(10, ge=1, le=100),
    search: str = None,
    db = Depends(get_db)
):
    result = await UserService.get_all_users(db, page, limit, search)
    return success_response(data=result["users"], message="Users retrieved successfully", meta=result["meta"])

@router.get("/{id}", response_model=dict, dependencies=[Depends(get_current_user)])
async def get_user_by_id(id: str, db = Depends(get_db)):
    user = await UserService.get_user_by_id(db, id)
    return success_response(data=UserResponse.model_validate(user).model_dump(), message="User retrieved")

@router.patch("/{id}", dependencies=[Depends(require_admin)])
async def update_user(id: str, user_update: UserUpdate, db = Depends(get_db)):
    user = await UserService.update_user(db, id, user_update)
    return success_response(data=UserResponse.model_validate(user).model_dump(), message="User updated successfully")
