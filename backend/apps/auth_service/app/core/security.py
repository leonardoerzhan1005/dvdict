from datetime import datetime, timedelta, timezone
from typing import Optional
from jose import JWTError, jwt
import bcrypt
from libs.shared.shared.security.roles import Role
from apps.auth_service.app.core.config import settings


def verify_password(plain_password: str, hashed_password: str) -> bool:
    password_bytes = plain_password.encode('utf-8')
    hashed_bytes = hashed_password.encode('utf-8')
    return bcrypt.checkpw(password_bytes, hashed_bytes)


def get_password_hash(password: str) -> str:
    password_bytes = password.encode('utf-8')
    salt = bcrypt.gensalt()
    hashed = bcrypt.hashpw(password_bytes, salt)
    return hashed.decode('utf-8')


def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=settings.access_token_expire_minutes)
    to_encode.update({"exp": expire, "iat": datetime.now(timezone.utc)})
    encoded_jwt = jwt.encode(to_encode, settings.secret_key, algorithm=settings.algorithm)
    return encoded_jwt


def create_refresh_token(data: dict) -> str:
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + timedelta(days=settings.refresh_token_expire_days)
    to_encode.update({"exp": expire, "iat": datetime.now(timezone.utc), "type": "refresh"})
    encoded_jwt = jwt.encode(to_encode, settings.secret_key, algorithm=settings.algorithm)
    return encoded_jwt


def decode_token(token: str) -> dict:
    try:
        payload = jwt.decode(token, settings.secret_key, algorithms=[settings.algorithm])
        return payload
    except JWTError:
        return {}


def create_email_verification_token(user_id: int) -> str:
    data = {"user_id": user_id, "type": "email_verification"}
    expire = datetime.now(timezone.utc) + timedelta(hours=settings.email_verification_token_expire_hours)
    data.update({"exp": expire, "iat": datetime.now(timezone.utc)})
    return jwt.encode(data, settings.secret_key, algorithm=settings.algorithm)


def create_password_reset_token(user_id: int) -> str:
    data = {"user_id": user_id, "type": "password_reset"}
    expire = datetime.now(timezone.utc) + timedelta(hours=settings.password_reset_token_expire_hours)
    data.update({"exp": expire, "iat": datetime.now(timezone.utc)})
    return jwt.encode(data, settings.secret_key, algorithm=settings.algorithm)
