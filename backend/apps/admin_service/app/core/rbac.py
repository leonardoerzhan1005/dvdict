from typing import List
from libs.shared.shared.security.roles import Role
from libs.shared.shared.errors.exceptions import ForbiddenError


def check_role(user_role: str, required_roles: List[Role]) -> bool:
    try:
        return Role(user_role) in required_roles
    except ValueError:
        return False


def require_role(user_role: str, required_roles: List[Role]) -> None:
    if not check_role(user_role, required_roles):
        raise ForbiddenError("Insufficient permissions")
