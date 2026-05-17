from app.core.exceptions import AppException
from app.services.mongo_utils import make_doc, public_doc, utcnow
from pymongo import ReturnDocument


class NotificationService:
    @staticmethod
    async def create(db, user_id: str, title: str, message: str, type: str = "INFO", **extra):
        notification = make_doc(
            {
                "userId": user_id,
                "title": title,
                "message": message,
                "type": type,
                "isRead": False,
                **extra,
            }
        )
        await db.notifications.insert_one(notification)
        return public_doc(notification)

    @staticmethod
    async def get_my_notifications(db, user_id: str):
        cursor = db.notifications.find({"userId": user_id}).sort("createdAt", -1)
        return [public_doc(notification) async for notification in cursor]

    @staticmethod
    async def mark_as_read(db, id: str, user_id: str):
        result = await db.notifications.find_one_and_update(
            {"_id": id, "userId": user_id},
            {"$set": {"isRead": True, "updatedAt": utcnow()}},
            return_document=ReturnDocument.AFTER,
        )
        if not result:
            raise AppException(status_code=404, message="Notification not found")
        return public_doc(result)

    @staticmethod
    async def mark_all_as_read(db, user_id: str):
        await db.notifications.update_many(
            {"userId": user_id, "isRead": False},
            {"$set": {"isRead": True, "updatedAt": utcnow()}},
        )
        return True
