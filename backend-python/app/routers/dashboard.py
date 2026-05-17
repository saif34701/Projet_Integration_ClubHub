from fastapi import APIRouter, Depends
from app.core.database import get_db
from app.schemas.common import success_response
from app.services.dashboard_service import DashboardService
from app.api.deps import get_current_user, require_admin, require_manager

router = APIRouter()

@router.get("/admin", dependencies=[Depends(require_admin)])
async def get_admin_dashboard(db = Depends(get_db)):
    stats = await DashboardService.get_admin_stats(db)
    return success_response(data=stats, message="Admin dashboard retrieved")

@router.get("/responsable", dependencies=[Depends(require_manager)])
async def get_responsable_dashboard(db = Depends(get_db), current_user = Depends(get_current_user)):
    stats = await DashboardService.get_responsable_stats(db, current_user.id)
    return success_response(data=stats, message="Responsable dashboard retrieved")

@router.get("/student")
async def get_student_dashboard(db = Depends(get_db), current_user = Depends(get_current_user)):
    stats = await DashboardService.get_student_stats(db, current_user.id)
    return success_response(data=stats, message="Student dashboard retrieved")
