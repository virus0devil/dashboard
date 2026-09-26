from app.core.database import Base
from sqlalchemy import Column, String, DateTime, ForeignKey, Integer, Boolean
from sqlalchemy.orm import relationship
import uuid
from datetime import datetime

class Onboard_Client_Model(Base):
    __tablename__ = "companies"

    id = Column(String(36), primary_key=True, default=lambda:str(uuid.uuid4()))
    company_name = Column(String(255), unique=True, nullable=False)
    address = Column(String(500), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # client_assessment = relationship("Client_Assessment_Model", back_populates="client")
    # assets = relationship("Assets_Model", back_populates="client")
    # pentest_assign = relationship("Pentest_Inprogress_Model", back_populates="client")


# class Client_Assessment_Model(Base):
#     __tablename__ = "client_assessments"

#     id = Column(String(36), primary_key=True, default=lambda:str(uuid.uuid4()))
#     client_id = Column(String(36), ForeignKey("companies.id"), nullable=False)
#     assessment_type_id = Column(Integer, ForeignKey("assessmenttype.id"), nullable=False)
#     isActive = Column(Boolean, default=True)

#     client = relationship("Client_Details_Model", back_populates="client_assessment")
#     assessment_type = relationship("Assessment_Type_Model", back_populates="client_assessment")