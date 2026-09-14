from fastapi import APIRouter, Depends, HTTPException
from fastapi.params import Depends
from app.core.database import getdb
from sqlalchemy.orm import Session
from typing import List, Annotated
from app.models.master_vulnerabilities_model import master_vulnerabilities_Models
from app.schemas.master_vulnerabilities_schema import master_vulnerabilities_Schema, master_vulnerabilities_Schema_Response
from cvss import CVSS3
# from app.core.security import get_current_user
from sqlalchemy.ext.asyncio.session import AsyncSession
from sqlalchemy import select

master_vulnerabilities_route = APIRouter()

@master_vulnerabilities_route.get("/masterVulnerabilities", response_model=List[master_vulnerabilities_Schema_Response])
async def list_master_vulnerabilities(db:AsyncSession = Depends(getdb)):
    list_master_vulnerabilities = select(master_vulnerabilities_Models)
    result = await db.execute(list_master_vulnerabilities)
    return result.scalars().all()

@master_vulnerabilities_route.post("/masterVulnerabilities/add", response_model=master_vulnerabilities_Schema_Response)
async def create_vulnerability(vulnerability:master_vulnerabilities_Schema, db:Session = Depends(getdb)):
    check_vulnerability_exist = select(master_vulnerabilities_Models).where(master_vulnerabilities_Models.vulnerability_name == vulnerability.vulnerability_name)
    result = await db.execute(check_vulnerability_exist)
    check_vuln_obj = result.scalars().first()

    if check_vuln_obj:
        raise HTTPException(status_code=401, detail="Vulnerability Already exists")

    cvss_score = CVSS3(vulnerability.cvss_vector).scores()[0]
    severity = "Low" if cvss_score < 4 else "Medium" if cvss_score < 7 else "High" if cvss_score < 9 else "Critical"
    create_new_vuln = master_vulnerabilities_Models(
        vulnerability_name=vulnerability.vulnerability_name,
        cvss_score=cvss_score,
        severity=severity,
        cvss_vector=vulnerability.cvss_vector,
        cwe_id=vulnerability.cwe_id,
        description=vulnerability.description,
        impact=vulnerability.impact,
        remediation=vulnerability.remediation,
        reference=str(vulnerability.reference)
    )

    db.add(create_new_vuln)
    await db.commit()
    await db.refresh(create_new_vuln)

    return create_new_vuln

@master_vulnerabilities_route.patch("/masterVulnerabilities/update/{vid}", response_model=master_vulnerabilities_Schema_Response)
async def update_vulnerability(vid, vulnerability:master_vulnerabilities_Schema, db:Session = Depends(getdb)):
    vuln_exist = select(master_vulnerabilities_Models).where(master_vulnerabilities_Models.vid == vid)
    result = await db.execute(vuln_exist)
    check_vuln_obj = result.scalar_one_or_none()

    if not check_vuln_obj:
        raise ValueError("Vulnerability not found")

    for field,value in vulnerability.dict(exclude_unset=True).items():
        setattr(check_vuln_obj, field,value)

    db.commit()
    db.refresh(check_vuln_obj)

    return check_vuln_obj