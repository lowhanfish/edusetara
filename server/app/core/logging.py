"""Logging configuration for EduSetara."""

import logging
import sys

from app.core.config import settings


def setup_logging() -> None:
    """Configure structured and secure logging."""
    log_level = logging.DEBUG if settings.APP_DEBUG else logging.INFO

    # Custom log format without exposing sensitive details
    log_format = "%(asctime)s | %(levelname)-8s | %(name)s:%(funcName)s:%(lineno)d - %(message)s"

    logging.basicConfig(
        level=log_level,
        format=log_format,
        handlers=[logging.StreamHandler(sys.stdout)],
        force=True,
    )

    # Silence overly verbose external libraries
    logging.getLogger("uvicorn.access").setLevel(logging.INFO)
    logging.getLogger("asyncmy").setLevel(logging.WARNING)
    logging.getLogger("sqlalchemy.engine").setLevel(
        logging.INFO if settings.DB_ECHO else logging.WARNING
    )


logger = logging.getLogger("edusetara")
