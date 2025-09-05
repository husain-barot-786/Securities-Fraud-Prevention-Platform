import os
from typing import ClassVar
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    APP_NAME: str = "Securities Fraud Prevention"
    DEBUG: bool = True
    DATABASE_URL: ClassVar[str] = "sqlite:///./app/main.db"
    SECRET_KEY: str = os.getenv("SECRET_KEY", "changeme")

settings = Settings()
