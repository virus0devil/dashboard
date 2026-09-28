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
    
    assign_client_assessments = relationship("Assign_Client_Assessment_Model",back_populates="client")
    # assets = relationship("Assets_Model", back_populates="client")
    # pentest_assign = relationship("Pentest_Inprogress_Model", back_populates="client")