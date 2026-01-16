from typing import List
from libs.shared.shared.security.roles import Role
from libs.shared.shared.errors.exceptions import ForbiddenError


def require_roles(allowed_roles: List[Role]):
    def decorator(func):
        def wrapper(*args, **kwargs):
            user_role = kwargs.get("user_role")
            if not user_role or Role(user_role) not in allowed_roles:
                raise ForbiddenError("Insufficient permissions")
            return func(*args, **kwargs)
        return wrapper
    return decorator


def check_role(user_role: str, required_roles: List[Role]) -> bool:
    try:
        return Role(user_role) in required_roles
    except ValueError:
        return False
