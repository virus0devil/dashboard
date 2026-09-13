from fastapi import APIRouter, Depends, HTTPException
from app.schemas.compliance_category_schema import Compliance_Category_Schema, Compliance_Category_Schema_Response
from typing import List
from sqlalchemy.ext.asyncio.session import AsyncSession
from app.core.database import getdb
from sqlalchemy import select
from app.models.compliance_category_model import Compliance_Category_Model

compliance_category_router = APIRouter()

@compliance_category_router.get("/compliancecategory", response_model=List[Compliance_Category_Schema_Response])
async def get_compliance_category(db:AsyncSession=Depends(getdb)):
    list_all_compliance = select(Compliance_Category_Model)
    result = await db.execute(list_all_compliance)
    return result.scalars().all()

@compliance_category_router.post("/compliancecategory", response_model=Compliance_Category_Schema_Response)
async def create_compliance_category(compliance:Compliance_Category_Schema, db:AsyncSession=Depends(getdb)):
    check_compliance = select(Compliance_Category_Model).where(Compliance_Category_Model.compliance_name == compliance.compliance_name)
    result = await db.execute(check_compliance)
    check_compliance_obj = result.scalars().first()

    if check_compliance_obj:
        raise HTTPException(status_code=409, detail="compliance Already exists")

    create_new_compliance = Compliance_Category_Model(
        compliance_name = compliance.compliance_name
    )

    db.add(create_new_compliance)
    await db.commit()
    await db.refresh(create_new_compliance)

    return create_new_compliance

@compliance_category_router.patch("/compliancecategory", response_model=Compliance_Category_Schema_Response)
async def update_compliance_category(id, compliance:Compliance_Category_Schema, db:AsyncSession=Depends(getdb)):
    check_compliance = select(Compliance_Category_Model).where(Compliance_Category_Model.id == id)
    result = await db.execute(check_compliance)
    check_compliance_obj = result.scalar_one_or_none()

    if not check_compliance_obj:
        raise HTTPException(status_code=409, detail="compliance not found")

    udpated_value = compliance.dict(exclude_unset=True)

    for field,value in udpated_value.items():
        setattr(check_compliance_obj,field,value)

    await db.commit()
    await db.refresh(check_compliance_obj)

    return check_compliance_obj