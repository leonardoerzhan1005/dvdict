from pydantic import BaseModel, Field


class IDResponse(BaseModel):
    id: int
