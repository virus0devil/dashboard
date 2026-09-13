from app.core.database import Base
from sqlalchemy import Column, String, Integer
from sqlalchemy.orm import relationship

class Assessment_Category_Model(Base):
    __tablename__ = "assessmentcategory"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    assessment_name = Column(String(100), nullable=False)

    # client_assessment = relationship("Client_Assessment_Model", back_populates="assessment_type")
    # assets = relationship("Assets_Model", back_populates="assessment_type")