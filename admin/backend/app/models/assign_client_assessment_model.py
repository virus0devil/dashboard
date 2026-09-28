from app.core.database import Base
from sqlalchemy import Column, String, DateTime, ForeignKey, Integer, Boolean, UniqueConstraint
from sqlalchemy.orm import relationship
import uuid
from datetime import datetime

class Assign_Client_Assessment_Model(Base):
    __tablename__ = "assign_client_assessments"

    __table_args__ = (
        UniqueConstraint("client_id","assessment_Category_id",name="uq_client_assessment"),
    )

    id = Column(String(36), primary_key=True, default=lambda:str(uuid.uuid4()))
    client_id = Column(String(36), ForeignKey("companies.id"), nullable=False)
    assessment_Category_id = Column(Integer, ForeignKey("assessmentcategory.id"), nullable=False)
    isActive = Column(Boolean, default=True)

    client = relationship("Onboard_Client_Model",back_populates="assign_client_assessments")
    assessment_category = relationship("Assessment_Category_Model", back_populates="client_assessment")