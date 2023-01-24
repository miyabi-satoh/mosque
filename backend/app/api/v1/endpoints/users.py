from typing import Any, List

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlmodel import Session

from app import models, crud
from app.api import deps
from app.db.session import get_db
# from app.utils import send_new_account_email

router = APIRouter()


@router.get("/", response_model=List[models.UserRead])
def read_users(
    db: Session = Depends(get_db),
    offset: int = 0,
    limit: int = Query(default=100, lte=100),
    current_user: models.User = Depends(deps.get_current_active_superuser),
) -> Any:
    """
    Retrieve users.
    """
    users = crud.user.get_multi(db, offset=offset, limit=limit)
    return users


@router.post("/", response_model=models.UserRead)
def create_user(
    *,
    db: Session = Depends(get_db),
    user_in: models.UserCreate,
    current_user: models.User = Depends(deps.get_current_active_superuser),
) -> Any:
    """
    Create new user.
    """
    # ユニーク値(login_id)の重複チェック
    user = crud.user.get_by_login_id(db, login_id=user_in.login_id)
    if user:
        raise HTTPException(
            status_code=400,
            detail="The user with this login_id already exists in the system.",
        )
    user = crud.user.create(db, obj_in=user_in)
    # if settings.EMAILS_ENABLED and user_in.email:
    #     send_new_account_email(
    #         email_to=user_in.email, username=user_in.email, password=user_in.password
    #     )
    return user


@router.put("/me", response_model=models.UserRead)
def update_user_me(
    *,
    db: Session = Depends(get_db),
    user_in: models.UserUpdate,
    current_user: models.User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Update own user.
    """
    user = crud.user.update(db, db_obj=current_user, obj_in=user_in)
    return user


@router.get("/me", response_model=models.UserRead)
def read_user_me(
    current_user: models.User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Get current user.
    """
    return current_user


# @router.post("/open", response_model=schemas.User)
# def create_user_open(
#     *,
#     db: Session = Depends(deps.get_db),
#     password: str = Body(...),
#     email: str = Body(...),
#     # full_name: str = Body(None),
# ) -> Any:
#     """
#     Create new user without the need to be logged in.
#     """
#     if not settings.USERS_OPEN_REGISTRATION:
#         raise HTTPException(
#             status_code=403,
#             detail="Open user registration is forbidden on this server",
#         )
#     user = crud.user.get_by_email(db, email=email)
#     if user:
#         raise HTTPException(
#             status_code=400,
#             detail="The user with this username already exists in the system",
#         )
#     user_in = schemas.UserCreate(password=password, email=email)
#     # user_in = schemas.UserCreate(password=password, email=email, full_name=full_name)
#     user = crud.user.create(db, obj_in=user_in)
#     return user


@router.get("/{user_id}", response_model=models.UserRead)
def read_user_by_id(
    user_id: int,
    current_user: models.User = Depends(deps.get_current_active_user),
    db: Session = Depends(get_db),
) -> Any:
    """
    Get a specific user by id.
    """
    user = crud.user.get(db, id=user_id)
    if user == current_user:
        return user
    if not crud.user.is_superuser(current_user):
        raise HTTPException(
            status_code=400, detail="The user doesn't have enough privileges"
        )
    return user


@router.put("/{user_id}", response_model=models.UserRead)
def update_user(
    *,
    db: Session = Depends(get_db),
    user_id: int,
    user_in: models.UserUpdate,
    current_user: models.User = Depends(deps.get_current_active_superuser),
) -> Any:
    """
    Update a user.
    """
    user = crud.user.get(db, id=user_id)
    if not user:
        raise HTTPException(
            status_code=404,
            detail="The user with this username does not exist in the system",
        )
    user = crud.user.update(db, db_obj=user, obj_in=user_in)
    return user
