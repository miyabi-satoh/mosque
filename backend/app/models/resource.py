from datetime import datetime
from sqlmodel import Field, SQLModel

from app.models.base import SQLModelWithDate


class ResourceBase(SQLModelWithDate):
    slug: str | None
    path: str | None


class Resources(ResourceBase, table=True):
    id: int | None = Field(default=None, primary_key=True)


class ResourceCreate(ResourceBase):
    pass


class ResourceRead(ResourceBase):
    id: int


class ResourceUpdate(SQLModel):
    slug: str | None
    path: str | None
    created_at: datetime | None
    updated_at: datetime | None
