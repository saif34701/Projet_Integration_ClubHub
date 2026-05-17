from app.schemas.activities import MeetingCreate, MeetingUpdate
from app.core.exceptions import AppException
from app.services.mongo_utils import make_doc, public_doc, to_mongo_data, utcnow


class MeetingService:
    @staticmethod
    async def get_all_meetings(db):
        cursor = db.meetings.find({}).sort("startTime", 1)
        return [public_doc(meeting) async for meeting in cursor]

    @staticmethod
    async def get_by_club(db, club_id: str):
        cursor = db.meetings.find({"clubId": club_id}).sort("startTime", 1)
        return [public_doc(meeting) async for meeting in cursor]

    @staticmethod
    async def get_by_id(db, id: str):
        meeting = await db.meetings.find_one({"_id": id})
        if not meeting:
            raise AppException(status_code=404, message="Meeting not found")
        return public_doc(meeting)

    @staticmethod
    async def create(db, data: MeetingCreate, user_id: str):
        meeting = make_doc(to_mongo_data(data), createdById=user_id)
        await db.meetings.insert_one(meeting)
        return public_doc(meeting)

    @staticmethod
    async def update(db, id: str, data: MeetingUpdate):
        await MeetingService.get_by_id(db, id)
        update_data = to_mongo_data(data, exclude_unset=True)
        if update_data:
            update_data["updatedAt"] = utcnow()
            await db.meetings.update_one({"_id": id}, {"$set": update_data})
        return await MeetingService.get_by_id(db, id)

    @staticmethod
    async def delete(db, id: str):
        result = await db.meetings.delete_one({"_id": id})
        if result.deleted_count == 0:
            raise AppException(status_code=404, message="Meeting not found")
        return True
