from fastapi import APIRouter, HTTPException, status
from typing import List

from app.models.student import StudentCreate, StudentUpdate, StudentResponse
from app.crud.student import create_student, get_all_students, get_student, update_student, delete_student

router = APIRouter()

@router.post("/", response_model=StudentResponse, status_code=status.HTTP_201_CREATED)
async def create_student_endpoint(student: StudentCreate):
    created_student = await create_student(student)
    return created_student

@router.get("/", response_model=List[StudentResponse])
async def get_all_students_endpoint():
    return await get_all_students()

@router.get("/{id}", response_model=StudentResponse)
async def get_student_endpoint(id: str):
    student = await get_student(id)
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")
    return student

@router.put("/{id}", response_model=StudentResponse)
async def update_student_endpoint(id: str, data: StudentUpdate):
    updated_student = await update_student(id, data)
    if not updated_student:
        raise HTTPException(status_code=404, detail="Student not found")
    return updated_student

@router.delete("/{id}", status_code=status.HTTP_200_OK)
async def delete_student_endpoint(id: str):
    success = await delete_student(id)
    if not success:
        raise HTTPException(status_code=404, detail="Student not found")
    return {"message": "Student successfully deleted"}
