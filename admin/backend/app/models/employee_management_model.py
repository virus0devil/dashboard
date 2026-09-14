from sqlalchemy import Column, String, CHAR, ForeignKey, Boolean, Integer
import uuid
from sqlalchemy.orm import relationship
from app.core.database import Base



class Employee_Management_Model(Base):
    __tablename__ = "employee_management"

    id = Column(String(36), primary_key=True, default=lambda:str(uuid.uuid4()))
    employee_id = Column(String(20), unique=True, nullable=False)
    fullname = fullname = Column(String(100), nullable=False)
    email = Column(String(100),nullable=False, unique=True)
    password = Column(String(255))
    mobile_number = Column(String(100))
    designation = Column(String(100))
    isadmin = Column(Boolean, default=False)
    isactive = Column(Boolean, default=True)
