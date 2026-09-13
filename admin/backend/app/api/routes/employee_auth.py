from fastapi import APIRouter

employee_auth_router = APIRouter()

@employee_auth_router.post("/auth/login")
def login():
    pass