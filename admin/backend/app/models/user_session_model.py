import uuid
from sqlalchemy import Column,String,DateTime,Boolean,ForeignKey,func, Text
from app.core.database import Base

class User_Session_Model(Base):
    __tablename__ = "user_sessions"

    id = Column(String(36),primary_key=True,default=lambda: str(uuid.uuid4()))
    user_id = Column(String(36),ForeignKey("employee_management.id",ondelete="CASCADE",),nullable=False,index=True)
    refresh_token_jti = Column(String(36),unique=True,nullable=False,index=True)
    refresh_token_hash = Column(String(64),nullable=False)
    ip_address = Column(String(45),nullable=True)
    user_agent = Column(Text,nullable=True)
    device_name = Column(String(100),nullable=True)
    created_at = Column(DateTime(timezone=True),server_default=func.now(),nullable=False)
    last_used_at = Column(DateTime(timezone=True),server_default=func.now(),nullable=False)
    expires_at = Column(DateTime(timezone=True),nullable=False)
    revoked = Column(Boolean,default=False,nullable=False)
    revoked_at = Column(DateTime(timezone=True),nullable=True)