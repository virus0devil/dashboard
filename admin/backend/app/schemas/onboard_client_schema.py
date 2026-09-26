from pydantic import BaseModel, Field, AnyUrl
from typing import Annotated

class Onboard_Client_Schema(BaseModel):
    company_name: Annotated[
        str,
        Field(
            description="Client Name"
        )
    ]
    address: Annotated[
        str,
        Field(
            description="Address of Company"
        )
    ]

class Onboard_Client_Response_Schemas(BaseModel):
    id:Annotated[
        str,
        Field(
            description="UUID"
        )
    ]
    company_name: Annotated[
        str,
        Field(
            description="Client Name"
        )
    ]
    address: Annotated[
        str,
        Field(
            description="Address of Company"
        )
    ]

    class Config:
        from_attributes = True