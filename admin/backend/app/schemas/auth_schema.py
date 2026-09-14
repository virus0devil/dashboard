from pydantic import BaseModel, EmailStr, Field, ConfigDict

class LoginResponse(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"

class RefreshTokenRequest(BaseModel):
    refresh_token: str

class ChangePasswordRequest(BaseModel):
    current_password: str

    new_password: str = Field(
        min_length=8,
        max_length=128
    )

class UserResponse(BaseModel):

    model_config = ConfigDict(from_attributes=True)

    id: str
    employee_id: str
    fullname: str
    email: EmailStr
    mobile_number: str | None = None
    designation: str | None = None
    role: str
    isactive: bool