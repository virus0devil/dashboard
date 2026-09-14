from typing import Annotated
from fastapi import APIRouter,Depends,HTTPException,status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import getdb
from app.core.dependencies import get_current_user
from app.core.employee_security import decode_token,verify_password,hash_password,hash_token,create_access_token,create_refresh_token
from app.models.employee_management_model import Employee_Management_Model
from app.models.refresh_token_model import Refresh_Token_Model
from app.schemas.auth_schema import LoginResponse,RefreshTokenRequest,ChangePasswordRequest,UserResponse
from app.core.auth_service import authenticate_user,create_tokens_for_user

employee_auth_router = APIRouter()

@employee_auth_router.post("/auth/login",response_model=LoginResponse)
async def login(form_data: Annotated[OAuth2PasswordRequestForm,Depends()],session: Annotated[AsyncSession,Depends(getdb)]):
    user = await authenticate_user(
        session=session,
        email=form_data.username,
        password=form_data.password,
    )

    if user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
            headers={
                "WWW-Authenticate": "Bearer"
            },
        )

    tokens = await create_tokens_for_user(
        session=session,
        user=user,
    )

    return tokens


@employee_auth_router.get("/user",response_model=UserResponse)
async def get_me(current_user: Annotated[Employee_Management_Model,Depends(get_current_user)]):
    return current_user

@employee_auth_router.post("/refresh",response_model=LoginResponse)
async def refresh_token(data: RefreshTokenRequest,session: Annotated[AsyncSession,Depends(getdb)]):
    try:
        payload = decode_token(data.refresh_token)
    except ValueError:
        raise HTTPException(
            status_code=401,
            detail="Invalid or expired refresh token",
        )

    if payload.get("type") != "refresh":
        raise HTTPException(
            status_code=401,
            detail="Invalid refresh token",
        )

    user_id = payload.get("sub")
    jti = payload.get("jti")

    if not user_id or not jti:
        raise HTTPException(
            status_code=401,
            detail="Invalid refresh token",
        )

    result = await session.execute(select(Refresh_Token_Model).where(Refresh_Token_Model.token_jti == jti))
    stored_token = result.scalar_one_or_none()

    if stored_token is None:
        raise HTTPException(
            status_code=401,
            detail="Refresh token not found",
        )

    if stored_token.revoked:
        raise HTTPException(
            status_code=401,
            detail="Refresh token has been revoked",
        )

    if stored_token.user_id != user_id:
        raise HTTPException(
            status_code=401,
            detail="Invalid refresh token",
        )

    if stored_token.expires_at < datetime.now(timezone.utc):
        raise HTTPException(
            status_code=401,
            detail="Refresh token expired",
        )

    if stored_token.token_hash != hash_token(data.refresh_token):
        raise HTTPException(
            status_code=401,
            detail="Invalid refresh token",
        )

    result = await session.execute(
        select(Employee_Management_Model)
        .where(
            Employee_Management_Model.id == user_id
        )
    )

    user = result.scalar_one_or_none()

    if user is None or not user.isactive:
        raise HTTPException(
            status_code=401,
            detail="User account is unavailable",
        )

    # Rotate old refresh token
    stored_token.revoked = True
    stored_token.revoked_at = datetime.now(timezone.utc)

    access_token = create_access_token(
        user_id=user.id
    )

    new_refresh_token, new_jti, new_expire = (
        create_refresh_token(
            user_id=user.id
        )
    )

    new_refresh_record = Refresh_Token_Model(
        user_id=user.id,
        token_jti=new_jti,
        token_hash=hash_token(
            new_refresh_token
        ),
        expires_at=new_expire,
        revoked=False,
    )

    session.add(new_refresh_record)

    await session.commit()

    return {
        "access_token": access_token,
        "refresh_token": new_refresh_token,
        "token_type": "bearer",
    }

@employee_auth_router.post("/logout")
async def logout(data: RefreshTokenRequest,session: Annotated[AsyncSession,Depends(getdb)]):
    try:
        payload = decode_token(data.refresh_token)
    except ValueError:
        return {
            "message": "Logged out successfully"
        }

    jti = payload.get("jti")

    if not jti:
        return {
            "message": "Logged out successfully"
        }

    result = await session.execute(select(Refresh_Token_Model).where(Refresh_Token_Model.token_jti == jti))
    stored_token = result.scalar_one_or_none()

    if stored_token and not stored_token.revoked:
        stored_token.revoked = True
        stored_token.revoked_at = datetime.now(
            timezone.utc
        )

        await session.commit()

    return {
        "message": "Logged out successfully"
    }