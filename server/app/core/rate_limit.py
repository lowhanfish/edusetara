"""Lightweight in-memory rate limiter without Redis dependency."""

import time
from collections import defaultdict
from threading import Lock

from fastapi import Request

from app.core.exceptions import RateLimitException


class InMemoryRateLimiter:
    """Thread-safe sliding window rate limiter per client IP."""

    def __init__(self, requests_per_minute: int = 15):
        self.rate = requests_per_minute
        self.window = 60.0  # seconds
        self._records: dict[str, list[float]] = defaultdict(list)
        self._lock = Lock()

    def check(self, request: Request) -> None:
        """Verify client IP rate limit; raise RateLimitException (429) if exceeded."""
        client_ip = request.client.host if request.client else "unknown"
        now = time.monotonic()

        with self._lock:
            timestamps = self._records[client_ip]
            # Discard timestamps older than window
            cutoff = now - self.window
            while timestamps and timestamps[0] < cutoff:
                timestamps.pop(0)

            if len(timestamps) >= self.rate:
                raise RateLimitException(
                    message=f"Too many requests from {client_ip}. Please wait a moment."
                )

            timestamps.append(now)


# Default auth rate limiter instance (e.g., 20 requests per minute per IP)
auth_rate_limiter = InMemoryRateLimiter(requests_per_minute=20)
