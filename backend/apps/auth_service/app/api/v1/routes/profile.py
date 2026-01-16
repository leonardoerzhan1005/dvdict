from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from apps.auth_service.app.db.session import get_db
from apps.auth_service.app.services.user_service import UserService
from apps.auth_service.app.schemas.user import ProfileResponse, ProfileUpdateRequest, ChangePasswordRequest
from apps.auth_service.app.api.v1.deps import get_current_user
from apps.auth_service.app.db.models.user import User

router = APIRouter(prefix="/profile", tags=["profile"])


@router.get("", response_model=ProfileResponse)
async def get_profile(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    user_service = UserService(db)
    user = user_service.get_profile(current_user.id)
    return ProfileResponse(user=user)


@router.patch("", response_model=ProfileResponse)
async def update_profile(
    data: ProfileUpdateRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    user_service = UserService(db)
    user = user_service.update_profile(current_user.id, data)
    return ProfileResponse(user=user)


@router.post("/password/change")
async def change_password(
    data: ChangePasswordRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    user_service = UserService(db)
    user_service.change_password(current_user.id, data)
    return {"message": "Password changed successfully"}
