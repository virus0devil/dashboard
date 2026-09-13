from pydantic import BaseModel, Field
from typing import Annotated


class Compliance_Category_Schema(BaseModel):
    compliance_name:Annotated[
        str,
        Field(
            description="Compliance Type"
        )
    ]

class Compliance_Category_Schema_Response(BaseModel):
    id:int
    compliance_name:Annotated[
        str,
        Field(
            description="Compliance Type"
        )
    ]