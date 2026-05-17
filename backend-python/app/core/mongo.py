from typing import Optional
from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorDatabase
from app.core.config import settings

_client: Optional[AsyncIOMotorClient] = None
_db: Optional[AsyncIOMotorDatabase] = None

def init_mongo() -> None:
    global _client, _db
    _client = AsyncIOMotorClient(settings.DATABASE_URL)
    _db = _client[settings.DATABASE_NAME]

# initialize at import time (safe if settings loaded)
try:
    init_mongo()
except Exception:
    _client = None
    _db = None

def get_mongo_db() -> Optional[AsyncIOMotorDatabase]:
    return _db

def get_mongo_client() -> Optional[AsyncIOMotorClient]:
    return _client
