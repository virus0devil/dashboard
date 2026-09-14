from app.core.roles import UserRole

ROLE_PERMISSIONS = {
    UserRole.SUPER_ADMIN: {
        "*"
    },
    UserRole.ADMIN: {
        "*"
    }
}