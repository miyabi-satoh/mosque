from datetime import datetime
from sqlmodel import Field, SQLModel

from app.models.base import SQLModelWithDate


class FormatBase(SQLModelWithDate):
    title: str
    description: str
    real_path: str | None


class Formats(FormatBase, table=True):
    id: int | None = Field(default=None, primary_key=True)


class FormatCreate(FormatBase):
    pass


class FormatRead(FormatBase):
    id: int


class FormatUpdate(SQLModel):
    title: str | None
    description: str | None
    real_path: bool | None
    created_at: datetime | None
    updated_at: datetime | None
