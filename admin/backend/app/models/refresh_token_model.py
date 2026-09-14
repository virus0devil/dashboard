import uuid
from sqlalchemy import Column,String,DateTime,Boolean,ForeignKey,func
from app.core.database import Base

class Refresh_Token_Model(Base):

    __tablename__ = "refresh_tokens"

    id = Column(String(36),primary_key=True,default=lambda: str(uuid.uuid4()))
    user_id = Column(String(36),ForeignKey("employee_management.id", ondelete="CASCADE"),nullable=False,index=True)
    token_jti = Column(String(36),unique=True,nullable=False,index=True)
    token_hash = Column(String(128),nullable=False)
    expires_at = Column(DateTime(timezone=True),nullable=False)
    revoked = Column(Boolean,default=False,nullable=False)
    created_at = Column(DateTime(timezone=True),server_default=func.now(),nullable=False)
    revoked_at = Column(DateTime(timezone=True),nullable=True)