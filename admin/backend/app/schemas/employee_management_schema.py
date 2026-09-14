from pydantic import BaseModel, Field, EmailStr
from typing import Annotated, List
from datetime import datetime
from pydantic_extra_types.phone_numbers import PhoneNumber
from app.core.roles import UserRole

class Employee_Management_Schema(BaseModel):
    fullname: Annotated[
        str,
        Field(
            max_length=50,
            description="Full Name",
        )
    ]
    email: Annotated[
        EmailStr,
        Field(
            max_length=50,
            description="Email ID"
        )
    ]
    password: Annotated[
        str,
        Field(
            max_length=100,
            description="Enter user password",
            default="PASSword@123"
        )
    ]
    mobile_number: Annotated[
        PhoneNumber,
        Field(
            description="User email"
        )
    ]
    designation: Annotated[
        str,
        Field(
            max_length=50,
            description="User Designation"
        )
    ]
    role: Annotated[
        UserRole,
        Field(
            default=UserRole.PENTESTER,
            description="User role"
        )
    ]

    isactive: Annotated[
        bool,
        Field(
            default=1,
            description="Is Active"
        )
    ]


class Employee_Management_Response_Schema(BaseModel):
    employee_id:str
    fullname: Annotated[
        str,
        Field(
            max_length=50,
            description="Full Name",
        )
    ]
    email: Annotated[
        EmailStr,
        Field(
            max_length=50,
            description="Email ID"
        )
    ]
    mobile_number: Annotated[
        PhoneNumber,
        Field(
            description="User email"
        )
    ]
    designation: Annotated[
        str,
        Field(
            max_length=50,
            description="User Designation"
        )
    ]

    role: UserRole

    isactive: Annotated[
        bool,
        Field(
            default=1,
            description="Is Active"
        )
    ]

    created_at: datetime 
    updated_at: datetime

    class Config:
        from_attributes = True

