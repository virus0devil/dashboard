from fastapi import APIRouter, Depends, HTTPException
from typing import List, Annotated
from app.core.database import getdb
from sqlalchemy.orm import Session
from app.schemas.employee_management_schema import Employee_Management_Schema, Employee_Management_Response_Schema
from datetime import datetime
from app.models.employee_management_model import Employee_Management_Model
from sqlalchemy.ext.asyncio.session import AsyncSession
from sqlalchemy import select, func
from app.core.employee_security import hash_password 
from sqlalchemy.ext.asyncio.session import AsyncSession
from sqlalchemy import select, func, Integer

employee_management_routes = APIRouter()

@employee_management_routes.get("/employee-details", response_model=List[Employee_Management_Response_Schema])
async def list_employee(db: AsyncSession = Depends(getdb)):
    list_all_employee = select(Employee_Management_Model)
    result = await db.execute(list_all_employee)
    return result.scalars().all()

async def generate_employee_id(db: AsyncSession) -> str:
    year = datetime.now().year
    prefix = f"DASH{year}"

    result = await db.execute(
        select(
            func.max(
                func.cast(
                    func.substring(
                        Employee_Management_Model.employee_id,
                        len(prefix) + 1
                    ),
                    Integer
                )
            )
        ).where(
            Employee_Management_Model.employee_id.like(f"{prefix}%")
        )
    )

    max_number = result.scalar() or 0

    return f"{prefix}{max_number + 1:04d}"

@employee_management_routes.post("/employee-details/add", response_model=Employee_Management_Response_Schema)
async def create_employee(employee: Employee_Management_Schema, db: AsyncSession = Depends(getdb)):
    existing_employee = select(Employee_Management_Model).where(Employee_Management_Model.email == employee.email)
    result = await db.execute(existing_employee)
    existing_employee_obj = result.first()

    if existing_employee_obj:
        raise HTTPException(status_code=400, detail="Email already exists")


    new_employee = Employee_Management_Model(
       employee_id="Temp",
        fullname=employee.fullname,
        email=str(employee.email).lower(),
        password=hash_password(employee.password),
        mobile_number=str(employee.mobile_number),
        designation=employee.designation,
        role=employee.role.value,
        isactive=employee.isactive,
    )

    db.add(new_employee)
    await db.flush()

    new_employee.employee_id = await generate_employee_id(db)

    await db.commit()
    await db.refresh(new_employee)

    return new_employee

@employee_management_routes.patch("/employee-details/update/{employee_id}", response_model=Employee_Management_Response_Schema)
async def update_employee(employee_id, employee:Employee_Management_Schema, db:AsyncSession = Depends(getdb)):
    employee_check = select(Employee_Management_Model).where(Employee_Management_Model.employee_id == employee_id)
    result = await db.execute(employee_check)
    employee_check_obj = result.scalar_one_or_none()
    
    if not employee_check_obj:
        raise ValueError("Employee not found")
    
    updated_data = employee.dict(exclude_unset=True)
    
    # if "password" in update_data:
    #     update_data["hashed_password"] = hash_password(update_data.pop("password")) TODO will update later
    
    for field,value in updated_data.items():
        setattr(employee_check_obj, field, value)

    await db.commit()
    await db.refresh(employee_check_obj)

    return employee_check_obj


# Actions button endpoints

@employee_management_routes.get("/employee-details/details/{employee_id}", response_model=Employee_Management_Response_Schema)
async def get_employee_details(employee_id, db:AsyncSession = Depends(getdb)):
    check_exist_employee = select(Employee_Management_Model).where(Employee_Management_Model.employee_id == employee_id)
    result = await db.execute(check_exist_employee)
    employee =  result.scalar_one_or_none()

    if not employee:
        raise HTTPException(status_code=400, detail="User not found")
    
    return employee

@employee_management_routes.patch("/employee-details/activate/{employee_id}", response_model=Employee_Management_Response_Schema)
async def activate(employee_id, db:AsyncSession = Depends(getdb)):
    result = await db.execute(select(Employee_Management_Model).where(Employee_Management_Model.employee_id == employee_id))
    employee_check_obj = result.scalar_one_or_none()

    if not employee_check_obj:
        raise HTTPException(status_code=404, detail="User not found")
    
    if employee_check_obj.isactive:
        return employee_check_obj

    employee_check_obj.isactive = True

    await db.commit()
    await db.refresh(employee_check_obj)

    return employee_check_obj

@employee_management_routes.patch("/employee-details/deactivate/{employee_id}", response_model=Employee_Management_Response_Schema)
async def deactivate(employee_id, db:AsyncSession = Depends(getdb)):
    result = await db.execute(select(Employee_Management_Model).where(Employee_Management_Model.employee_id == employee_id))
    employee_check_obj = result.scalar_one_or_none()

    if not employee_check_obj:
        raise HTTPException(status_code=404, detail="User not found")
    
    if not employee_check_obj.isactive:
        return employee_check_obj
    
    employee_check_obj.isactive = False
    await db.commit()
    await db.refresh(employee_check_obj)

    return employee_check_obj