from datetime import timedelta
from fastapi import APIRouter, Depends, HTTPException, status

from app.core.security import create_access_token
from app.core.config import settings
from app.services.mongo_user_service import (
    create_user,
    verify_user_credentials,
)
from app.schemas.user import UserCreate, UserResponse
from app.schemas.auth import (
    Login,
    LoginResponse,
)
from app.api.deps import get_current_user

router = APIRouter()


@router.post("/register", response_model=LoginResponse, status_code=status.HTTP_201_CREATED)
async def register(user_in: UserCreate):
    existing = await create_user(
        user_in.email,
        user_in.fullName,
        user_in.password,
        user_in.avatar,
        user_in.globalRole,
    )
    if not existing:
        raise HTTPException(status_code=400, detail="The user with this email already exists in the system.")

    user = existing
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(subject=user["id"], role=user["globalRole"], expires_delta=access_token_expires)

    return {"user": user, "token": access_token}


@router.post("/login", response_model=LoginResponse)
async def login(login_data: Login):
    user = await verify_user_credentials(login_data.email, login_data.password)
    if not user:
        raise HTTPException(status_code=400, detail="Incorrect email or password")

    if not user.get("isActive", True):
        raise HTTPException(status_code=400, detail="Inactive user")

    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(subject=user["id"], role=user["globalRole"], expires_delta=access_token_expires)

    return {"user": user, "token": access_token}


@router.get("/me", response_model=UserResponse)
async def read_users_me(current_user=Depends(get_current_user)):
    return current_user


@router.post("/logout")
async def logout():
    return {"message": "Logged out successfully"}
