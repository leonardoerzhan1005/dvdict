from datetime import datetime, timedelta, timezone
from sqlalchemy.orm import Session
from apps.auth_service.app.repositories.user_repo import UserRepository
from apps.auth_service.app.repositories.token_repo import TokenRepository
from apps.auth_service.app.core.security import (
    verify_password,
    get_password_hash,
    create_access_token,
    create_refresh_token,
    decode_token,
    create_email_verification_token,
    create_password_reset_token
)
from apps.auth_service.app.core.config import settings
from libs.shared.shared.errors.exceptions import ConflictError, UnauthorizedError, NotFoundError
from apps.auth_service.app.schemas.auth import (
    RegisterRequest,
    LoginRequest,
    TokenPair,
    UserPublic
)


class AuthService:
    def __init__(self, db: Session):
        self.user_repo = UserRepository(db)
        self.token_repo = TokenRepository(db)
        self.db = db
    
    def register(self, data: RegisterRequest) -> UserPublic:
        existing_user = self.user_repo.get_by_email(data.email)
        if existing_user:
            raise ConflictError("User with this email already exists")
        
        password_hash = get_password_hash(data.password)
        user = self.user_repo.create(
            name=data.name,
            email=data.email,
            password_hash=password_hash
        )
        
        return UserPublic.model_validate(user)
    
    def login(self, data: LoginRequest) -> tuple[UserPublic, TokenPair]:
        user = self.user_repo.get_by_email(data.email)
        if not user or not verify_password(data.password, user.password_hash):
            raise UnauthorizedError("Invalid email or password")
        
        access_token_expires = timedelta(minutes=settings.access_token_expire_minutes)
        access_token = create_access_token(
            data={"sub": str(user.id), "role": user.role},
            expires_delta=access_token_expires
        )
        
        refresh_token = create_refresh_token(data={"sub": str(user.id), "role": user.role})
        refresh_expires = datetime.now(timezone.utc) + timedelta(days=settings.refresh_token_expire_days)
        
        self.token_repo.create(user.id, refresh_token, refresh_expires)
        
        tokens = TokenPair(
            access_token=access_token,
            refresh_token=refresh_token,
            expires_in=settings.access_token_expire_minutes * 60
        )
        
        return UserPublic.model_validate(user), tokens
    
    def refresh_tokens(self, refresh_token: str) -> TokenPair:
        token_data = decode_token(refresh_token)
        if not token_data or token_data.get("type") != "refresh":
            raise UnauthorizedError("Invalid refresh token")
        
        stored_token = self.token_repo.get_by_token(refresh_token)
        if not stored_token:
            raise UnauthorizedError("Refresh token not found or expired")
        
        user = self.user_repo.get_by_id(stored_token.user_id)
        if not user:
            raise NotFoundError("User", str(stored_token.user_id))
        
        access_token_expires = timedelta(minutes=settings.access_token_expire_minutes)
        new_access_token = create_access_token(
            data={"sub": str(user.id), "role": user.role},
            expires_delta=access_token_expires
        )
        
        new_refresh_token = create_refresh_token(data={"sub": str(user.id), "role": user.role})
        refresh_expires = datetime.now(timezone.utc) + timedelta(days=settings.refresh_token_expire_days)
        
        self.token_repo.revoke_token(refresh_token)
        self.token_repo.create(user.id, new_refresh_token, refresh_expires)
        
        return TokenPair(
            access_token=new_access_token,
            refresh_token=new_refresh_token,
            expires_in=settings.access_token_expire_minutes * 60
        )
    
    def logout(self, refresh_token: str) -> None:
        self.token_repo.revoke_token(refresh_token)
    
    def create_email_verification_token(self, user_id: int) -> str:
        return create_email_verification_token(user_id)
    
    def verify_email(self, token: str) -> UserPublic:
        token_data = decode_token(token)
        if not token_data or token_data.get("type") != "email_verification":
            raise UnauthorizedError("Invalid verification token")
        
        user_id = token_data.get("user_id")
        if not user_id:
            raise UnauthorizedError("Invalid token payload")
        
        user = self.user_repo.get_by_id(user_id)
        if not user:
            raise NotFoundError("User", str(user_id))
        
        self.user_repo.update(user, is_email_verified=True)
        return UserPublic.model_validate(user)
    
    def create_password_reset_token(self, email: str) -> str:
        user = self.user_repo.get_by_email(email)
        if not user:
            return ""
        
        return create_password_reset_token(user.id)
    
    def reset_password(self, token: str, new_password: str) -> None:
        token_data = decode_token(token)
        if not token_data or token_data.get("type") != "password_reset":
            raise UnauthorizedError("Invalid reset token")
        
        user_id = token_data.get("user_id")
        if not user_id:
            raise UnauthorizedError("Invalid token payload")
        
        user = self.user_repo.get_by_id(user_id)
        if not user:
            raise NotFoundError("User", str(user_id))
        
        password_hash = get_password_hash(new_password)
        self.user_repo.update(user, password_hash=password_hash)
