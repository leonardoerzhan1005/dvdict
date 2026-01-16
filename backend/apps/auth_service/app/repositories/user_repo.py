from typing import Optional
from sqlalchemy.orm import Session
from apps.auth_service.app.db.models.user import User
from libs.shared.shared.utils.normalizers import normalize_email


class UserRepository:
    def __init__(self, db: Session):
        self.db = db
    
    def create(self, name: str, email: str, password_hash: str, role: str = "user") -> User:
        user = User(
            name=name,
            email=normalize_email(email),
            password_hash=password_hash,
            role=role
        )
        self.db.add(user)
        self.db.commit()
        self.db.refresh(user)
        return user
    
    def get_by_id(self, user_id: int) -> Optional[User]:
        return self.db.query(User).filter(User.id == user_id).first()
    
    def get_by_email(self, email: str) -> Optional[User]:
        return self.db.query(User).filter(User.email == normalize_email(email)).first()
    
    def update(self, user: User, **kwargs) -> User:
        for key, value in kwargs.items():
            if hasattr(user, key):
                setattr(user, key, value)
        self.db.commit()
        self.db.refresh(user)
        return user
    
    def delete(self, user: User) -> None:
        self.db.delete(user)
        self.db.commit()
