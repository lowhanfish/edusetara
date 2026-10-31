"""Custom exceptions and centralized exception handlers."""

import logging
from typing import Any

from fastapi import FastAPI, Request, status
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from starlette.exceptions import HTTPException as StarletteHTTPException

logger = logging.getLogger("edusetara.exceptions")


class AppException(Exception):
    """Base application exception."""

    def __init__(
        self,
        status_code: int = status.HTTP_500_INTERNAL_SERVER_ERROR,
        message: str = "An unexpected error occurred.",
        errors: Any = None,
    ):
        self.status_code = status_code
        self.message = message
        self.errors = errors
        super().__init__(self.message)


class BadRequestException(AppException):
    def __init__(self, message: str = "Bad request.", errors: Any = None):
        super().__init__(status.HTTP_400_BAD_REQUEST, message, errors)


class UnauthorizedException(AppException):
    def __init__(self, message: str = "Authentication required.", errors: Any = None):
        super().__init__(status.HTTP_401_UNAUTHORIZED, message, errors)


class ForbiddenException(AppException):
    def __init__(self, message: str = "Permission denied.", errors: Any = None):
        super().__init__(status.HTTP_403_FORBIDDEN, message, errors)


class NotFoundException(AppException):
    def __init__(self, message: str = "Resource not found.", errors: Any = None):
        super().__init__(status.HTTP_404_NOT_FOUND, message, errors)


class ConflictException(AppException):
    def __init__(self, message: str = "Resource conflict.", errors: Any = None):
        super().__init__(status.HTTP_409_CONFLICT, message, errors)


class RateLimitException(AppException):
    def __init__(
        self,
        message: str = "Too many requests. Please try again later.",
        errors: Any = None,
    ):
        super().__init__(status.HTTP_429_TOO_MANY_REQUESTS, message, errors)


class UnprocessableEntityException(AppException):
    def __init__(
        self,
        message: str = "Unprocessable entity.",
        errors: Any = None,
    ):
        super().__init__(status.HTTP_422_UNPROCESSABLE_CONTENT, message, errors)


def register_exception_handlers(app: FastAPI) -> None:
    """Register uniform envelope JSON error handlers on FastAPI application."""

    @app.exception_handler(AppException)
    async def app_exception_handler(_: Request, exc: AppException) -> JSONResponse:
        return JSONResponse(
            status_code=exc.status_code,
            content={
                "success": False,
                "statusCode": exc.status_code,
                "message": exc.message,
                "errors": exc.errors,
            },
        )

    @app.exception_handler(StarletteHTTPException)
    async def http_exception_handler(_: Request, exc: StarletteHTTPException) -> JSONResponse:
        message = exc.detail if isinstance(exc.detail, str) else "HTTP Exception"
        errors = exc.detail if not isinstance(exc.detail, str) else None
        return JSONResponse(
            status_code=exc.status_code,
            content={
                "success": False,
                "statusCode": exc.status_code,
                "message": message,
                "errors": errors,
            },
        )

    @app.exception_handler(RequestValidationError)
    async def validation_exception_handler(_: Request, exc: RequestValidationError) -> JSONResponse:
        clean_errors = []
        for err in exc.errors():
            loc = " -> ".join(str(loc_part) for loc_part in err.get("loc", []))
            clean_errors.append({"field": loc, "message": err.get("msg")})

        return JSONResponse(
            status_code=status.HTTP_422_UNPROCESSABLE_CONTENT,
            content={
                "success": False,
                "statusCode": status.HTTP_422_UNPROCESSABLE_CONTENT,
                "message": "Validation error in request payload.",
                "errors": clean_errors,
            },
        )

    @app.exception_handler(Exception)
    async def general_exception_handler(_: Request, exc: Exception) -> JSONResponse:
        logger.error(f"Unhandled Exception: {type(exc).__name__}: {str(exc)}", exc_info=True)
        return JSONResponse(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            content={
                "success": False,
                "statusCode": status.HTTP_500_INTERNAL_SERVER_ERROR,
                "message": "Internal server error. Please try again later.",
                "errors": None,
            },
        )
