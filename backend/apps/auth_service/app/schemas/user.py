from typing import Optional
from pydantic import BaseModel, EmailStr, Field
from apps.auth_service.app.schemas.auth import UserPublic


class ProfileResponse(BaseModel):
    user: UserPublic


class ProfileUpdateRequest(BaseModel):
    name: Optional[str] = Field(default=None, min_length=2, max_length=150)


class ChangePasswordRequest(BaseModel):
    current_password: str
    new_password: str = Field(min_length=8, max_length=128)
