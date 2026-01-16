from functools import lru_cache, wraps
from typing import Dict, Callable
from datetime import datetime, timedelta
from fastapi import Request, HTTPException, status, Depends
from fastapi.routing import APIRoute
import functools


class RateLimiter:
    def __init__(self):
        self._requests: Dict[str, list] = {}
    
    def is_allowed(self, key: str, max_requests: int, window_seconds: int) -> bool:
        now = datetime.now()
        if key not in self._requests:
            self._requests[key] = []
        
        window_start = now - timedelta(seconds=window_seconds)
        self._requests[key] = [
            req_time for req_time in self._requests[key]
            if req_time > window_start
        ]
        
        if len(self._requests[key]) >= max_requests:
            return False
        
        self._requests[key].append(now)
        return True


_rate_limiter = RateLimiter()


def get_client_ip(request: Request) -> str:
    if request.client:
        return request.client.host
    return "unknown"


def check_rate_limit(request: Request, max_requests: int = 5, window_seconds: int = 60):
    """Dependency для проверки rate limit"""
    ip = get_client_ip(request)
    key = f"{request.url.path}:{ip}"
    
    if not _rate_limiter.is_allowed(key, max_requests, window_seconds):
        raise HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail="Too many requests"
        )


def rate_limit(max_requests: int = 5, window_seconds: int = 60):
    """Декоратор для rate limiting - использует dependency injection"""
    def decorator(func: Callable):
        # Создаем dependency функцию
        rate_limit_dep = functools.partial(check_rate_limit, max_requests=max_requests, window_seconds=window_seconds)
        
        # Сохраняем оригинальную функцию
        original_func = func
        
        # Создаем обертку, которая добавляет dependency
        @wraps(func)
        async def wrapper(*args, **kwargs):
            # Если Request уже в kwargs, проверяем rate limit
            request = kwargs.get('request')
            if request and isinstance(request, Request):
                ip = get_client_ip(request)
                key = f"{original_func.__name__}:{ip}"
                if not _rate_limiter.is_allowed(key, max_requests, window_seconds):
                    raise HTTPException(
                        status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                        detail="Too many requests"
                    )
            return await original_func(*args, **kwargs)
        
        # Добавляем dependency к функции через __annotations__
        if not hasattr(wrapper, '__annotations__'):
            wrapper.__annotations__ = {}
        
        return wrapper
    return decorator
