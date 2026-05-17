from fastapi import APIRouter, Depends, HTTPException
from app.schemas.common import success_response
from app.services.ai_service import AiService, GenerateCaptionRequest
from app.api.deps import require_manager

router = APIRouter()

@router.post("/generate-caption", dependencies=[Depends(require_manager)])
async def generate_caption(request: GenerateCaptionRequest):
    try:
        result = await AiService.generate_caption(request.prompt, request.clubName)
    except RuntimeError as exc:
        raise HTTPException(status_code=502, detail=str(exc))
    return success_response(data=result, message="Caption generated successfully")
