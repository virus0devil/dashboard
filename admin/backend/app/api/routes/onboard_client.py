from fastapi import APIRouter
from app.core.database import getdb
from fastapi.params import Depends
from sqlalchemy.orm import Session
from typing import List, Annotated
from sqlalchemy.ext.asyncio.session import AsyncSession
from app.schemas.onboard_client_schema import Onboard_Client_Schema, Onboard_Client_Response_Schemas
from app.models.onboard_client_model import Onboard_Client_Model
from sqlalchemy import select

onboard_client_router = APIRouter()

@onboard_client_router.get("/clients", response_model=List[Onboard_Client_Response_Schemas])
async def list_all_clients(db:AsyncSession = Depends(getdb)):
    list_clients = select(Onboard_Client_Model)
    result = await db.execute(list_clients)
    return result.scalars().all()

@onboard_client_router.post("/client/add")
async def add_clients():
    pass

@onboard_client_router.post("/client/assessment")
def select_assessment():
    pass

@onboard_client_router.patch("/client/update/{id}")
async def update_clients():
    pass