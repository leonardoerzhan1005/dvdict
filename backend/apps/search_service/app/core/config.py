from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    app_name: str = "Search Service"
    database_url: str = "sqlite:///./search_service.db"
    
    class Config:
        env_file = ".env"


settings = Settings()
