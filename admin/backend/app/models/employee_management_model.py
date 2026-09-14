from sqlalchemy import Column, String, CHAR, ForeignKey, Boolean, Integer, DateTime, func
import uuid
from sqlalchemy.orm import relationship
from app.core.database import Base



class Employee_Management_Model(Base):
    __tablename__ = "employee_management"

    id = Column(String(36), primary_key=True, default=lambda:str(uuid.uuid4()))
    employee_id = Column(String(20), unique=True, nullable=False)
    fullname = Column(String(100), nullable=False)
    email = Column(String(100),nullable=False, unique=True)
    password = Column(String(255))
    mobile_number = Column(String(100))
    designation = Column(String(100))
    role = Column(String(30), nullable=False, index=True, default="pentester")
    isactive = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True),server_default=func.now(),nullable=False)
    updated_at = Column(DateTime(timezone=True),server_default=func.now(),onupdate=func.now(),nullable=False)