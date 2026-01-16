from typing import Optional
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from apps.dictionary_service.app.db.session import get_db
from apps.auth_service.app.core.security import decode_token
from apps.auth_service.app.repositories.user_repo import UserRepository
from apps.auth_service.app.core.config import settings

security = HTTPBearer()


def get_current_user_id(
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(HTTPBearer(auto_error=False))
) -> Optional[int]:
    if not credentials:
        return None
    
    payload = decode_token(credentials.credentials)
    if not payload or "sub" not in payload:
        return None
    
    return int(payload["sub"])


def get_current_user_role(
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(HTTPBearer(auto_error=False))
) -> Optional[str]:
    if not credentials:
        return None
    
    payload = decode_token(credentials.credentials)
    if not payload:
        return None
    
    return payload.get("role", "user")
