"""Unit tests for configuration loading and database URL construction."""

import pytest

from app.core.config import Settings


def test_settings_database_url_construction() -> None:
    settings = Settings(
        DB_HOST="192.168.1.100",
        DB_PORT=3307,
        DB_NAME="test_edusetara",
        DB_USER="custom_user",
        DB_PASSWORD="custom_password",
    )

    url = settings.get_primary_database_url()
    assert url.drivername == "mysql+asyncmy"
    assert url.host == "192.168.1.100"
    assert url.port == 3307
    assert url.database == "test_edusetara"
    assert url.username == "custom_user"
    assert url.password == "custom_password"
    assert url.query.get("charset") == "utf8mb4"


def test_external_databases_unconfigured_by_default() -> None:
    settings = Settings(
        SIMPEG_DB_USER=None,
        EGOV_DB_USER=None,
    )
    assert not settings.is_simpeg_configured()
    assert settings.get_simpeg_database_url() is None

    assert not settings.is_egov_configured()
    assert settings.get_egov_database_url() is None


def test_external_databases_when_configured() -> None:
    settings = Settings(
        SIMPEG_DB_NAME="custom_simpeg",
        SIMPEG_DB_USER="simpeg_usr",
        SIMPEG_DB_PASSWORD="simpeg_pwd",
        EGOV_DB_NAME="custom_egov",
        EGOV_DB_USER="egov_usr",
        EGOV_DB_PASSWORD="egov_pwd",
    )
    assert settings.is_simpeg_configured()
    simpeg_url = settings.get_simpeg_database_url()
    assert simpeg_url is not None
    assert simpeg_url.database == "custom_simpeg"
    assert simpeg_url.username == "simpeg_usr"

    assert settings.is_egov_configured()
    egov_url = settings.get_egov_database_url()
    assert egov_url is not None
    assert egov_url.database == "custom_egov"
    assert egov_url.username == "egov_usr"


def test_production_security_validation() -> None:
    # Insecure secret key in production raises ValueError
    insecure_settings = Settings(
        APP_ENV="production",
        JWT_SECRET_KEY="short",
        COOKIE_SECURE=True,
    )
    with pytest.raises(ValueError, match="JWT_SECRET_KEY must be at least 32"):
        insecure_settings.validate_security()

    # Insecure cookie in production raises ValueError
    insecure_cookie_settings = Settings(
        APP_ENV="production",
        JWT_SECRET_KEY="a_very_long_valid_secret_key_exceeding_32_chars",
        COOKIE_SECURE=False,
    )
    with pytest.raises(ValueError, match="COOKIE_SECURE must be True"):
        insecure_cookie_settings.validate_security()
