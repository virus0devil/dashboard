from datetime import datetime, timezone
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.employee_security import verify_password,hash_password,create_access_token,create_refresh_token,hash_token,decode_token
from app.models.employee_management_model import Employee_Management_Model
from app.models.user_session_model import User_Session_Model

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

async def create_session_for_user(
    session: AsyncSession,
    user: Employee_Management_Model,
    ip_address: str | None = None,
    user_agent: str | None = None,
    device_name: str | None = None,
):
    access_token = create_access_token(
        user_id=user.id
    )

    refresh_token, refresh_jti, refresh_expire = create_refresh_token(
        user_id=user.id
    )

    user_session = User_Session_Model(
        user_id=user.id,
        refresh_token_jti=refresh_jti,
        refresh_token_hash=hash_token(refresh_token),
        ip_address=ip_address,
        user_agent=user_agent,
        device_name=device_name,
        expires_at=refresh_expire,
        revoked=False,
    )

    session.add(user_session)

    await session.commit()
    await session.refresh(user_session)

    return {
        "access_token": access_token,
        "refresh_token": refresh_token,
        "token_type": "bearer",
    }

async def refresh_access_token(session: AsyncSession,refresh_token: str):
    try:
        payload = decode_token(refresh_token)

    except ValueError:
        return None

    if payload.get("type") != "refresh":
        return None

    user_id = payload.get("sub")
    jti = payload.get("jti")

    if not user_id or not jti:
        return None

    result = await session.execute(select(User_Session_Model).where(User_Session_Model.token_jti == jti))
    stored_token = result.scalar_one_or_none()

    if stored_token is None:
        return None

    if stored_token.revoked:
        return None

    now = datetime.now(timezone.utc)

    if stored_token.expires_at <= now:
        return None

    received_token_hash = hash_token(refresh_token)

    if received_token_hash != stored_token.token_hash:
        return None

    result = await session.execute(select(Employee_Management_Model).where(Employee_Management_Model.id == user_id))

    user = result.scalar_one_or_none()

    if user is None:
        return None

    if not user.isactive:
        return None

    stored_token.revoked = True
    stored_token.revoked_at = now

    new_access_token = create_access_token(user_id=user.id)
    (
        new_refresh_token,
        new_refresh_jti,
        new_refresh_expire,
    ) = create_refresh_token(
        user_id=user.id
    )

    new_refresh_record = User_Session_Model(
        user_id=user.id,
        token_jti=new_refresh_jti,
        token_hash=hash_token(new_refresh_token),
        expires_at=new_refresh_expire,
        revoked=False,
    )

    session.add(new_refresh_record)
    await session.commit()

    return {
        "access_token": new_access_token,
        "refresh_token": new_refresh_token,
        "token_type": "bearer",
    }
