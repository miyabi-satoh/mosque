from typing import List
from sqlmodel import Session, select

from app.crud.base import CRUDBase
from app.models.page import Page, PageCreate, PageUpdate


class CRUDPage(CRUDBase[Page, PageCreate, PageUpdate]):
    def get_by_url(self, db: Session, *, url: str) -> Page | None:
        return db.exec(select(Page).where(Page.url == url)).first()

    def get_by_menuitem(self, db: Session, *, is_menuitem: bool) -> List[Page]:
        return db.exec(select(Page).where(Page.is_menuitem == is_menuitem)).all()


page = CRUDPage(Page)
