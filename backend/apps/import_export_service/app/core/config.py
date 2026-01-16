from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    app_name: str = "Import/Export Service"
    database_url: str = "sqlite:///./import_export_service.db"
    
    class Config:
        env_file = ".env"


settings = Settings()
