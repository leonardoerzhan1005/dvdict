from pydantic_settings import BaseSettings


from pathlib import Path

class Settings(BaseSettings):
    app_name: str = "Dictionary Service"
    # Путь относительно директории, где запускается сервер (apps/dictionary_service/)
    database_url: str = "sqlite:///./dictionary_service.db"
    
    class Config:
        env_file = ".env"


settings = Settings()
