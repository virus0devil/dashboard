from pydantic import BaseModel, Field, EmailStr
from typing import Annotated, List
from pydantic_extra_types.phone_numbers import PhoneNumber

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
    isadmin:Annotated[
        bool,
        Field(
            default="False",
            description="Is admin"
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

    isactive: Annotated[
        bool,
        Field(
            default=1,
            description="Is Active"
        )
    ]

    class Config:
        from_attributes = True

