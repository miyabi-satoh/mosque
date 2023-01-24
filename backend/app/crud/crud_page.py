from typing import List, Optional
from sqlalchemy.orm import Session

from app.crud.base import CRUDBase
from app.models.page import Page
from app.schemas.page import PageCreate, PageUpdate


class CRUDPage(CRUDBase[Page, PageCreate, PageUpdate]):
    def get_by_url(self, db: Session, *, url: str) -> Optional[Page]:
        return db.query(Page).filter(Page.url == url).first()

    def get_by_menuitem(self, db: Session, *, is_menuitem: bool) -> List[Page]:
        return db.query(Page).filter(Page.is_menuitem == is_menuitem).all()


page = CRUDPage(Page)
