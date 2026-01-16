from typing import Optional
from pydantic import BaseModel, Field
from libs.shared.shared.dto.language import Lang
from apps.dictionary_service.app.schemas.tag import TagOut


class TermTranslationIn(BaseModel):
    language: Lang
    title: str = Field(min_length=1, max_length=255)
    definition: str = Field(min_length=1)
    short_definition: Optional[str] = None
    examples: Optional[str] = None
    synonyms: Optional[str] = None
    antonyms: Optional[str] = None


class TermCreateRequest(BaseModel):
    slug: str = Field(min_length=1, max_length=255)
    category_id: int
    translations: list[TermTranslationIn]
    tag_slugs: list[str] = Field(default_factory=list)


class TermUpdateRequest(BaseModel):
    slug: Optional[str] = Field(default=None, min_length=1, max_length=255)
    category_id: Optional[int] = None
    translations: Optional[list[TermTranslationIn]] = None
    tag_slugs: Optional[list[str]] = None


class TermTranslationOut(BaseModel):
    language: Lang
    title: str
    definition: str
    short_definition: Optional[str]
    examples: Optional[str]
    synonyms: Optional[str]
    antonyms: Optional[str]
    
    class Config:
        from_attributes = True


class TermOut(BaseModel):
    id: int
    slug: str
    category_id: int
    status: str
    views: int
    created_at: str
    updated_at: str
    language: Lang
    title: str
    definition: str
    short_definition: Optional[str]
    examples: Optional[str]
    synonyms: Optional[str]
    antonyms: Optional[str]
    tags: list[TagOut]
    
    class Config:
        from_attributes = True


class TermOutFull(BaseModel):
    id: int
    slug: str
    category_id: int
    status: str
    views: int
    created_at: str
    updated_at: str
    translations: list[TermTranslationOut]
    tags: list[TagOut]
    
    class Config:
        from_attributes = True
