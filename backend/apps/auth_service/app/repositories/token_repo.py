from typing import Optional
from sqlalchemy.orm import Session
from datetime import datetime, timezone
from apps.auth_service.app.db.models.refresh_token import RefreshToken


class TokenRepository:
    def __init__(self, db: Session):
        self.db = db
    
    def create(self, user_id: int, token: str, expires_at: datetime) -> RefreshToken:
        refresh_token = RefreshToken(
            user_id=user_id,
            token=token,
            expires_at=expires_at
        )
        self.db.add(refresh_token)
        self.db.commit()
        self.db.refresh(refresh_token)
        return refresh_token
    
    def get_by_token(self, token: str) -> Optional[RefreshToken]:
        return self.db.query(RefreshToken).filter(
            RefreshToken.token == token,
            RefreshToken.is_revoked == False,
            RefreshToken.expires_at > datetime.now(timezone.utc)
        ).first()
    
    def revoke_token(self, token: str) -> None:
        refresh_token = self.db.query(RefreshToken).filter(RefreshToken.token == token).first()
        if refresh_token:
            refresh_token.is_revoked = True
            self.db.commit()
    
    def revoke_all_user_tokens(self, user_id: int) -> None:
        self.db.query(RefreshToken).filter(RefreshToken.user_id == user_id).update(
            {"is_revoked": True}
        )
        self.db.commit()
