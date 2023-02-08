from fastapi import APIRouter

# from app.api.v1.endpoints import login, users, tests, pages, formats
from app.api.v1.endpoints import tests, assets

api_router = APIRouter()
# api_router.include_router(login.router, tags=["login"])
# api_router.include_router(users.router, prefix="/users", tags=["users"])
api_router.include_router(tests.router, prefix="/tests", tags=["tests"])
# api_router.include_router(pages.router, prefix="/pages", tags=["pages"])
api_router.include_router(
    assets.router, prefix="/assets", tags=["assets"])
# api_router.include_router(utils.router, prefix="/utils", tags=["utils"])
# api_router.include_router(items.router, prefix="/items", tags=["items"])
