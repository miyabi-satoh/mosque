from sqlmodel import Field, SQLModel


class UserBase(SQLModel):
    login_id: str = Field(index=True)
    is_active: bool = Field(default=True)
    is_superuser: bool = Field(default=False)


class User(UserBase, table=True):
    id: int | None = Field(default=None, primary_key=True)
    hashed_password: str


class UserCreate(UserBase):
    password: str


class UserRead(UserBase):
    id: int


class UserUpdate(SQLModel):
    login_id: str | None = None
    is_active: bool | None = None
    is_superuser: bool | None = None
    password: str | None = None
