
from datetime import datetime
from sqlmodel import Field, SQLModel

from app.models.base import SQLModelWithDate


class LinkBase(SQLModelWithDate):
    url: str = Field(index=True)
    title: str
    description: str


class Link(LinkBase, table=True):
    id: int | None = Field(default=None, primary_key=True)


class LinkCreate(LinkBase):
    pass


class LinkRead(LinkBase):
    id: int


class LinkUpdate(SQLModel):
    url: str | None = None
    title: str | None = None
    description: str | None = None
    created_at: datetime | None = None
    updated_at: datetime | None = None
