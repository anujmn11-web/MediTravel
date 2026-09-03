import os
from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    PROJECT_NAME: str = "MediTravel API"
    DATABASE_URL: str = "postgresql://postgres:postgres@localhost:5432/meditravel"

    # ── JWT Auth Settings ────────────────────────────────────────────────────
    # Override SECRET_KEY in .env for production!
    SECRET_KEY: str = "changeme-meditravel-dev-secret-key-at-least-32-chars"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24  # 24 hours

    # Config model for Pydantic v2
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=True,
        extra="ignore"
    )

settings = Settings()
