from fastapi import APIRouter
from app.core.database import getdb
from fastapi.params import Depends
from sqlalchemy.orm import Session
from typing import List, Annotated
from sqlalchemy.ext.asyncio.session import AsyncSession
from app.schemas.onboard_client_schema import Onboard_Client_Schema, Onboard_Client_Response_Schemas
from app.models.onboard_client_model import Onboard_Client_Model
from sqlalchemy import select
from sqlalchemy.exc import IntegrityError

onboard_client_router = APIRouter()

@onboard_client_router.get("/clients", response_model=List[Onboard_Client_Response_Schemas])
async def list_all_clients(db:AsyncSession = Depends(getdb)):
    list_clients = select(Onboard_Client_Model)
    result = await db.execute(list_clients)
    return result.scalars().all()

@onboard_client_router.post("/clients/add", response_model=Onboard_Client_Response_Schemas)
async def add_clients(client:Onboard_Client_Schema, db:AsyncSession = Depends(getdb)):
    new_client = Onboard_Client_Model(**client.dict())

    db.add(new_client)
    try:
        await db.commit()
        await db.refresh(new_client)
        return new_client
    except IntegrityError:
        await db.rollback()
        raise HTTPException(
            status_code=400,
            detail="Company already exists"
        )

@onboard_client_router.post("/client/assessment")
def select_assessment():
    pass

@onboard_client_router.patch("/client/update/{id}", response_model=Onboard_Client_Response_Schemas)
async def update_clients(id, client:Onboard_Client_Schema, db:AsyncSession = Depends(getdb)):
    check_client = select(Onboard_Client_Model).where(Onboard_Client_Model.id == id)
    result = await db.execute(check_client)
    check_client_obj = result.scalar_one_or_none()
    
    if not check_client_obj:
        raise ValueError("Company not found")
    
    updated_data = client.dict(exclude_unset=True)

    for field,value in updated_data.items():
        setattr(check_client_obj,field,value)

    await db.commit()
    await db.refresh(check_client_obj)

    return check_client_obj