from typing import Optional
from pydantic import BaseModel


class TokenClaims(BaseModel):
    sub: str
    role: str
    exp: Optional[int] = None
    iat: Optional[int] = None
