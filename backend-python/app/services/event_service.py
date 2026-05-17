from app.schemas.activities import EventCreate, EventUpdate
from app.core.exceptions import AppException
from app.services.mongo_utils import make_doc, public_doc, to_mongo_data, utcnow


class EventService:
    @staticmethod
    async def get_all_events(db):
        cursor = db.events.find({}).sort("startDate", 1)
        return [public_doc(event) async for event in cursor]

    @staticmethod
    async def get_by_club(db, club_id: str):
        cursor = db.events.find({"clubId": club_id}).sort("startDate", 1)
        return [public_doc(event) async for event in cursor]

    @staticmethod
    async def get_by_id(db, id: str):
        event = await db.events.find_one({"_id": id})
        if not event:
            raise AppException(status_code=404, message="Event not found")
        return public_doc(event)

    @staticmethod
    async def create(db, data: EventCreate, user_id: str):
        event = make_doc(to_mongo_data(data), createdById=user_id)
        await db.events.insert_one(event)
        return public_doc(event)

    @staticmethod
    async def update(db, id: str, data: EventUpdate):
        await EventService.get_by_id(db, id)
        update_data = to_mongo_data(data, exclude_unset=True)
        if update_data:
            update_data["updatedAt"] = utcnow()
            await db.events.update_one({"_id": id}, {"$set": update_data})
        return await EventService.get_by_id(db, id)

    @staticmethod
    async def delete(db, id: str):
        result = await db.events.delete_one({"_id": id})
        if result.deleted_count == 0:
            raise AppException(status_code=404, message="Event not found")
        return True
