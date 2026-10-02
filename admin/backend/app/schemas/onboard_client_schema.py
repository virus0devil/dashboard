from pydantic import BaseModel, Field, ConfigDict
from typing import Annotated, List, Optional
from uuid import UUID

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


class Client_Details_Response_Schemas(BaseModel):
    id: UUID
    company_name: str
    address: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)


class Paginated_Client_Response_Schema(BaseModel):
    data: List[Client_Details_Response_Schemas]
    page: int
    limit: int
    total: int
    hasMore: bool