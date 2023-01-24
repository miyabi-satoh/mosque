from typing import Any

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.api import deps
from app import crud

router = APIRouter()


@router.get("/")
def read_menus(
    db: Session = Depends(deps.get_db),
) -> Any:
    """
    Retrieve menus.
    """
    menus = crud.menu.get_multi(db)
    return menus
