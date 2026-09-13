from fastapi import APIRouter, Depends, HTTPException
from app.schemas.assessment_category_schema import Assessment_Category_Schema, Assessment_Category_Schema_Response
from typing import List
from sqlalchemy.ext.asyncio.session import AsyncSession
from app.core.database import getdb
from sqlalchemy import select
from app.models.assessment_category_model import Assessment_Category_Model


assessment_category_router = APIRouter()

@assessment_category_router.get("/assessmentcategory", response_model=List[Assessment_Category_Schema_Response])
async def get_assessment_category(db:AsyncSession=Depends(getdb)):
    list_all_assessment = select(Assessment_Category_Model)
    result = await db.execute(list_all_assessment)
    return result.scalars().all()

@assessment_category_router.post("/assessmentcategory", response_model=Assessment_Category_Schema_Response)
async def create_assessment_category(assessment:Assessment_Category_Schema, db:AsyncSession=Depends(getdb)):
    check_assessment = select(Assessment_Category_Model).where(Assessment_Category_Model.assessment_name == assessment.assessment_name)
    result = await db.execute(check_assessment)
    check_assessment_obj = result.scalars().first()

    if check_assessment_obj:
        raise HTTPException(status_code=409, detail="Assessment Already exists")

    create_new_assessment = Assessment_Category_Model(
        assessment_name = assessment.assessment_name
    )

    db.add(create_new_assessment)
    await db.commit()
    await db.refresh(create_new_assessment)

    return create_new_assessment

@assessment_category_router.patch("/assessmentcategory", response_model=Assessment_Category_Schema_Response)
async def update_assessment_category(id, assessment:Assessment_Category_Schema, db:AsyncSession=Depends(getdb)):
    check_assessment = select(Assessment_Category_Model).where(Assessment_Category_Model.id == id)
    result = await db.execute(check_assessment)
    check_assessment_obj = result.scalar_one_or_none()

    if not check_assessment_obj:
        raise HTTPException(status_code=409, detail="Assessment not found")

    udpated_value = assessment.dict(exclude_unset=True)

    for field,value in udpated_value.items():
        setattr(check_assessment_obj,field,value)

    await db.commit()
    await db.refresh(check_assessment_obj)

    return check_assessment_obj