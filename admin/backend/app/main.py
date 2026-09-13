from fastapi import FastAPI
from app.api.api_v1 import api_router
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="Admin Dashboard", description="Dashboard", version="1.0.0")

app.include_router(api_router, prefix="/api/v1")

origin = [
    'http://localhost:5173',
    'http://127.0.0.1:5173'
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origin,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)