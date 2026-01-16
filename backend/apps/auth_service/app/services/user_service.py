from sqlalchemy.orm import Session
from apps.auth_service.app.repositories.user_repo import UserRepository
from apps.auth_service.app.schemas.user import ProfileUpdateRequest, ChangePasswordRequest
from apps.auth_service.app.schemas.auth import UserPublic
from apps.auth_service.app.core.security import verify_password, get_password_hash
from libs.shared.shared.errors.exceptions import NotFoundError, UnauthorizedError


class UserService:
    def __init__(self, db: Session):
        self.user_repo = UserRepository(db)
        self.db = db
    
    def get_profile(self, user_id: int) -> UserPublic:
        user = self.user_repo.get_by_id(user_id)
        if not user:
            raise NotFoundError("User", str(user_id))
        return UserPublic.model_validate(user)
    
    def update_profile(self, user_id: int, data: ProfileUpdateRequest) -> UserPublic:
        user = self.user_repo.get_by_id(user_id)
        if not user:
            raise NotFoundError("User", str(user_id))
        
        update_data = {}
        if data.name is not None:
            update_data["name"] = data.name
        
        if update_data:
            self.user_repo.update(user, **update_data)
        
        return UserPublic.model_validate(user)
    
    def change_password(self, user_id: int, data: ChangePasswordRequest) -> None:
        user = self.user_repo.get_by_id(user_id)
        if not user:
            raise NotFoundError("User", str(user_id))
        
        # Проверяем текущий пароль
        if not verify_password(data.current_password, user.password_hash):
            raise UnauthorizedError("Current password is incorrect")
        
        # Обновляем пароль
        new_password_hash = get_password_hash(data.new_password)
        self.user_repo.update(user, password_hash=new_password_hash)
