"""Application settings and environment configuration using Pydantic Settings."""

import json
from typing import Annotated, Any

from pydantic import BeforeValidator, Field, SecretStr, field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict
from sqlalchemy.engine import URL


def _parse_origins(v: Any) -> list[str]:
    if isinstance(v, str):
        v = v.strip()
        if v.startswith("[") and v.endswith("]"):
            try:
                return json.loads(v)
            except Exception:
                pass
        return [origin.strip() for origin in v.split(",") if origin.strip()]
    elif isinstance(v, list):
        return v
    return ["http://localhost:3000"]


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
        case_sensitive=True,
    )

    # ==========================
    # APPLICATION
    # ==========================
    APP_NAME: str = "EduSetara"
    APP_ENV: str = "development"
    APP_DEBUG: bool = True
    APP_HOST: str = "127.0.0.1"
    APP_PORT: int = 8000

    # ==========================
    # SHARED MYSQL SERVER
    # ==========================
    DB_HOST: str = "127.0.0.1"
    DB_PORT: int = 3306

    # ==========================
    # PRIMARY DATABASE (edusetara)
    # ==========================
    DB_NAME: str = "edusetara"
    DB_USER: str = "edusetara_user"
    DB_PASSWORD: SecretStr = Field(default=SecretStr(""))

    # ==========================
    # EXTERNAL DATABASE: SIMPEG (Optional)
    # ==========================
    SIMPEG_DB_NAME: str = "simpeg"
    SIMPEG_DB_USER: str | None = None
    SIMPEG_DB_PASSWORD: SecretStr | None = None

    # ==========================
    # EXTERNAL DATABASE: EGOV (Optional)
    # ==========================
    EGOV_DB_NAME: str = "egov"
    EGOV_DB_USER: str | None = None
    EGOV_DB_PASSWORD: SecretStr | None = None

    # ==========================
    # DATABASE POOL — PRIMARY
    # ==========================
    DB_POOL_SIZE: int = 10
    DB_MAX_OVERFLOW: int = 20
    DB_POOL_TIMEOUT: int = 30
    DB_POOL_RECYCLE: int = 1800
    DB_ECHO: bool = False

    # ==========================
    # DATABASE POOL — EXTERNAL
    # ==========================
    EXTERNAL_DB_POOL_SIZE: int = 5
    EXTERNAL_DB_MAX_OVERFLOW: int = 5
    EXTERNAL_DB_POOL_TIMEOUT: int = 30
    EXTERNAL_DB_POOL_RECYCLE: int = 1800

    # ==========================
    # AUTHENTICATION
    # ==========================
    JWT_SECRET_KEY: SecretStr = Field(
        default=SecretStr("replace_with_long_random_secret_minimum_32_characters")
    )
    JWT_ALGORITHM: str = "HS256"
    JWT_ISSUER: str = "edusetara-api"
    JWT_AUDIENCE: str = "edusetara-client"

    ACCESS_TOKEN_EXPIRE_MINUTES: int = 15
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7

    # ==========================
    # COOKIE SECURITY
    # ==========================
    COOKIE_SECURE: bool = False
    COOKIE_SAMESITE: str = "lax"
    COOKIE_DOMAIN: str | None = None
    COOKIE_ACCESS_PATH: str = "/"
    COOKIE_REFRESH_PATH: str = "/api/v1/auth"

    # ==========================
    # CORS
    # ==========================
    ALLOWED_ORIGINS: Annotated[list[str], BeforeValidator(_parse_origins)] = Field(
        default_factory=lambda: ["http://localhost:3000"]
    )

    @field_validator("COOKIE_SAMESITE")
    @classmethod
    def validate_samesite(cls, v: str) -> str:
        valid = {"lax", "strict", "none"}
        if v.lower() not in valid:
            raise ValueError(f"COOKIE_SAMESITE must be one of {valid}")
        return v.lower()

    def get_primary_database_url(self) -> URL:
        """Construct SQLAlchemy URL for primary edusetara database."""
        password_val = self.DB_PASSWORD.get_secret_value() if self.DB_PASSWORD else ""
        return URL.create(
            drivername="mysql+asyncmy",
            username=self.DB_USER,
            password=password_val,
            host=self.DB_HOST,
            port=self.DB_PORT,
            database=self.DB_NAME,
            query={"charset": "utf8mb4"},
        )

    def is_simpeg_configured(self) -> bool:
        """Check if credentials for SIMPEG external database are fully provided."""
        has_user = bool(self.SIMPEG_DB_USER and self.SIMPEG_DB_USER.strip())
        has_password = bool(
            self.SIMPEG_DB_PASSWORD and self.SIMPEG_DB_PASSWORD.get_secret_value().strip()
        )
        return has_user and has_password

    def get_simpeg_database_url(self) -> URL | None:
        """Construct SQLAlchemy URL for external SIMPEG database, or None if unconfigured."""
        if not self.is_simpeg_configured():
            return None
        password_val = self.SIMPEG_DB_PASSWORD.get_secret_value() if self.SIMPEG_DB_PASSWORD else ""
        return URL.create(
            drivername="mysql+asyncmy",
            username=self.SIMPEG_DB_USER,
            password=password_val,
            host=self.DB_HOST,
            port=self.DB_PORT,
            database=self.SIMPEG_DB_NAME,
            query={"charset": "utf8mb4"},
        )

    def is_egov_configured(self) -> bool:
        """Check if credentials for EGOV external database are fully provided."""
        has_user = bool(self.EGOV_DB_USER and self.EGOV_DB_USER.strip())
        has_password = bool(
            self.EGOV_DB_PASSWORD and self.EGOV_DB_PASSWORD.get_secret_value().strip()
        )
        return has_user and has_password

    def get_egov_database_url(self) -> URL | None:
        """Construct SQLAlchemy URL for external EGOV database, or None if unconfigured."""
        if not self.is_egov_configured():
            return None
        password_val = self.EGOV_DB_PASSWORD.get_secret_value() if self.EGOV_DB_PASSWORD else ""
        return URL.create(
            drivername="mysql+asyncmy",
            username=self.EGOV_DB_USER,
            password=password_val,
            host=self.DB_HOST,
            port=self.DB_PORT,
            database=self.EGOV_DB_NAME,
            query={"charset": "utf8mb4"},
        )

    def validate_security(self) -> None:
        """Startup security validation."""
        if self.APP_ENV == "production":
            if len(self.JWT_SECRET_KEY.get_secret_value()) < 32:
                raise ValueError("JWT_SECRET_KEY must be at least 32 characters in production.")
            if not self.COOKIE_SECURE:
                raise ValueError("COOKIE_SECURE must be True in production environment.")


settings = Settings()
