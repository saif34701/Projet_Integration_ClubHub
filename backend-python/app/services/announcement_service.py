from app.schemas.activities import AnnouncementCreate, AnnouncementUpdate
from app.core.exceptions import AppException
from app.models.enums import MembershipStatus
from app.services.mongo_utils import make_doc, public_doc, to_mongo_data, utcnow
from app.services.notification_service import NotificationService


class AnnouncementService:
    @staticmethod
    async def get_all_announcements(db):
        cursor = db.announcements.find({}).sort("publishedAt", -1)
        return [public_doc(announcement) async for announcement in cursor]

    @staticmethod
    async def get_by_club(db, club_id: str):
        cursor = db.announcements.find({"clubId": club_id}).sort("publishedAt", -1)
        return [public_doc(announcement) async for announcement in cursor]

    @staticmethod
    async def get_by_id(db, id: str):
        announcement = await db.announcements.find_one({"_id": id})
        if not announcement:
            raise AppException(status_code=404, message="Announcement not found")
        return public_doc(announcement)

    @staticmethod
    async def create(db, data: AnnouncementCreate, author_id: str):
        now = utcnow()
        announcement = make_doc(to_mongo_data(data), authorId=author_id, publishedAt=now)
        await db.announcements.insert_one(announcement)

        member_cursor = db.memberships.find({
            "clubId": data.clubId,
            "status": MembershipStatus.ACTIVE.value,
        })
        member_ids = [member["userId"] async for member in member_cursor]

        if member_ids:
            user_cursor = db.users.find({"_id": {"$in": member_ids}})
            async for member in user_cursor:
                await NotificationService.create(
                    db,
                    user_id=member["_id"],
                    title="Nouvelle annonce",
                    message=f"Une nouvelle annonce a ete publiee : {announcement['title']}",
                    type="INFO",
                    relatedEntityType="ANNOUNCEMENT",
                    relatedEntityId=announcement["_id"],
                )

        return public_doc(announcement)

    @staticmethod
    async def update(db, id: str, data: AnnouncementUpdate):
        await AnnouncementService.get_by_id(db, id)
        update_data = to_mongo_data(data, exclude_unset=True)
        if update_data:
            update_data["updatedAt"] = utcnow()
            await db.announcements.update_one({"_id": id}, {"$set": update_data})
        return await AnnouncementService.get_by_id(db, id)

    @staticmethod
    async def delete(db, id: str):
        result = await db.announcements.delete_one({"_id": id})
        if result.deleted_count == 0:
            raise AppException(status_code=404, message="Announcement not found")
        return True
