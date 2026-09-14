from typing import Annotated
from fastapi import Depends,HTTPException,status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import getdb
from app.core.permissions import ROLE_PERMISSIONS
from app.core.roles import UserRole
from app.core.employee_security import decode_token
from app.models.employee_management_model import (Employee_Management_Model)

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/v1/auth/login")


async def get_current_user(token: Annotated[str,Depends(oauth2_scheme)],session: Annotated[AsyncSession,Depends(getdb)]):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={
            "WWW-Authenticate": "Bearer"
        }
    )

    try:
        payload = decode_token(token)
        if payload.get("type") != "access":
            raise credentials_exception

        user_id = payload.get("sub")

        if not user_id:
            raise credentials_exception

    except ValueError:
        raise credentials_exception

    query = select(Employee_Management_Model).where(Employee_Management_Model.id == user_id)
    result = await session.execute(query)
    user = result.scalar_one_or_none()

    if user is None:
        raise credentials_exception

    if not user.isactive:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="User account is inactive"
        )

    try:
        UserRole(user.role)

    except ValueError:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN,detail="Invalid user role")

    return user


def require_role(*allowed_roles: UserRole):
    async def role_checker(current_user=Depends(get_current_user)):
        allowed_values = {
            role.value
            for role in allowed_roles
        }

        if current_user.role not in allowed_values:

            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Insufficient role privileges"
            )

        return current_user
    return role_checker


def require_permission(permission: str):
    async def permission_checker(current_user=Depends(get_current_user)):
        role = UserRole(current_user.role)
        permissions = ROLE_PERMISSIONS.get(role,set())

        if "*" in permissions:
            return current_user

        if permission not in permissions:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Permission denied"
            )

        return current_user
    return permission_checker