from typing import Optional
from libs.shared.shared.errors.error_codes import ErrorCode


class AppException(Exception):
    def __init__(
        self,
        error_code: str,
        message: str,
        details: Optional[dict] = None,
        status_code: int = 400
    ):
        self.error_code = error_code
        self.message = message
        self.details = details or {}
        self.status_code = status_code
        super().__init__(self.message)


class NotFoundError(AppException):
    def __init__(self, resource: str, identifier: str):
        super().__init__(
            ErrorCode.NOT_FOUND,
            f"{resource} not found",
            {"resource": resource, "identifier": identifier},
            404
        )


class UnauthorizedError(AppException):
    def __init__(self, message: str = "Unauthorized"):
        super().__init__(
            ErrorCode.UNAUTHORIZED,
            message,
            status_code=401
        )


class ForbiddenError(AppException):
    def __init__(self, message: str = "Forbidden"):
        super().__init__(
            ErrorCode.FORBIDDEN,
            message,
            status_code=403
        )


class ConflictError(AppException):
    def __init__(self, message: str, details: Optional[dict] = None):
        super().__init__(
            ErrorCode.CONFLICT,
            message,
            details,
            409
        )
