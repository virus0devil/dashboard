from datetime import datetime, timezone
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.employee_security import verify_password,hash_password,create_access_token,create_refresh_token,hash_token
from app.models.employee_management_model import Employee_Management_Model
from app.models.refresh_token_model import Refresh_Token_Model


async def authenticate_user(session: AsyncSession,email: str,password: str,):
    result = await session.execute(select(Employee_Management_Model).where(Employee_Management_Model.email == email.lower()))
    user = result.scalar_one_or_none()

    if user is None:
        return None

    if not user.isactive:
        return None

    if not verify_password(password, user.password):
        return None

    return user

async def create_tokens_for_user(session: AsyncSession,user: Employee_Management_Model):
    access_token = create_access_token(user_id=user.id)
    refresh_token, refresh_jti, refresh_expire = (create_refresh_token(user_id=user.id))

    refresh_token_record = Refresh_Token_Model(
        user_id=user.id,
        token_jti=refresh_jti,
        token_hash=hash_token(refresh_token),
        expires_at=refresh_expire,
        revoked=False,
    )

    session.add(refresh_token_record)
    await session.commit()

    return {
        "access_token": access_token,
        "refresh_token": refresh_token,
        "token_type": "bearer",
    }