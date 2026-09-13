from pydantic import BaseModel, Field
from typing import Annotated


class Assessment_Category_Schema(BaseModel):
    assessment_name:Annotated[
        str,
        Field(
            description="Assessment Type"
        )
    ]

class Assessment_Category_Schema_Response(BaseModel):
    id:int
    assessment_name:Annotated[
        str,
        Field(
            description="Assessment Type"
        )
    ]