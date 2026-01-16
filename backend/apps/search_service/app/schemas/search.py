from typing import Optional
from pydantic import BaseModel, Field
from libs.shared.shared.dto.language import Lang
from libs.shared.shared.dto.filters import TermSort


class SearchFilters(BaseModel):
    category_id: Optional[int] = None
    include_children: bool = True
    letter: Optional[str] = Field(default=None, min_length=1, max_length=1)
    status: Optional[str] = None


class SearchRequestParams(BaseModel):
    q: str = Field(min_length=1, max_length=200)
    lang: Lang
    filters: SearchFilters = Field(default_factory=SearchFilters)
    sort: TermSort = TermSort.popularity
    page: int = Field(1, ge=1)
    size: int = Field(20, ge=1, le=100)


class SearchHit(BaseModel):
    term_id: int
    slug: str
    title: str
    short_definition: Optional[str]
    category_id: int
    rank: float


class AutocompleteHit(BaseModel):
    term_id: int
    slug: str
    title: str
