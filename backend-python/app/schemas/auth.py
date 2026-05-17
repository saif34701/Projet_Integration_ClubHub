from pydantic import BaseModel
from app.schemas.user import UserResponse

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenPayload(BaseModel):
    sub: str = None
    role: str = None

class Login(BaseModel):
    email: str
    password: str

class LoginResponse(BaseModel):
    user: UserResponse
    token: str
