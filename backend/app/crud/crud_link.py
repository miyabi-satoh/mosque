from sqlmodel import Session, select

from app.crud.base import CRUDBase
from app.models.link import Link, LinkCreate, LinkUpdate


class CRUDLink(CRUDBase[Link, LinkCreate, LinkUpdate]):
    def get_by_url(self, db: Session, *, url: str) -> Link | None:
        return db.exec(select(Link).where(Link.url == url)).first()


link = CRUDLink(Link)
