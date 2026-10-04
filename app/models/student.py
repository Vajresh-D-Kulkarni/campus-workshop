from pydantic import BaseModel, EmailStr, Field
from typing import Optional

class StudentCreate(BaseModel):
    name: str = Field(..., example="John Doe")
    roll_no: str = Field(..., example="CS2024-001")
    branch: str = Field(..., example="Computer Science")
    year: int = Field(..., ge=1, le=4, example=3)
    email: EmailStr = Field(..., example="john.doe@example.com")

class StudentUpdate(BaseModel):
    name: Optional[str] = None
    roll_no: Optional[str] = None
    branch: Optional[str] = None
    year: Optional[int] = Field(None, ge=1, le=4)
    email: Optional[EmailStr] = None

class StudentResponse(StudentCreate):
    id: str
