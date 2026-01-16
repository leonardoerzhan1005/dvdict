from fastapi import APIRouter, Depends, Request, status
from sqlalchemy.orm import Session
from apps.auth_service.app.db.session import get_db
from apps.auth_service.app.services.auth_service import AuthService
from apps.auth_service.app.services.email_service import EmailService
from apps.auth_service.app.core.rate_limit import rate_limit
from apps.auth_service.app.schemas.auth import (
    RegisterRequest,
    RegisterResponse,
    LoginRequest,
    LoginResponse,
    RefreshRequest,
    RefreshResponse,
    ForgotPasswordRequest,
    ResetPasswordRequest,
    EmailVerifyRequest
)
from apps.auth_service.app.api.v1.deps import get_current_user
from apps.auth_service.app.db.models.user import User

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/register", response_model=RegisterResponse, status_code=status.HTTP_201_CREATED)
@rate_limit(max_requests=5, window_seconds=300)
async def register(
    data: RegisterRequest,
    request: Request,
    db: Session = Depends(get_db)
):
    auth_service = AuthService(db)
    email_service = EmailService()
    
    user = auth_service.register(data)
    
    verification_token = auth_service.create_email_verification_token(user.id)
    email_service.send_verification_email(user.email, verification_token)
    
    return RegisterResponse(user=user)


@router.post("/login", response_model=LoginResponse)
async def login(
    data: LoginRequest,
    request: Request,
    db: Session = Depends(get_db)
):
    auth_service = AuthService(db)
    user, tokens = auth_service.login(data)
    return LoginResponse(user=user, tokens=tokens)


@router.post("/refresh", response_model=RefreshResponse)
async def refresh(
    data: RefreshRequest,
    db: Session = Depends(get_db)
):
    auth_service = AuthService(db)
    tokens = auth_service.refresh_tokens(data.refresh_token)
    return RefreshResponse(tokens=tokens)


@router.post("/logout")
async def logout(
    data: RefreshRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    auth_service = AuthService(db)
    auth_service.logout(data.refresh_token)
    return {"message": "Logged out successfully"}


@router.post("/password/forgot")
@rate_limit(max_requests=3, window_seconds=3600)
async def forgot_password(
    data: ForgotPasswordRequest,
    request: Request,
    db: Session = Depends(get_db)
):
    auth_service = AuthService(db)
    email_service = EmailService()
    
    reset_token = auth_service.create_password_reset_token(data.email)
    if reset_token:
        email_service.send_password_reset_email(data.email, reset_token)
    
    return {"message": "If email exists, password reset link has been sent"}


@router.post("/password/reset")
async def reset_password(
    data: ResetPasswordRequest,
    db: Session = Depends(get_db)
):
    auth_service = AuthService(db)
    auth_service.reset_password(data.token, data.new_password)
    return {"message": "Password reset successfully"}


@router.post("/email/verify")
async def verify_email(
    data: EmailVerifyRequest,
    db: Session = Depends(get_db)
):
    auth_service = AuthService(db)
    user = auth_service.verify_email(data.token)
    return {"message": "Email verified successfully", "user": user}
