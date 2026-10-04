from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes.student import router as student_router

app = FastAPI(
    title="Student Record System API",
    description="API for managing student records",
    version="1.0.0"
)

# Configure CORS
origins = [
    "http://127.0.0.1:5500",
    "http://localhost:5500",
    "http://127.0.0.1:8080",
    "http://localhost:8080"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "Welcome to the Student Record System API"}

app.include_router(student_router, prefix="/api/v1/students", tags=["students"])
