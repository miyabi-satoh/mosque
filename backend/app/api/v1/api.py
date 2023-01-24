from fastapi import APIRouter

# from app.api.v1.endpoints import items, login, users, utils
from app.api.v1.endpoints import login, users, tests, menus

api_router = APIRouter()
api_router.include_router(login.router, tags=["login"])
api_router.include_router(users.router, prefix="/users", tags=["users"])
api_router.include_router(tests.router, prefix="/tests", tags=["tests"])
api_router.include_router(menus.router, prefix="/menus", tags=["menus"])
# api_router.include_router(utils.router, prefix="/utils", tags=["utils"])
# api_router.include_router(items.router, prefix="/items", tags=["items"])
