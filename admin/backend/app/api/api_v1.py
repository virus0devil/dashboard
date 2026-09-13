from fastapi import APIRouter
from .routes.assessment_category import assessment_category_router
from .routes.employee_auth import employee_auth_router
from .routes.compliance_category import compliance_category_router

api_router = APIRouter()

api_router.include_router(employee_auth_router, tags=["Employee Authentication"])
api_router.include_router(assessment_category_router, tags=["Assessment Category"])
api_router.include_router(compliance_category_router, tags=["Compliance Category"])