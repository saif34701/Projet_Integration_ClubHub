from fastapi import Request
from fastapi.responses import JSONResponse
from app.schemas.common import success_response
import logging

class AppException(Exception):
    def __init__(self, status_code: int, message: str, data: dict = None):
        self.status_code = status_code
        self.message = message
        self.data = data

async def app_exception_handler(request: Request, exc: AppException):
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "success": False,
            "message": exc.message,
            "data": exc.data
        }
    )

async def generic_exception_handler(request: Request, exc: Exception):
    logging.error(f"Erreur inattendue: {exc}")
    return JSONResponse(
        status_code=500,
        content={
            "success": False,
            "message": "Erreur interne du serveur. Veuillez réessayer plus tard."
        }
    )

def setup_exception_handlers(app):
    app.add_exception_handler(AppException, app_exception_handler)
    app.add_exception_handler(Exception, generic_exception_handler)
