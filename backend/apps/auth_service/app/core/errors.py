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


async def validation_exception_handler(request: Request, exc):
    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content=ErrorResponse(
            error_code="VALIDATION_ERROR",
            message="Validation error",
            details={"errors": exc.errors()}
        ).model_dump()
    )
