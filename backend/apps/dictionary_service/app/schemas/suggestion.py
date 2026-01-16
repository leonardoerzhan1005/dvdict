from typing import Optional
from pydantic import BaseModel, Field
from libs.shared.shared.dto.language import Lang


class SuggestionCreateRequest(BaseModel):
    category_id: Optional[int] = None
    language: Lang
    term_text: str = Field(min_length=1, max_length=255)
    definition: Optional[str] = None


class SuggestionOut(BaseModel):
    id: int
    user_id: int
    category_id: Optional[int]
    language: Lang
    term_text: str
    definition: Optional[str]
    status: str
    moderator_comment: Optional[str]
    created_at: str
    
    class Config:
        from_attributes = True


class RejectRequest(BaseModel):
    reason: str = Field(min_length=1, max_length=500)
