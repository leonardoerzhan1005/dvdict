from typing import Optional
from pydantic import BaseModel, Field
from libs.shared.shared.dto.language import Lang


class CategoryTranslationIn(BaseModel):
    language: Lang
    title: str = Field(min_length=1, max_length=255)
    description: Optional[str] = None


class CategoryCreateRequest(BaseModel):
    slug: str = Field(min_length=1, max_length=150)
    parent_id: Optional[int] = None
    translations: list[CategoryTranslationIn]


class CategoryUpdateRequest(BaseModel):
    slug: Optional[str] = Field(default=None, min_length=1, max_length=150)
    parent_id: Optional[int] = None
    translations: Optional[list[CategoryTranslationIn]] = None


class CategoryOut(BaseModel):
    id: int
    slug: str
    parent_id: Optional[int]
    title: str
    description: Optional[str]
    
    class Config:
        from_attributes = True
