import hashlib
import secrets
import uuid
from datetime import datetime, timedelta, timezone
from typing import Optional
from decouple import config
from jose import JWTError, jwt
from passlib.context import CryptContext

SECRET_KEY = config("SECRET_KEY")
ALGORITHM = config("ALGORITHM")
ACCESS_TOKEN_EXPIRE_MINUTES = 3600
REFRESH_TOKEN_EXPIRE_DAYS = 7


pwd_context = CryptContext(schemes=["argon2"],deprecated="auto")


def hash_password(password: str) -> str:
    return pwd_context.hash(password)

def verify_password(plain_password: str,hashed_password: str) -> bool:
    return pwd_context.verify(plain_password,hashed_password)

def hash_token(token: str) -> str:
    return hashlib.sha256(token.encode("utf-8")).hexdigest()

def create_access_token(user_id: str) -> str:
    now = datetime.now(timezone.utc)
    expire = now + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)

    payload = {
        "sub": str(user_id),
        "type": "access",
        "iat": now,
        "exp": expire,
        "jti": str(uuid.uuid4()),
    }

    return jwt.encode(payload,SECRET_KEY,algorithm=ALGORITHM)

def create_refresh_token(user_id: str):
    now = datetime.now(timezone.utc)
    expire = now + timedelta(days=REFRESH_TOKEN_EXPIRE_DAYS)
    jti = str(uuid.uuid4())
    payload = {
        "sub": str(user_id),
        "type": "refresh",
        "iat": now,
        "exp": expire,
        "jti": jti,
    }

    token = jwt.encode(payload,SECRET_KEY,algorithm=ALGORITHM)

    return token, jti, expire

def decode_token(token: str) -> dict:
    try:
        return jwt.decode(token,SECRET_KEY,algorithms=[ALGORITHM])

    except JWTError as exc:
        raise ValueError("Invalid or expired token") from exc