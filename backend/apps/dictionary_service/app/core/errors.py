from fastapi import Request, status
from fastapi.responses import JSONResponse
from libs.shared.shared.errors.exceptions import AppException
from libs.shared.shared.dto.common import ErrorResponse


async def app_exception_handler(request: Request, exc: AppException):
    return JSONResponse(
        status_code=exc.status_code,
        content=ErrorResponse(
            error_code=exc.error_code,
            message=exc.message,
            details=exc.details
        ).model_dump()
    )
