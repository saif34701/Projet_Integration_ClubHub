from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.core.exceptions import setup_exception_handlers

from app.routers import (
    auth,
    users,
    clubs,
    membership,
    announcements,
    events,
    meetings,
    notifications,
    dashboard,
    ai
)

app = FastAPI(
    title=settings.APP_NAME,
    version="1.0.0",
    description="API FastAPI pour ISET ClubHub (Migration depuis Node.js)"
)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        settings.CLIENT_URL,
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

setup_exception_handlers(app)

app.include_router(auth.router, prefix="/api/auth", tags=["auth"])
app.include_router(users.router, prefix="/api/users", tags=["users"])
app.include_router(clubs.router, prefix="/api/clubs", tags=["clubs"])
app.include_router(membership.router, prefix="/api/membership", tags=["membership"])
app.include_router(announcements.router, prefix="/api/announcements", tags=["announcements"])
app.include_router(events.router, prefix="/api/events", tags=["events"])
app.include_router(meetings.router, prefix="/api/meetings", tags=["meetings"])
app.include_router(notifications.router, prefix="/api/notifications", tags=["notifications"])
app.include_router(dashboard.router, prefix="/api/dashboard", tags=["dashboard"])
app.include_router(ai.router, prefix="/api/ai", tags=["ai"])

@app.get("/")
async def root():
    return {"message": "Bienvenue sur l'API FastAPI de ISET ClubHub"}

@app.get("/api/health")
async def health_check():
    return {"status": "ok", "environment": settings.ENV}
