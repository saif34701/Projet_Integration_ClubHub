from fastapi import APIRouter, Depends
from app.core.database import get_db
from app.schemas.notification import NotificationResponse
from app.schemas.common import success_response
from app.services.notification_service import NotificationService
from app.api.deps import get_current_user

router = APIRouter()

@router.get("/")
async def get_notifications(db = Depends(get_db), current_user = Depends(get_current_user)):
    notifications = await NotificationService.get_my_notifications(db, current_user.id)
    return success_response(data=[NotificationResponse.model_validate(n).model_dump() for n in notifications], message="Notifications retrieved")

@router.patch("/{id}/read")
async def mark_as_read(id: str, db = Depends(get_db), current_user = Depends(get_current_user)):
    notification = await NotificationService.mark_as_read(db, id, current_user.id)
    return success_response(data=NotificationResponse.model_validate(notification).model_dump(), message="Notification marked as read")

@router.patch("/read-all")
async def mark_all_as_read(db = Depends(get_db), current_user = Depends(get_current_user)):
    await NotificationService.mark_all_as_read(db, current_user.id)
    return success_response(data=None, message="All notifications marked as read")
