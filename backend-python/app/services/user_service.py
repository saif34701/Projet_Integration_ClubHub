from app.schemas.user import UserUpdate
from app.core.exceptions import AppException
from app.services.mongo_utils import pagination_meta, public_doc, to_mongo_data, utcnow


class UserService:
    @staticmethod
    async def get_all_users(db, page: int = 1, limit: int = 10, search: str = None):
        query = {}
        if search:
            query["$or"] = [
                {"fullName": {"$regex": search, "$options": "i"}},
                {"email": {"$regex": search, "$options": "i"}},
            ]

        skip = (page - 1) * limit
        cursor = db.users.find(query).sort("createdAt", -1).skip(skip).limit(limit)
        users = [public_doc(user) async for user in cursor]
        total = await db.users.count_documents(query)

        return {
            "users": users,
            "meta": pagination_meta(page, limit, total),
        }

    @staticmethod
    async def get_user_by_id(db, user_id: str):
        user = await db.users.find_one({"_id": user_id})
        if not user:
            raise AppException(status_code=404, message="User not found")
        return public_doc(user)

    @staticmethod
    async def update_user(db, user_id: str, data: UserUpdate):
        await UserService.get_user_by_id(db, user_id)
        update_data = to_mongo_data(data, exclude_unset=True)
        if not update_data:
            return await UserService.get_user_by_id(db, user_id)

        update_data["updatedAt"] = utcnow()
        await db.users.update_one({"_id": user_id}, {"$set": update_data})
        return await UserService.get_user_by_id(db, user_id)
