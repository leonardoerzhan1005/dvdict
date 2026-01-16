from pydantic import BaseModel


class StatusOut(BaseModel):
    id: int
    status: str
    
    class Config:
        from_attributes = True


class RejectRequest(BaseModel):
    reason: str
