from fastapi import APIRouter, Query
from app.core.database import getdb
from fastapi.params import Depends
from sqlalchemy.orm import Session
from typing import List, Optional
from sqlalchemy.ext.asyncio.session import AsyncSession
from app.schemas.onboard_client_schema import Onboard_Client_Schema, Onboard_Client_Response_Schemas, Paginated_Client_Response_Schema
from app.models.onboard_client_model import Onboard_Client_Model
from sqlalchemy import select,func
from sqlalchemy.exc import IntegrityError

onboard_client_router = APIRouter()

@onboard_client_router.get("/clients",response_model=Paginated_Client_Response_Schema)
async def list_all_clients(page: int = 1,limit: int = 10,search: Optional[str] = None,db: AsyncSession = Depends(getdb)):
    if page < 1:
        page = 1

    if limit not in [10, 50, 100]:
        limit = 10

    query = select(Onboard_Client_Model)

    if search and search.strip():
        search_value = search.strip()

        query = query.where(
            Onboard_Client_Model.company_name.ilike(
                f"%{search_value}%"
            )
        )

    count_query = select(func.count()).select_from(query.subquery())

    count_result = await db.execute(count_query)
    total = count_result.scalar() or 0

    offset = (page - 1) * limit

    query = query.order_by(Onboard_Client_Model.company_name.asc()).offset(offset).limit(limit)
    result = await db.execute(query)
    clients = result.scalars().all()
    has_more = (page * limit) < total

    return {
        "data": clients,
        "page": page,
        "limit": limit,
        "total": total,
        "hasMore": has_more,
    }

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