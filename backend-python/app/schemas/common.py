from typing import Generic, TypeVar, Optional, Any
from pydantic import BaseModel

T = TypeVar('T')

class ApiResponse(BaseModel, Generic[T]):
    success: bool
    message: str
    data: Optional[T] = None
    meta: Optional[Any] = None

def success_response(data: Any = None, message: str = "Success", meta: Any = None) -> dict:
    return {
        "success": True,
        "message": message,
        "data": data,
        "meta": meta
    }

class PaginationMeta(BaseModel):
    page: int
    limit: int
    total: int
    totalPages: int
