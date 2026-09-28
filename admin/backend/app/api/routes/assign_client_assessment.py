from fastapi import APIRouter, Depends, HTTPException
from app.core.database import getdb
from app.schemas.assign_client_assessment_schema import Assign_Client_Assessment_Schema, Assign_Client_Assessment_Response_Schema
from app.models.assign_client_assessment_model import Assign_Client_Assessment_Model
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, and_
from sqlalchemy.orm import selectinload
from typing import List

assign_client_assessment_router = APIRouter()

@assign_client_assessment_router.get("/clients/{client_id}/assessments",response_model=List[Assign_Client_Assessment_Response_Schema])
async def get_client_assessments(client_id: str,db: AsyncSession = Depends(getdb)):
    result = await db.execute(select(Assign_Client_Assessment_Model).options(selectinload(Assign_Client_Assessment_Model.assessment_category)).where(Assign_Client_Assessment_Model.client_id == client_id,Assign_Client_Assessment_Model.isActive.is_(True)))
    records = result.scalars().all()

    return [
        {
            "id": record.id,
            "client_name": record.client_id,
            "assessment_Category_id": record.assessment_Category_id,
            "assessment_name": (
                record.assessment_category.assessment_name
                if record.assessment_category
                else None
            )
        }
        for record in records
    ]

@assign_client_assessment_router.post("/clients/{client_id}/assessments")
async def assign_assessment(client_id: str,data: Assign_Client_Assessment_Schema,db: AsyncSession = Depends(getdb)):
    result = await db.execute(select(Assign_Client_Assessment_Model).where(Assign_Client_Assessment_Model.client_id == client_id))
    existing_records = result.scalars().all()

    existing_map = {
        record.assessment_Category_id: record
        for record in existing_records
    }

    selected_ids = set(data.assessment_ids)

    added = []
    reactivated = []
    deactivated = []

    for assessment_id in selected_ids:
        if assessment_id in existing_map:
            record = existing_map[assessment_id]
            if not record.isActive:
                record.isActive = True
                reactivated.append(assessment_id)
        else:

            record = Assign_Client_Assessment_Model(
                client_id=client_id,
                assessment_Category_id=assessment_id,
                isActive=True
            )

            db.add(record)

            added.append(assessment_id)


    for assessment_id, record in existing_map.items():
        if assessment_id not in selected_ids:
            if record.isActive:
                record.isActive = False
                deactivated.append(assessment_id)

    await db.commit()

    return {
        "message": "Assessments updated successfully",
        "client_id": client_id,
        "added": added,
        "reactivated": reactivated,
        "deactivated": deactivated,
        "active_now": list(selected_ids)
    }