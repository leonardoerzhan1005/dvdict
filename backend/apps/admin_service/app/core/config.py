from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    app_name: str = "Admin Service"
    database_url: str = "sqlite:///./admin_service.db"
    
    class Config:
        env_file = ".env"


settings = Settings()
