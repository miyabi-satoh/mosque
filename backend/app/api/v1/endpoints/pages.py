from typing import Any, List
from fastapi import APIRouter, Depends
from sqlmodel import Session

from app import crud, models
from app.db.session import get_db

router = APIRouter()


@router.get("/", response_model=models.PageRead)
def read_page_by_url(
    url: str,
    db: Session = Depends(get_db),
) -> Any:
    """
    Get a specific page by url.
    """
    page = crud.page.get_by_url(db, url=url)
    return page


@router.get("/menuitems", response_model=List[models.PageRead])
def read_pages_is_menuitem_true(
    db: Session = Depends(get_db),
) -> Any:
    """
    Retrieve pages with is_menuitem=True.
    """
    pages = crud.page.get_by_menuitem(db, is_menuitem=True)
    return pages
