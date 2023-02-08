from datetime import datetime
from sqlmodel import Field, SQLModel

from app.models.base import SQLModelWithDate


class AssetBase(SQLModelWithDate):
    slug: str | None
    uri: str | None
    title: str | None


class Assets(AssetBase, table=True):
    id: int | None = Field(default=None, primary_key=True)


class AssetCreate(AssetBase):
    pass


class AssetRead(AssetBase):
    id: int


class AssetUpdate(SQLModel):
    slug: str | None
    uri: str | None
    title: str | None
    created_at: datetime | None
    updated_at: datetime | None
