from pydantic import BaseModel


class FavoriteOut(BaseModel):
    term_id: int
    created_at: str
    
    class Config:
        from_attributes = True
