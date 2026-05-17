from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    APP_NAME: str = "ISET ClubHub API"
    ENV: str = "development"

    DATABASE_URL: str = "mongodb://localhost:27017"
    DATABASE_NAME: str = "clubhub"

    JWT_SECRET: str
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 1440
    CLIENT_URL: str = "http://localhost:5173"

    GEMINI_API_KEY: str | None = None
    GEMINI_MODEL: str = "gemini-3.1-flash-lite"

    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

settings = Settings()
