from datetime import datetime
from sqlmodel import Field, SQLModel


class SQLModelWithDate(SQLModel):
    # created_at
    created_at: datetime = Field(default_factory=datetime.now, nullable=False)

    # updated_at
    updated_at: datetime = Field(
        default_factory=datetime.now, nullable=False,
        sa_column_kwargs={'onupdate': datetime.now})
