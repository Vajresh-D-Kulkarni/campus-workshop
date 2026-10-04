from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    mongo_uri: str = "mongodb://localhost:27017"
    db_name: str = "student_workshop_db"
    
    class Config:
        env_file = ".env"

settings = Settings()
