from app.core.database import Base
from sqlalchemy import Column, String, Integer
from sqlalchemy.orm import relationship

class Compliance_Category_Model(Base):
    __tablename__ = "compliancecategory"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    compliance_name = Column(String(100), nullable=False)