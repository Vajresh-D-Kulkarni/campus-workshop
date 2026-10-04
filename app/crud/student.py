import uuid
from app.database import student_collection
from app.schemas.student import student_entity, student_list_entity
from app.models.student import StudentCreate, StudentUpdate

async def create_student(student: StudentCreate):
    student_dict = student.model_dump()
    student_dict["_id"] = str(uuid.uuid4())
    await student_collection.insert_one(student_dict)
    new_student = await student_collection.find_one({"_id": student_dict["_id"]})
    return student_entity(new_student)

async def get_all_students():
    students = await student_collection.find().to_list(1000)
    return student_list_entity(students)

async def get_student(id: str):
    student = await student_collection.find_one({"_id": id})
    if student:
        return student_entity(student)
    return None

async def update_student(id: str, data: StudentUpdate):
    update_data = {k: v for k, v in data.model_dump().items() if v is not None}
    if update_data:
        await student_collection.update_one({"_id": id}, {"$set": update_data})
    student = await student_collection.find_one({"_id": id})
    if student:
        return student_entity(student)
    return None

async def delete_student(id: str):
    student = await student_collection.find_one({"_id": id})
    if student:
        await student_collection.delete_one({"_id": id})
        return True
    return False
