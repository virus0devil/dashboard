from pydantic import BaseModel
from typing import List, Optional


class Assign_Client_Assessment_Schema(BaseModel):
    assessment_ids: List[int]


class Assign_Client_Assessment_Response_Schema(BaseModel):
    id: str
    client_name: str
    assessment_Category_id: int
    assessment_name: Optional[str] = None