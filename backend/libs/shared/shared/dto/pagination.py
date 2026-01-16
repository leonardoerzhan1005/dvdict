from pydantic import BaseModel, Field


class PageParams(BaseModel):
    page: int = Field(1, ge=1)
    size: int = Field(20, ge=1, le=100)


class PageMeta(BaseModel):
    page: int
    size: int
    total: int
    pages: int


class PageResponse(BaseModel):
    meta: PageMeta
    items: list
