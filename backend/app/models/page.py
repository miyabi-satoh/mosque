from datetime import datetime
from sqlmodel import Field, SQLModel

from app.models.base import SQLModelWithDate


class PageBase(SQLModelWithDate):
    url: str = Field(index=True)
    title: str
    description: str
    is_menuitem: bool = Field(index=True)


class Page(PageBase, table=True):
    id: int | None = Field(default=None, primary_key=True)


class PageCreate(PageBase):
    pass


class PageRead(PageBase):
    id: int


class PageUpdate(SQLModel):
    url: str | None
    title: str | None
    description: str | None
    is_menuitem: bool | None
    created_at: datetime | None
    updated_at: datetime | None
