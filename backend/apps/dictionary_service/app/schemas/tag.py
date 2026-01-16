from pydantic import BaseModel, Field


class TagOut(BaseModel):
    id: int
    slug: str
    
    class Config:
        from_attributes = True


class TagCreateRequest(BaseModel):
    slug: str = Field(min_length=1, max_length=100)
