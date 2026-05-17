from typing import Optional
from app.core.mongo import get_mongo_db
from app.core.security import get_password_hash, verify_password
from app.models.enums import GlobalRole
from app.services.mongo_utils import public_doc, utcnow, new_id

def _users_coll():
    db = get_mongo_db()
    if db is None:
        raise RuntimeError("MongoDB not initialized")
    return db.get_collection("users")

async def create_user(
    email: str,
    fullName: str,
    password: Optional[str] = None,
    avatar: Optional[str] = None,
    role: GlobalRole = GlobalRole.STUDENT,
):
    users = _users_coll()
    existing = await users.find_one({"email": email})
    if existing:
        return None

    now = utcnow()
    role_value = role.value if hasattr(role, "value") else str(role)
    user = {
        "_id": new_id(),
        "email": email,
        "fullName": fullName,
        "avatar": avatar,
        "passwordHash": get_password_hash(password) if password else None,
        "globalRole": role_value,
        "isActive": True,
        "createdAt": now,
        "updatedAt": now,
    }
    await users.insert_one(user)
    return public_doc(user)

async def get_user_by_email(email: str):
    users = _users_coll()
    u = await users.find_one({"email": email})
    if not u:
        return None
    return public_doc(u)

async def get_user_by_id(id: str):
    users = _users_coll()
    u = await users.find_one({"_id": id})
    if not u:
        return None
    return public_doc(u)

async def verify_user_credentials(email: str, password: str):
    u = await get_user_by_email(email)
    if not u or not u.get("passwordHash"):
        return None
    if not verify_password(password, u["passwordHash"]):
        return None
    return u
