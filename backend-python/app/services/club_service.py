from app.schemas.club import ClubCreate, ClubUpdate
from app.core.exceptions import AppException
from app.services.mongo_utils import make_doc, pagination_meta, public_doc, to_mongo_data, utcnow


class ClubService:
    @staticmethod
    async def get_all_clubs(db, page: int = 1, limit: int = 10, search: str = None, category: str = None, is_active: bool = True):
        query = {"isActive": is_active}

        if search:
            query["$or"] = [
                {"name": {"$regex": search, "$options": "i"}},
                {"slug": {"$regex": search, "$options": "i"}},
                {"description": {"$regex": search, "$options": "i"}},
            ]
        if category:
            query["category"] = category

        skip = (page - 1) * limit
        cursor = db.clubs.find(query).sort("createdAt", -1).skip(skip).limit(limit)
        clubs = [public_doc(club) async for club in cursor]
        total = await db.clubs.count_documents(query)

        return {
            "clubs": clubs,
            "meta": pagination_meta(page, limit, total),
        }

    @staticmethod
    async def get_club_by_id(db, club_id: str):
        club = await db.clubs.find_one({"_id": club_id})
        if not club:
            raise AppException(status_code=404, message="Club not found")
        return public_doc(club)

    @staticmethod
    async def get_club_by_slug(db, slug: str):
        club = await db.clubs.find_one({"slug": slug})
        if not club:
            raise AppException(status_code=404, message="Club not found")
        return public_doc(club)

    @staticmethod
    async def create_club(db, data: ClubCreate, user_id: str):
        existing = await db.clubs.find_one({"slug": data.slug})
        if existing:
            raise AppException(status_code=400, message="A club with this slug already exists")

        club = make_doc(to_mongo_data(data), createdById=user_id, isActive=True)
        await db.clubs.insert_one(club)
        return public_doc(club)

    @staticmethod
    async def update_club(db, club_id: str, data: ClubUpdate):
        await ClubService.get_club_by_id(db, club_id)
        update_data = to_mongo_data(data, exclude_unset=True)
        if not update_data:
            return await ClubService.get_club_by_id(db, club_id)

        if "slug" in update_data:
            existing = await db.clubs.find_one({"slug": update_data["slug"], "_id": {"$ne": club_id}})
            if existing:
                raise AppException(status_code=400, message="A club with this slug already exists")

        update_data["updatedAt"] = utcnow()
        await db.clubs.update_one({"_id": club_id}, {"$set": update_data})
        return await ClubService.get_club_by_id(db, club_id)

    @staticmethod
    async def deactivate_club(db, club_id: str):
        await ClubService.get_club_by_id(db, club_id)
        await db.clubs.update_one({"_id": club_id}, {"$set": {"isActive": False, "updatedAt": utcnow()}})
        return await ClubService.get_club_by_id(db, club_id)
