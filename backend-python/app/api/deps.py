from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import jwt, JWTError
from pydantic import ValidationError

from app.core.config import settings
from app.core.database import db
from app.models.enums import GlobalRole
from app.schemas.auth import TokenPayload
from app.services.mongo_utils import utcnow

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/login")

class CurrentUser(dict):
    def __getattr__(self, key):
        try:
            return self[key]
        except KeyError as exc:
            raise AttributeError(key) from exc

async def get_current_user(token: str = Depends(oauth2_scheme)):
    try:
        payload = jwt.decode(
            token,
            settings.JWT_SECRET,
            algorithms=[settings.JWT_ALGORITHM]
        )
        token_data = TokenPayload(**payload)
    except (JWTError, ValidationError):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Could not validate credentials",
        )

    user = await db.users.find_one({"_id": token_data.sub})

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    if not user.get("isActive", True):
        raise HTTPException(status_code=400, detail="Inactive user")

    user["id"] = user.get("_id")
    user.pop("_id", None)
    now = utcnow()
    user.setdefault("createdAt", now)
    user.setdefault("updatedAt", user["createdAt"])
    return CurrentUser(user)

def get_current_active_user(current_user = Depends(get_current_user)):
    if not current_user.get("isActive", True):
        raise HTTPException(status_code=400, detail="Inactive user")
    return current_user

def require_role(allowed_roles: list[GlobalRole]):
    def role_checker(current_user = Depends(get_current_active_user)):
        user_role = current_user.get("globalRole")

        allowed_values = [r.value if hasattr(r, "value") else r for r in allowed_roles]
        if user_role not in allowed_values:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Not enough permissions"
            )

        return current_user

    return role_checker

require_admin = require_role([GlobalRole.ADMIN])
require_manager = require_role([GlobalRole.ADMIN, GlobalRole.CLUB_MANAGER])
